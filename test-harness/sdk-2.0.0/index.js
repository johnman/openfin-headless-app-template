import {
  init,
  executeAction,
  executeNewAction,
  isClientConnected,
  startStream
} from "../../client-sdk/2.0.0/index.js";

window.addEventListener("DOMContentLoaded", () => {
  let initButton = document.getElementById("init");
  let disposeButton = document.getElementById("dispose");
  let executeActionButton = document.getElementById("executeAction");
  let executeNewActionButton = document.getElementById("executeNewAction");
  let startStreamButton = document.getElementById("startStream");
  let stopStreamButton = document.getElementById("stopStream");
  let streamResult = document.getElementById("streamResult");
  let steamType = document.getElementById("streamType");
  let result = document.getElementById("result");
  let streamDisposable;

  let disposeOfStreamDisposable = async () => {
    if (streamDisposable !== undefined && streamDisposable !== null) {
      // for this test harness we only support one stream at a time
      await streamDisposable.dispose();
      streamDisposable = null;
      streamDisposable = undefined;
    }
  };

  initButton.onclick = async () => {
    let response = await init(
      { token: "1234" },
      () => {
        console.log("disconnected");
        result.innerText = "Disconnected Callback Called.";
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
      let response = await executeAction("Hi There");
      result.innerText = "Execute Action Called. Result: " + response;
    } else {
      result.innerText = "Execute Action Called but isClientConnected is false";
    }
  };

  executeNewActionButton.onclick = async () => {
    if (isClientConnected()) {
      let response = await executeNewAction("Hi There");
      result.innerText = "Execute New Action Called. Result: " + response;
    } else {
      result.innerText = "Execute Action Called but isClientConnected is false";
    }
  };

  startStreamButton.onclick = async () => {
    await disposeOfStreamDisposable();
    streamDisposable = await startStream(
      (data) => {
        streamResult.innerText = data;
      },
      { filter: steamType.value }
    );
    result.innerText = "Stream Requested";
  };

  stopStreamButton.onclick = async () => {
    await disposeOfStreamDisposable();
    result.innerText = "Stream Disposed";
    streamResult.innerText = "";
  };
});
