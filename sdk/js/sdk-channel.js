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

  providerBus.onDisconnection((evt) => {
    console.log("Client disconnected", `uuid: ${evt.uuid}, name: ${evt.name}`);
    connectedClientCount--;
    if (connectedClientCount === 0) {
      console.warn("THIS IS WHERE WE WOULD CLOSE THE WINDOW");
    }
  });

  return providerBus;
}
