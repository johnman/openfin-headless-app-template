export const name = "executeAction";
export async function executeAction(payload, identity) {
  console.log(
    "Execute Action: Requested by client: " + JSON.stringify(identity)
  );
  console.log(
    "Execute Action: Payload sent in request: " + JSON.stringify(payload)
  );
  return true;
}
