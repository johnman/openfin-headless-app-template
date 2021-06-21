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

function getSDKName(version, isWindow = true) {
  let name = "sdk-";

  if (isWindow) {
    name += version;
  } else {
    name += "view-" + version;
  }
  return name;
}

async function sdkVersionExists(version) {
  const app = await window.fin.Application.getCurrent();
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
  let servicesWindow = {
    name: getSDKName(version),
    defaultHeight: 400,
    defaultWidth: 400,
    autoShow: false,
    layout: {
      content: [
        {
          type: "column",
          content: [
            {
              type: "component",
              componentName: "view",
              componentState: {
                processAffinity: version,
                url: getRoot() + "/sdk/" + version + ".html",
                name: getSDKName(version, false)
              }
            }
          ]
        }
      ]
    }
  };

  let sdkPackage = {
    windows: [servicesWindow]
  };

  window.fin.Platform.getCurrentSync().applySnapshot(sdkPackage, {
    closeExistingWindows: false
  });
}
