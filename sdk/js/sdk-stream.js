let clientMap = new Map();

export async function startStream(payload, identity, provider) {
  console.log(payload, identity);
  // validate payload
  if (
    payload === undefined ||
    payload === null ||
    payload.streamId === undefined
  ) {
    // requires a streamId
    return null;
  }
  let interval = 1000; // could be based on payload.interval if you want to control the rate
  // this is just to simulate data coming from some source
  let id = setInterval(async () => {
    let value;
    if (payload.options !== undefined && payload.options.filter !== undefined) {
      if (payload.options.filter === "random") {
        value = Math.floor(Math.random() * 1000);
      } else {
        value = Date.now();
      }
    }
    await provider.dispatch(identity, payload.streamId, value);
  }, interval);

  clientMap.set(identity, id);
  return {
    clearId: id,
    clearAction: "stopStream"
  };
}

export async function stopStream(payload, identity) {
  console.log(payload, identity);
  // validate payload
  let id = clientMap.get(identity);
  if (id !== undefined && id !== null) {
    clearInterval(id);
    return true;
  }
  return false;
}
