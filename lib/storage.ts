import browser from 'webextension-polyfill';

export type Settings = {
  apiUrl: string;
  token: string;
};

const DEFAULTS: Settings = {
  apiUrl: 'http://localhost:3777',
  token: '',
};

export async function getSettings(): Promise<Settings> {
  const stored = (await browser.storage.local.get(['apiUrl', 'token'])) as Partial<Settings>;
  return {
    apiUrl: (stored.apiUrl ?? DEFAULTS.apiUrl).replace(/\/+$/, ''),
    token: stored.token ?? DEFAULTS.token,
  };
}

export async function saveSettings(s: Settings): Promise<void> {
  await browser.storage.local.set({
    apiUrl: s.apiUrl.replace(/\/+$/, ''),
    token: s.token,
  });
}
