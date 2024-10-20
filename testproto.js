const protobuf = require("protobufjs");

run().catch((err) => console.log(err));

// https://protobuf-decoder.netlify.app/

async function run() {
  const root = await protobuf.load("protobufs/event.proto");
  const Event = root.lookupType("userpackage.Channel");

  const buf = Event.encode({ field1: 45, topic: { field2: 1, event: { field3: "match_res", field4: '{data:"data"}' } } }).finish();

  console.log(Buffer.isBuffer(buf));
  console.log(buf.toString("utf8"));
  console.log(buf.toString("hex"));

  console.log(buf.toString("utf8"));

  const obj = Event.decode(buf);
  console.log(obj);
}
