import { sdkLoader } from "./sdk-loader.js";

const listenToSDKRequests = () => {
  const loadSDK = (options) => {
    console.log("Received the following: " + JSON.stringify(options));
    if (options.version !== undefined) {
      sdkLoader(options.version)
        .then((loaded) => {
          console.log("SDK " + options.version + " made available? " + loaded);
        })
        .catch((err) => {
          console.log(
            "Error loading sdk with version: " + options.version,
            err
          );
        });
    }
  };

  window.fin.desktop.main((userAppConfigArgs) => {
    loadSDK(userAppConfigArgs);
  });

  let app = window.fin.Application.getCurrentSync();
  // If app is already running parameters are passed through the “run-requested” event
  app.addListener("run-requested", function (event) {
    if (event.userAppConfigArgs) {
      loadSDK(event.userAppConfigArgs);
    }
  });
};

export async function init() {
  if (window.fin !== undefined) {
    listenToSDKRequests();
  }
}
