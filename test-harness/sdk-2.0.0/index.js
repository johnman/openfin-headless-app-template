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
  let streamType = document.getElementById("streamType");
  let startStream2Button = document.getElementById("startStream2");
  let stopStream2Button = document.getElementById("stopStream2");
  let streamResult2 = document.getElementById("streamResult2");
  let streamType2 = document.getElementById("streamType2");

  let result = document.getElementById("result");
  let streamDisposable;
  let stream2Disposable;

  let disposeOfStreamDisposable = async () => {
    if (streamDisposable !== undefined && streamDisposable !== null) {
      // for this test harness we only support one stream at a time
      await streamDisposable.dispose();
      streamDisposable = null;
      streamDisposable = undefined;
    }
  };

  let disposeOfStream2Disposable = async () => {
    if (stream2Disposable !== undefined && stream2Disposable !== null) {
      // for this test harness we only support one stream at a time
      await stream2Disposable.dispose();
      stream2Disposable = null;
      stream2Disposable = undefined;
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
      { filter: streamType.value }
    );
    result.innerText = "Stream 1 Requested";
  };

  stopStreamButton.onclick = async () => {
    await disposeOfStreamDisposable();
    result.innerText = "Stream 1 Disposed";
    streamResult.innerText = "";
  };

  startStream2Button.onclick = async () => {
    await disposeOfStream2Disposable();
    stream2Disposable = await startStream(
      (data) => {
        streamResult2.innerText = data;
      },
      { filter: streamType2.value }
    );
    result.innerText = "Stream 2 Requested";
  };

  stopStream2Button.onclick = async () => {
    await disposeOfStream2Disposable();
    result.innerText = "Stream 2 Disposed";
    streamResult2.innerText = "";
  };
});
