import { isValid } from "./version-info.js";
import { loadSDKVersion } from "./version-loader.js";
export async function sdkLoader(version) {
    let versionIsValid = await isValid(version);
    if (versionIsValid) {
        try {
            let success = await loadSDKVersion(version);
            return success;
        }
        catch (err) {
            console.log("Error trying to loadSDKVersion: " + version, err);
            return false;
        }
    }
}
//# sourceMappingURL=loader.js.map