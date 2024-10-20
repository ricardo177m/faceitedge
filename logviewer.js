const fs = require("fs");
const readline = require("readline");
const parser = require("./parser");

const filename = "logs/2024-10-20_19-07-45-444.txt";

const lineReader = require("readline").createInterface({
  input: require("fs").createReadStream(filename),
});

lineReader.on("line", function (line) {
  // const excerpt = Buffer.from(line.split(" ")[1], "base64").subarray(9, 50)
  // console.log(excerpt.toString("utf8"));
  const event = parser.parseEvent(Buffer.from(line.split(" ")[1], "base64"));
  console.log(event.event);
});
