const events = [
  { name: "welcome", pattern: "FACEIT Edge", jsondata: false, padding: { l: 9, r: 1 } },
  { name: "ping", pattern: "", jsondata: false, padding: { l: 0, r: 0 } },
  { name: "pubsub_confirmation", pattern: "pubsub", jsondata: false, padding: { l: 14, r: 0 } },
  { name: "lobby_player_joined", pattern: "lobby_player_joined", jsondata: true, padding: { l: 12, r: 3 } },
  { name: "lobby_player_left", pattern: "lobby_player_left", jsondata: true, padding: { l: 12, r: 3 } },
  { name: "lobby_created", pattern: "lobby_created", jsondata: true, padding: { l: 12, r: 3 } },
  { name: "lobby_destroyed", pattern: "lobby_destroyed", jsondata: true, padding: { l: 9, r: 2 } },
  { name: "lobby_updated", pattern: "lobby_updated", jsondata: true, padding: { l: 12, r: 3 } },
  { name: "voting_update", pattern: "voting_update", jsondata: true, padding: { l: 12, r: 3 } },
  { name: "match_update", pattern: "match_update", jsondata: true, padding: { l: 12, r: 3 } },
  { name: "match_state_update", pattern: "match_state_update", jsondata: true, padding: { l: 12, r: 3 } },
  { name: "match_results_update", pattern: "match_results_update", jsondata: true, padding: { l: 12, r: 3 } },
  { name: "match_partial_results", pattern: "match_partial_results", jsondata: true, padding: { l: 12, r: 3 } },
];
// lobby_destroyed -> <9_bytes> + <event> + <2_bytes> + <json_payload>

function checkEvent(eventType, msg) {
  // <left_bytes> + <event> + <right_bytes> + <json_payload>
  const bytesLeft = eventType.padding.l;
  const bytesRight = eventType.padding.r;
  const eventTypeLength = Buffer.from(eventType.pattern, "utf8").length;

  const event = msg.subarray(bytesLeft, bytesLeft + eventTypeLength);
  const payload = msg.subarray(bytesLeft + eventTypeLength + bytesRight);

  const presumedEvent = Buffer.from(eventType.pattern, "utf8");

  // compare presumed event with incoming event
  if (!presumedEvent.equals(event)) return null;

  if (eventType.jsondata === false) return payload.toString("utf8");

  return JSON.parse(payload);
}

function parseEvent(message) {
  for (eventType of events) {
    const payload = checkEvent(eventType, message);
    if (payload !== null) {
      return {
        event: eventType.name,
        payload: payload,
      };
    }
  }
  return {
    event: "unknown",
    payload: message,
  };
}

module.exports = { parseEvent };
