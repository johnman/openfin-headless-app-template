import { welcome } from "../../common/welcome.js";
import { init as initChannel } from "../../common/channel.js";
import { executeAction, name as executeActionName } from "../../common/execute-action.js";
let sdkChannel;
async function init() {
    const version = "1.1.0";
    welcome(version);
    createSDK(version);
}
async function createSDK(version) {
    sdkChannel = await initChannel(version);
    sdkChannel.register(executeActionName, executeAction);
}
window.addEventListener("DOMContentLoaded", () => {
    init();
});
//# sourceMappingURL=index.js.map