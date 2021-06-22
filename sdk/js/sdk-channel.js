const SDK_PREFIX = "ORG-SDK-";

export async function init(version) {
  const CHANNEL_NAME = SDK_PREFIX + version;
  const providerBus = await window.fin.InterApplicationBus.Channel.create(
    CHANNEL_NAME
  );
  let connectedClientCount = 0;
  providerBus.onConnection((identity, payload) => {
    // can reject a connection here by throwing an error
    console.log(
      CHANNEL_NAME + ": Client connection request identity: ",
      JSON.stringify(identity)
    );
    console.log(
      CHANNEL_NAME + ": Client connection request payload: ",
      JSON.stringify(payload)
    );
    // validate payload if part of an auth process
    connectedClientCount++;
  });

  providerBus.onDisconnection(async (evt) => {
    console.log("Client disconnected", `uuid: ${evt.uuid}, name: ${evt.name}`);
    connectedClientCount--;
    if (connectedClientCount === 0) {
      console.warn(
        "THIS IS WHERE WE CLOSE THE WINDOW/VIEW AS THERE ARE NO MORE CONNECTED CLIENTS"
      );
      await providerBus.destroy();
      if (window.fin.me.isWindow) {
        window.fin.me.close(true);
      } else if (window.fin.me.isView) {
        let win = await window.fin.me.getCurrentWindow();
        await win.close(true);
      } else {
        console.warn(
          "The sdk is not hosted in a view or window and so cannot close itself."
        );
      }
    }
  });

  return providerBus;
}
