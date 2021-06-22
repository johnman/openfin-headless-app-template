import { welcome } from "./sdk-welcome.js";
import { init as initChannel } from "./sdk-channel.js";
import { name as executeActionName } from "./sdk-execute-action.js";

let sdkChannel;

async function init() {
  const version = "1.1.0";
  welcome(version);
  createSDK(version);
}

async function createSDK(version) {
  sdkChannel = await initChannel(version);
  sdkChannel.register(executeActionName, () => {
    // this is temp for an experiment and will be reverted
    setTimeout(() => {
      while (true) {
        console.log("Endless Loop Triggered.");
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  init();
});
