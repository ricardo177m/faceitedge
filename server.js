const ws = require("ws");
const fs = require("fs");
const moment = require("moment");
const { parseEvent, incoming } = require("./parser");

const client = new ws("wss://edge.faceit.com/v1/ws");

const shouldlog = true;
const matchid = "1-b324863f-e642-4b9e-bee6-279f13274cb3";

let stream;

if (shouldlog) {
  const name = "logs/" + moment().format("yyyy-MM-DD_HH-mm-ss-SSS") + ".txt";
  stream = fs.createWriteStream(name, { flags: "a" });
}

const outgoing = {
  welcomeAnonymous: "CPjKxAISFgoJMC4wLjAtZGV2Eglhbm9ueW1vdXM=",
  welcomeToken: (token) => Buffer.concat([Buffer.from("CPjKxAISOAoJMC4wLjAtZGV2Eis=", "base64"), Buffer.from("Bearer " + token, "utf-8")]).toString("base64"),
  pong: "CAASAhgC",
  subscribe: {
    public: "CAASGAgBGAMiEgoGcHVic3ViEggKBnB1YmxpYw==",
    clan: (id) => Buffer.concat([Buffer.from("CAASOwgFGAMiNQoGcHVic3ViEisK", "base64"), Buffer.from(")hubs-" + id)]).toString("base64"),
    user: (id) => Buffer.concat([Buffer.from("CAASQwgCGAMiPQoGcHVic3ViEjMKMXByaXZhdGUtdXNlci0=", "base64"), Buffer.from(id)]).toString("base64"),
    lobby: "",
    match: (id) => Buffer.concat([Buffer.from("CAASPQgCGAMiNwoGcHVic3ViEi0KK3Jvb21f", "base64"), Buffer.from(id)]).toString("base64"),
    democracy: (id) => Buffer.concat([Buffer.from("CAASQggmGAMiPAoGcHVic3ViEjIKMGRlbW9jcmFjeS0=", "base64"), Buffer.from(id)]).toString("base64"),
  },
};

function send(msg) {
  log(msg, false);
  client.send(Buffer.from(msg, "base64"));
}

function log(msg, inc) {
  if (!shouldlog) return;
  const time = moment().format("yyyy-mm-DD_HH-mm-ss");
  stream.write(`${time} ${inc ? "INC" : "OUT"} ${Buffer.from(msg, "utf-8").toString("base64")}\n`);
}

function init() {
  send(outgoing.subscribe.public);
  console.log("[i] Subscribed to public");
  send(outgoing.subscribe.match(matchid));
  console.log("[i] Subscribed to match " + matchid);
  send(outgoing.subscribe.democracy(matchid));
  console.log("[i] Subscribed to democracy " + matchid);
}

client.on("open", () => {
  console.log("[i] Opened connection to FACEIT Edge");

  // send the welcome anonymous message
  send(outgoing.welcomeAnonymous);
  console.log("[i] Sent welcome anonymous");
});

client.on("close", (code, reason) => {
  console.log(`[i] Closed connection to FACEIT Edge: ${code} ${reason}`);
});

client.on("message", (message) => {
  log(message, true);

  // console.log(`RAW: ${Buffer.from(message, "utf-8")}`);

  const e = parseEvent(message);

  if (e === null) return console.log(" [e] Unknown event");
  if (e.event === "duplicate") return console.log(" [e] Duplicate event");

  console.log(" [e] Received event: " + e.event);

  switch (e.event) {
    case "welcome":
      console.log(`[i] Welcome accepted, version ${e.payload}`);
      init();
      break;
    case "ping":
      send(outgoing.pong);
      break;
  }
});
