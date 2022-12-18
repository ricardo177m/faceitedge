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
    events: [
        { name: "lobby_player_joined", padding: { l: 12, r: 3 } },
        { name: "lobby_player_left", padding: { l: 12, r: 3 } },
        { name: "lobby_created", padding: { l: 12, r: 3 } },
        { name: "lobby_destroyed", padding: { l: 9, r: 2 } },
        { name: "lobby_updated", padding: { l: 12, r: 3 } },
    ],
    // <12_bytes> + <event> + <3_bytes> + <json_payload>
    // lobby_destroyed -> <9_bytes> + <event> + <2_bytes> + <json_payload>
};

function send(msg) {
    client.send(Buffer.from(msg, "base64"));
}

function init() {
    // subscribe to clan
    send(outgoing.subscribe.clan(clanid));
}

function parseEvent(eventType, msg) {
    // <left_bytes> + <event> + <right_bytes> + <json_payload>
    const bytesLeft = eventType.padding.l;
    const bytesRight = eventType.padding.r;
    const eventTypeLength = Buffer.from(eventType.name, "utf8").length;

    const event = msg.subarray(bytesLeft, bytesLeft + eventTypeLength);
    const payload = msg.subarray(bytesLeft + eventTypeLength + bytesRight);

    const presumedEvent = Buffer.from(eventType.name, "utf8");

    // compare presumed event with incoming event
    if (!presumedEvent.equals(event)) return null;

    console.log("\n--- EVENT ---");
    console.log("incoming event: " + event.toString("utf8"));
    console.log("payload:\n" + payload.toString("utf8"));

    return JSON.parse(payload);
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
    if (message.equals(Buffer.from(incoming.ping, "base64"))) return send(outgoing.pong);

    // event
    for (eventType of incoming.events) {
        const parsed = parseEvent(eventType, message);
        if (parsed !== null) {
            const incomingEvent = {
                event: eventType.name,
                payload: parsed,
            };
            if (incomingEvent === last) return; // workaround for duplicate events
            last = incomingEvent; // (sometimes the same event is sent twice)
            
            // do something with incomingEvent

            return;
        }
    }

    // welcome message
    if (message.equals(Buffer.from(incoming.welcome, "base64"))) {
        console.log(`[i] Welcome accepted. Init`);
        init();
        return;
    }
});
