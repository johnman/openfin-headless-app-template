import { init } from "../js/sdk-shell.js";

window.addEventListener("DOMContentLoaded", () => {
  let platform = window.fin.Platform.getCurrentSync();
  platform.once("platform-api-ready", init.bind(this));
});
