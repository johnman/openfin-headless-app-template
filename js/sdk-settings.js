let cachedSettings;

export async function getSettings() {
  if (cachedSettings !== undefined) {
    return cachedSettings;
  }

  const app = window.fin.Application.getCurrentSync();
  const manifest = await app.getManifest();

  if (
    manifest.customSettings !== undefined &&
    manifest.customSettings !== null
  ) {
    cachedSettings = manifest.customSettings;
  } else {
    cachedSettings = {};
  }

  return cachedSettings;
}
