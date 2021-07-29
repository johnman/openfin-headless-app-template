import { name as executeActionName } from "../common/sdk-execute-action.js";
import { connect } from "../common/connect.js";
import { ILog } from "../common/ILog.js";
import { IPayload } from "../common/IPayload.js";

let clientConnection;
let isConnected = false;
let log:ILog;

export function isClientConnected() {
  return isConnected;
}

export async function init(payload:IPayload, onDisconnect:()=>void, logger?:ILog) {
  log = logger;
  try {
    clientConnection = await connect("1.1.0", payload);
    isConnected = true;
    clientConnection.onDisconnection((_) => {
      isConnected = false;
      if (log !== undefined && log.info !== undefined) {
        log.info("Disconnected from service 1.1.0");
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
      log.error("Error connecting to service version 1.1.0.", err);
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
