const fs = require("fs");
const readline = require("readline");
const parser = require("./parser");
const protobuf = require("protobufjs");

const filename = "logs/2024-10-21_14-18-32-901.txt";

async function run() {
  const root = await protobuf.load("protobufs/event.proto");
  const Event = root.lookupType("userpackage.Msg1");

  const lineReader = require("readline").createInterface({
    input: require("fs").createReadStream(filename),
  });

  lineReader.on("line", function (line) {
    // const excerpt = Buffer.from(line.split(" ")[1], "base64").subarray(9, 50)
    // console.log(excerpt.toString("utf8"));

    if (line.split(" ")[1] === "OUT") return;

    const event = parser.parseEvent(Buffer.from(line.split(" ")[2], "base64"));
    console.log(event.event);
    if (event.event === "welcome" || event.event === "pubsub_confirmation") return;

    const buf = Buffer.from(line.split(" ")[2], "base64");

    console.log(Buffer.isBuffer(buf));
    const obj = Event.decode(buf);
    console.log(obj);
    console.log("---");
  });

  // const buf = Event.encode({ field1: 45, topic: { field2: 1, event: { field3: "match_res", field4: '{data:"data"}' } } }).finish();

  // console.log(Buffer.isBuffer(buf));
  // console.log(buf.toString("utf8"));
  // console.log(buf.toString("hex"));

  // console.log(buf.toString("utf8"));

  // const obj = Event.decode(buf);
  // console.log(obj);
}

run().catch((err) => console.log(err));
