const SDK_PREFIX = "ORG-SDK-";
export async function connect(version, payload) {
    await fin.System.launchManifest("fin://localhost:5000/headless-service/config/headless.app.fin.json?$$version=" +
        version);
    let channel = await fin.InterApplicationBus.Channel.connect(SDK_PREFIX + version, { payload });
    return channel;
}
//# sourceMappingURL=connect.js.map