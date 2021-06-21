import {
  init,
  executeAction,
  executeNewAction,
  isClientConnected
} from "../../client-sdk/2.0.0/index.js";

window.addEventListener("DOMContentLoaded", () => {
  let initButton = document.getElementById("init");
  let disposeButton = document.getElementById("dispose");
  let executeActionButton = document.getElementById("executeAction");
  let executeNewActionButton = document.getElementById("executeNewAction");

  initButton.onclick = async () => {
    let response = await init(
      { token: "1234" },
      () => {
        console.log("disconnected");
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
    disposeButton.onclick = async () => {
      console.log("Dispose called.");
      if (response.dispose !== undefined) {
        await response.dispose();
      }
    };
  };

  executeActionButton.onclick = async () => {
    if (isClientConnected()) {
      executeAction("Hi There");
    }
  };

  executeNewActionButton.onclick = async () => {
    if (isClientConnected()) {
      executeNewAction("Hi There");
    }
  };
});
