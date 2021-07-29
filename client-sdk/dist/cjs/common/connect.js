"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const SDK_PREFIX = "ORG-SDK-";
async function connect(version, payload) {
    await fin.System.launchManifest("fin://localhost:5000/headless-service/config/headless.app.fin.json?$$version=" +
        version);
    let channel = await fin.InterApplicationBus.Channel.connect(SDK_PREFIX + version, { payload });
    return channel;
}
exports.connect = connect;
//# sourceMappingURL=connect.js.map