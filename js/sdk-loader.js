import { isValid } from "./sdk-isvalid.js";
import { loadSDKVersion } from "./sdk-version-loader.js";

export async function sdkLoader(version) {
  let versionIsValid = await isValid(version);
  if (versionIsValid) {
    try {
      let success = await loadSDKVersion(version);
      return success;
    } catch (err) {
      console.log("Error trying to loadSDKVersion: " + version, err);
      return false;
    }
  }
}
