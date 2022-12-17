const ws = require("ws");
const client = new ws("wss://edge.faceit.com/v1/ws");

const clanid = "61395179-2483-49c9-a9b2-dd251a5ca0e0";

let last = null;

const outgoing = {
    welcomeAnonymous: "CPjKxAISFgoJMC4wLjAtZGV2Eglhbm9ueW1vdXM",
    pong: "CAASAhgC",
    subscribe: {
        public: "CAASGAgBGAMiEgoGcHVic3ViEggKBnB1YmxpYw==",
        clan: (id) => Buffer.concat([Buffer.from("CAASOwgFGAMiNQoGcHVic3ViEisK", "base64"), Buffer.from(")hubs-" + id)]).toString("base64"),
    },
};

const incoming = {
    welcome: "CPjKxAISHQobRkFDRUlUIEVkZ2UgPHByb2Q+ICgxLjMzLjEp",
    ping: "EgIYAg==",
    event: {
        // <12_bytes> + <event> + <3_bytes> + <json_payload>
        // entity_activity: "ZW50aXR5X2FjdGl2aXR5",
        lobby_created: "bG9iYnlfY3JlYXRlZA==",
        lobby_destroyed: "D2xvYmJ5X2Rlc3Ryb3llZA==", // <9_bytes> + <event> + <2_bytes> + <json_payload>
        lobby_player_joined: "bG9iYnlfcGxheWVyX2pvaW5lZBI=",
        lobby_updated: "bG9iYnlfdXBkYXRlZA==",
        lobby_player_left: "bG9iYnlfcGxheWVyX2xlZnQ=",
    },
};

function send(msg) {
    client.send(Buffer.from(msg, "base64"));
}

function init() {
    // subscribe to clan
    send(outgoing.subscribe.clan(clanid));
}

function parseEvent(nbytes_left, nbytes_right, eventType, msg) {
    // <left_bytes> + <event> + <right_bytes> + <json_payload>
    const eventTypeLength = Buffer.from(eventType, "base64").length;
    const event = msg.slice(nbytes_left, nbytes_left + eventTypeLength);
    const payload = msg.slice(nbytes_left + eventTypeLength + nbytes_right);

    if (event.toString("base64") !== eventType) return null;
    return payload;
}

client.on("open", () => {
    console.log("[i] Opened connection to FACEIT Edge");

    // send the welcome anonymous message
    send(outgoing.welcomeAnonymous);
});

client.on("close", (code, reason) => {
    console.log("[i] Closed connection to FACEIT Edge: " + code + " " + reason);
});

client.on("message", (message) => {
    // heartbeat
    if (message.equals(Buffer.from(incoming.ping, "base64"))) {
        send(outgoing.pong);
        return;
    }

    // welcome message
    if (message.equals(Buffer.from(incoming.welcome, "base64"))) {
        console.log(`[i] Welcome accepted. Init`);
        init();
        return;
    }

    // event
    const events_12_3 = [incoming.event.lobby_created, incoming.event.lobby_player_joined, incoming.event.lobby_updated, incoming.event.lobby_player_left];
    const events_9_2 = [incoming.event.lobby_destroyed];

    for (eventType of events_12_3) {
        const parsed = parseEvent(12, 3, eventType, message);
        if (parsed !== null) {
            const thisMsg = {
                event: eventType,
                payload: parsed,
            };
            if (thisMsg === last) return;
            last = thisMsg; // sometimes the same event is sent twice
            console.log(Buffer.from(eventType, "base64").toString("utf-8"));
            return;
        }
    }

    for (eventType of events_9_2) {
        const parsed = parseEvent(9, 2, eventType, message);
        if (parsed !== null) {
            const thisMsg = {
                event: eventType,
                payload: parsed,
            };
            if (thisMsg === last) return;
            last = thisMsg; // sometimes the same event is sent twice
            console.log(Buffer.from(eventType, "base64").toString("utf-8"));
            return;
        }
    }
});
