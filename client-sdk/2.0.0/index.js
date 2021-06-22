import { name as executeActionName } from "../common/sdk-execute-action.js";
import { name as executeNewActionName } from "../common/sdk-execute-new-action.js";
import { name as startStreamName } from "../common/sdk-start-stream.js";
import { connect } from "../common/connect.js";

let clientConnection;
let isConnected = false;
let log;

export function isClientConnected() {
  return isConnected;
}

export async function init(payload, onDisconnect, logger) {
  log = logger;
  try {
    clientConnection = await connect("2.0.0", payload);
    isConnected = true;
    clientConnection.onDisconnection((_) => {
      isConnected = false;
      if (log !== undefined && log.info !== undefined) {
        log.info("Disconnected from service 2.0.0");
      }
      if (onDisconnect !== undefined) {
        onDisconnect();
      }
    });
    return {
      dispose: async () => {
        if (isClientConnected() && clientConnection !== undefined) {
          await clientConnection.disconnect();
          isConnected = false;
        }
      },
      isConnected: true
    };
  } catch (err) {
    if (log !== undefined && log.error !== undefined) {
      log.error("Error connecting to service version 2.0.0.", err);
    }
    return {
      isConnected: false
    };
  }
}

export async function executeAction(message) {
  if (isClientConnected()) {
    const sdkResponse = await clientConnection.dispatch(executeActionName, {
      message
    });
    return sdkResponse;
  } else {
    // up to sdk developer to decide
    return null;
  }
}

export async function executeNewAction(message) {
  if (isClientConnected()) {
    const sdkResponse = await clientConnection.dispatch(executeNewActionName, {
      message
    });
    return sdkResponse;
  } else {
    // up to sdk developer to decide
    return null;
  }
}

export async function startStream(callback, options) {
  if (isClientConnected()) {
    let streamId =
      "streamId-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);

    clientConnection.register(streamId, (payload, identity) => {
      callback(payload);
    });

    const sdkResponse = await clientConnection.dispatch(startStreamName, {
      streamId,
      options
    });

    if (sdkResponse !== undefined && sdkResponse !== null) {
      return {
        dispose: async () => {
          await clientConnection.dispatch(sdkResponse.clearAction, {
            id: sdkResponse.id
          });
          await clientConnection.remove(streamId);
        }
      };
    }
    // if we didn't get a successful connection then the stream will never
    // be fed data. Clean up
    await clientConnection.remove(streamId);
    return null;
  } else {
    // up to sdk developer to decide
    return null;
  }
}
