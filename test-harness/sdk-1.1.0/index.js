import {
  init,
  executeAction,
  isClientConnected
} from "../../client-sdk/1.1.0/index.js";

window.addEventListener("DOMContentLoaded", () => {
  let initButton = document.getElementById("init");
  let disposeButton = document.getElementById("dispose");
  let executeActionButton = document.getElementById("executeAction");
  let result = document.getElementById("result");

  initButton.onclick = async () => {
    let response = await init(
      { token: "1234" },
      () => {
        console.log("disconnected");
        result.innerText("Disconnected Callback Called.");
      },
      {
        info: (message, more) => {
          if (more !== undefined) {
            console.log(message, more);
          } else {
            console.log(message);
          }
        },
        error: (message, error) => {
          if (error !== undefined) {
            console.error(message, error);
          } else {
            console.error(message);
          }
        }
      }
    );
    console.log("Init done. Connected: " + response.isConnected);
    result.innerText = "Connected: " + response.isConnected;
    disposeButton.onclick = async () => {
      console.log("Dispose called.");
      if (response.dispose !== undefined) {
        await response.dispose();
        result.innerText = "Dispose called";
      }
    };
  };

  executeActionButton.onclick = async () => {
    if (isClientConnected()) {
      let response = executeAction("Hi There");
      result.innerText = "Execute Action Called. Result: " + response;
    } else {
      result.innerText = "Execute Action Called but isClientConnected is false";
    }
  };
});
