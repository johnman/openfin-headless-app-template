import { init } from "../js/agent.js";

window.addEventListener("DOMContentLoaded", () => {
  let platform = fin.Platform.getCurrentSync();
  platform.once("platform-api-ready", init.bind(this));
});
