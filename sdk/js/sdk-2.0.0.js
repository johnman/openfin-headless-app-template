import { welcome } from "./sdk-welcome.js";
import { init as initChannel } from "./sdk-channel.js";
import {
  executeAction,
  name as executeActionName
} from "./sdk-execute-action.js";

let sdkChannel;

async function init() {
  const version = "2.0.0";
  welcome(version);
  createSDK(version);
}

async function createSDK(version) {
  sdkChannel = await initChannel(version);
  sdkChannel.register(executeActionName, executeAction);
  sdkChannel.register("newAction", async (payload, identity) => {
    console.log(
      "Execute New Action: Requested by client: " + JSON.stringify(identity)
    );
    console.log(
      "Execute New Action: Payload sent in request: " + JSON.stringify(payload)
    );

    return 100;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  init();
});
