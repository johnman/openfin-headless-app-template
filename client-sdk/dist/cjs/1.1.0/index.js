"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAction = exports.init = exports.isClientConnected = void 0;
const sdk_execute_action_js_1 = require("../common/sdk-execute-action.js");
const connect_js_1 = require("../common/connect.js");
let clientConnection;
let isConnected = false;
let log;
function isClientConnected() {
    return isConnected;
}
exports.isClientConnected = isClientConnected;
async function init(payload, onDisconnect, logger) {
    log = logger;
    try {
        clientConnection = await connect_js_1.connect("1.1.0", payload);
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
    }
    catch (err) {
        if (log !== undefined && log.error !== undefined) {
            log.error("Error connecting to service version 1.1.0.", err);
        }
        return {
            isConnected: false
        };
    }
}
exports.init = init;
async function executeAction(message) {
    if (isClientConnected()) {
        const sdkResponse = await clientConnection.dispatch(sdk_execute_action_js_1.name, {
            message
        });
        return sdkResponse;
    }
    else {
        // up to sdk developer to decide
        return null;
    }
}
exports.executeAction = executeAction;
//# sourceMappingURL=index.js.map