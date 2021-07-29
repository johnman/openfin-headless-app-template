"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startStream = exports.executeNewAction = exports.executeAction = exports.init = exports.isClientConnected = void 0;
const sdk_execute_action_js_1 = require("../common/sdk-execute-action.js");
const sdk_execute_new_action_js_1 = require("../common/sdk-execute-new-action.js");
const sdk_start_stream_js_1 = require("../common/sdk-start-stream.js");
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
        clientConnection = await connect_js_1.connect("2.0.0", payload);
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
    }
    catch (err) {
        if (log !== undefined && log.error !== undefined) {
            log.error("Error connecting to service version 2.0.0.", err);
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
async function executeNewAction(message) {
    if (isClientConnected()) {
        const sdkResponse = await clientConnection.dispatch(sdk_execute_new_action_js_1.name, {
            message
        });
        return sdkResponse;
    }
    else {
        // up to sdk developer to decide
        return null;
    }
}
exports.executeNewAction = executeNewAction;
async function startStream(callback, options) {
    if (isClientConnected()) {
        let streamId = "streamId-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
        clientConnection.register(streamId, (payload, identity) => {
            callback(payload);
        });
        const sdkResponse = await clientConnection.dispatch(sdk_start_stream_js_1.name, {
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
    }
    else {
        // up to sdk developer to decide
        return null;
    }
}
exports.startStream = startStream;
//# sourceMappingURL=index.js.map