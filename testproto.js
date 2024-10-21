const protobuf = require("protobufjs");

run().catch((err) => console.log(err));

// https://protobuf-decoder.netlify.app/

async function run() {
  const root = await protobuf.load("protobufs/event.proto");
  const Event = root.lookupType("userpackage.Msg1");

  // const buf = Event.encode({ field1: 45, topic: { field2: 1, event: { field3: "match_res", field4: '{data:"data"}' } } }).finish();

  const buf = Buffer.from(
    "CAMS5A0IARLfDQoSbWF0Y2hfc3RhdGVfdXBkYXRlEsgNeyJlbnRpdHkiOnsiY2hlY2tJbiI6eyJjaGVja2VkSW4iOmZhbHNlLCJlbmRUaW1lIjoiMjAyNC0xMC0yMVQxNDoxODo1NVoiLCJ0aW1lIjozMCwidG90YWxDaGVja2VkSW4iOjEwLCJ0b3RhbFBsYXllcnMiOjEwfSwiY3JlYXRlZEF0IjoiMjAyNC0xMC0yMVQxNDoxODoyNVoiLCJlbnRpdHkiOnsiaWQiOiJmNDE0OGRkZC1iY2U4LTQxYjgtOTEzMS1lZTgzYWZjZGQ2ZGQiLCJuYW1lIjoiQ09NUEVUSVRJVkUgNXY1IiwidHlwZSI6Im1hdGNobWFraW5nIn0sImVudGl0eUN1c3RvbSI6eyJlZmZlY3RpdmVSYW5raW5nIjoxNjY0LjIsIm1hdGNoZXJNYXRjaElkIjoiZTNlNzA0ZGItMzE5Yy00NzBmLTk0ODQtODIxZGM0OGZiYWNmIiwicGFydGllcyI6eyIwODUyZWYwYS1mNDAwLTQ0YTItYjE0Ni0xNGI2ZDIzNzFhYmIiOlsiM2YwYmM0MGYtMDVlZi00M2NkLWIxNGMtZWE3ZTExYzlhNjIyIl0sIjEyMmE0MmVkLWMzZTUtNGFkNi04MjA4LTQwODhjMmMzYzUwOCI6WyIxMjJhNDJlZC1jM2U1LTRhZDYtODIwOC00MDg4YzJjM2M1MDgiXSwiNTE2YzM1YjctZDAxZi00NTgyLTk2MTAtYTY5YWE5ZjhlMmZhIjpbIjUxNmMzNWI3LWQwMWYtNDU4Mi05NjEwLWE2OWFhOWY4ZTJmYSJdLCI1YzEwYzhhMy04MTEwLTQ5MmItOWE3ZC05MjcyNDEyYzA1N2EiOlsiNDYzMjNhZmItZjcwNy00ZTczLTkxOTYtOTk2MTM3ZjQ1NjJjIiwiNGQ0ZGJjMGItNDdkNS00Y2ZhLTlhNjAtZjRiMzNjODYyODhkIl0sIjVkMWVmYTUzLTk4N2EtNDdmZS1hNzk2LTA2MzlhZGMxOWYxNSI6WyJhNTM4N2FhNy1lYTc1LTQzYzYtOTM2YS0wYjEwOGY4YTJlNWUiXSwiODY4ZGRkZjctNmYwMi00Y2QxLThiZmMtNjFiZWQ4OTRmM2Y0IjpbIjE3YzEyZGYzLWZjODUtNDlhMy1iOWRkLWMxY2EyN2FjOWU1MyIsIjczM2Y1NTc2LTFkYzAtNGZiOC05YTkxLTU5Y2U2OWJlZDQxMiJdLCJkMTEyNGFlNS0yOTFjLTQyYjItYWM0Ni01YzA3MDQ3MGRjNjMiOlsiZDExMjRhZTUtMjkxYy00MmIyLWFjNDYtNWMwNzA0NzBkYzYzIl0sImY1NDdkYjRlLTI0ZDAtNDQxMy1hMTBmLTFmMjMxNzYyNmJiMiI6WyJmNTQ3ZGI0ZS0yNGQwLTQ0MTMtYTEwZi0xZjIzMTc2MjZiYjIiXX0sInBhcnR5UXVldWVEdXJhdGlvbnMiOnsiMDg1MmVmMGEtZjQwMC00NGEyLWIxNDYtMTRiNmQyMzcxYWJiIjo1My4wNTksIjEyMmE0MmVkLWMzZTUtNGFkNi04MjA4LTQwODhjMmMzYzUwOCI6OTMuMzUxLCI1MTZjMzViNy1kMDFmLTQ1ODItOTYxMC1hNjlhYTlmOGUyZmEiOjE0Ljc4MSwiNWMxMGM4YTMtODExMC00OTJiLTlhN2QtOTI3MjQxMmMwNTdhIjowLjQzNiwiNWQxZWZhNTMtOTg3YS00N2ZlLWE3OTYtMDYzOWFkYzE5ZjE1Ijo0LjgwOSwiODY4ZGRkZjctNmYwMi00Y2QxLThiZmMtNjFiZWQ4OTRmM2Y0IjoyNi4wOTgsImQxMTI0YWU1LTI5MWMtNDJiMi1hYzQ2LTVjMDcwNDcwZGM2MyI6NC40ODEsImY1NDdkYjRlLTI0ZDAtNDQxMy1hMTBmLTFmMjMxNzYyNmJiMiI6MTUuNjk3fSwicXVldWVJZCI6IjY2NTc0ZTQxNDJiMjcwNWQ1MjNhNDhhNCJ9LCJnYW1lIjoiY3MyIiwiZ2FtZU1vZGVUeXBlIjoiMkZhY3Rpb25zIiwiaWQiOiIxLWU0ZDZkMGE3LTY5MzgtNGY5Mi1hNGFiLTMyOTJiMTQwNzYzYSIsImxhc3RNb2RpZmllZCI6IjIwMjQtMTAtMjFUMTQ6MTg6MzdaIiwicmVnaW9uIjoiRVUiLCJzdGF0ZSI6IkNIRUNLX0lOIiwic3RhdHVzIjoiTElWRSIsInZlcnNpb24iOjExfSwic2VydmVyVGltZSI6IjIwMjQtMTAtMjFUMTQ6MTg6MzdaIn0=",
    "base64"
  );

  // console.log(Buffer.isBuffer(buf));
  // console.log(buf.toString("utf8"));
  // console.log(buf.toString("hex"));

  // console.log(buf.toString("utf8"));

  const obj = Event.decode(buf);
  console.log(obj);
}
