import { welcome } from "../../common/welcome.js";
import { init as initChannel } from "../../common/channel.js";
import { startStream, stopStream } from "./stream.js";

import {
  executeAction,
  name as executeActionName
} from "../../common/execute-action.js";

let sdkChannel;

async function init() {
  const version = "2.0.0";
  welcome(version);
  createSDK(version);
}

async function createSDK(version) {
  sdkChannel = await initChannel(version);
  sdkChannel.register(executeActionName, executeAction);
  sdkChannel.register("executeNewAction", async (payload, identity) => {
    console.log(
      "Execute New Action: Requested by client: " + JSON.stringify(identity)
    );
    console.log(
      "Execute New Action: Payload sent in request: " + JSON.stringify(payload)
    );

    return Math.floor(Math.random() * 1000);
  });

  sdkChannel.register("startStream", async (payload, identity) => {
    console.log(
      "Start Stream Action: Requested by client: " + JSON.stringify(identity)
    );
    console.log(
      "Start Stream Action: Payload sent in request: " + JSON.stringify(payload)
    );
    let response = await startStream(payload, identity, sdkChannel);
    return response;
  });

  sdkChannel.register("stopStream", async (payload, identity) => {
    console.log(
      "Stop Stream Action: Requested by client: " + JSON.stringify(identity)
    );
    console.log(
      "Stop Stream Action: Payload sent in request: " + JSON.stringify(payload)
    );
    let response = await stopStream(payload, identity);
    return response;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  init();
});
