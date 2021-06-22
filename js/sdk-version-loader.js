import { getRoot } from "./host.js";
import { getSettings } from "./sdk-settings.js";

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
  let settings = await getSettings();
  let windowName = getSDKName(version);
  let defaultHeight = 400;
  let defaultWidth = 400;
  let autoShow = false;

  let sdkUrl = getRoot() + "/sdk/" + getSDKName(version) + ".html";

  if (settings.mode !== undefined && settings.mode.value === "view") {
    let servicesWindow = {
      name: windowName,
      defaultHeight,
      defaultWidth,
      autoShow,
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
                  backgroundThrottling: false,
                  url: sdkUrl,
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
  } else {
    await window.fin.Window.create({
      name: windowName,
      url: sdkUrl,
      defaultHeight,
      defaultWidth,
      autoShow,
      processAffinity: version,
      backgroundThrottling: false,
      frame: true
    });
  }
}
