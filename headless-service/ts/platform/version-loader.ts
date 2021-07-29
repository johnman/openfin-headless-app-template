import { getRoot } from "./host.js";

export async function loadSDKVersion(version) {
  let sdkExists = await sdkVersionExists(version);
  if (sdkExists) {
    return true;
  }
  try {
    await launchSDKVersion(version);
    return true;
  } catch (err) {
    console.error("Error trying to launch sdk version: " + version, err);
    return false;
  }
}

function getSDKName(version) {
  let name = "sdk-";
  name += version;
  return name;
}

async function sdkVersionExists(version) {
  const app = await fin.Application.getCurrent();
  const windows = await app.getChildWindows();
  let exists = false;
  let sdkName = getSDKName(version);
  windows.forEach((entry) => {
    if (entry.identity.name === sdkName) {
      exists = true;
    }
  });
  return exists;
}
async function launchSDKVersion(version) {
  let windowName = getSDKName(version);
  let defaultHeight = 400;
  let defaultWidth = 400;
  let autoShow = false;
  let sdkUrl = getRoot() + "/window/service/" + version;
  let windowCreationOptions: OpenFin.WindowCreationOptions = {
    name: windowName,
    url: sdkUrl,
    defaultHeight,
    defaultWidth,
    autoShow,
    processAffinity: version,
    frame: true
  };
  
  (windowCreationOptions as any).backgroundThrottling = false,

  await fin.Window.create(windowCreationOptions);
}
