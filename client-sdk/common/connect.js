const SDK_PREFIX = "ORG-SDK-";

export async function connect(version, payload) {
  await window.fin.System.launchManifest(
    "fins://johnman.github.io/openfin-headless-app-template/config/headless.app.fin.json?$$version=" +
      version
  );
  let channel = await window.fin.InterApplicationBus.Channel.connect(
    SDK_PREFIX + version,
    { payload }
  );
  return channel;
}
