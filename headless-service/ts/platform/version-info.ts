let supportedVersions;
import { getRoot } from "./host.js";

async function getVersionList() {
  if (supportedVersions === undefined) {
    let response = await fetch(getRoot() + "/config/versions.json");
    let versions = await response.json();
    setTimeout(() => {
      // reset cache
      supportedVersions = undefined;
    }, 3600000);
    supportedVersions = versions;
  }
  return supportedVersions;
}
export async function isValid(version:string) {
  let versions = await getVersionList();
  let supportedVersion = versions[version];
  if (supportedVersion !== undefined && supportedVersion.supported === true) {
    {}
    return true;
  }
  return false;
}

export async function keepAlive(version:string) {
  let versions = await getVersionList();
  let supportedVersion = versions[version];
  if (supportedVersion !== undefined && supportedVersion.keepAlive === true) {
    return true;
  }
  return false;
}
