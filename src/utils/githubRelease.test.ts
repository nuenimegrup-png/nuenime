import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FALLBACK_RELEASES,
  normalizeVersionTag,
  selectApkAsset,
  selectPlatformAsset,
  formatBytesToMB,
  parseReleaseNotes,
  isNewerVersion,
  getAssetArch,
} from './githubRelease';

test('normalizeVersionTag formats v0.0.6 into badge V0.0.6 and clean 0.0.6', () => {
  const res = normalizeVersionTag('v0.0.6');
  assert.equal(res.badge, 'V0.0.6');
  assert.equal(res.clean, '0.0.6');
  assert.equal(res.raw, 'v0.0.6');
});

test('selectApkAsset selects exact matching architecture APK from release assets', () => {
  const release = FALLBACK_RELEASES[0];
  const uni = selectApkAsset(release, 'universal');
  const arm64 = selectApkAsset(release, 'arm64');
  const arm32 = selectApkAsset(release, 'arm32');

  assert.equal(uni?.name, 'Nuenime-v0.0.6-universal.apk');
  assert.equal(arm64?.name, 'Nuenime-v0.0.6-arm64.apk');
  assert.equal(arm32?.name, 'Nuenime-v0.0.6-arm32.apk');
  assert.equal(getAssetArch(arm64?.name || ''), 'arm64');
});

test('selectPlatformAsset returns asset for Android and null for unavailable Windows/Linux/macOS', () => {
  const release = FALLBACK_RELEASES[0];
  assert.equal(selectPlatformAsset(release, 'android', 'universal')?.name, 'Nuenime-v0.0.6-universal.apk');
  assert.equal(selectPlatformAsset(release, 'windows'), null);
  assert.equal(selectPlatformAsset(release, 'linux'), null);
  assert.equal(selectPlatformAsset(release, 'macos'), null);

  const releaseWithDesktop = {
    ...release,
    assets: [
      ...release.assets,
      {
        name: 'Nuenime-Setup-0.0.6.exe',
        size: 85000000,
        download_count: 5,
        browser_download_url: 'https://example.com/Nuenime-Setup-0.0.6.exe',
      },
    ],
  };
  assert.equal(selectPlatformAsset(releaseWithDesktop, 'windows')?.name, 'Nuenime-Setup-0.0.6.exe');
});

test('formatBytesToMB converts APK byte size into readable MB string', () => {
  assert.equal(formatBytesToMB(106742380), '101.8 MB');
  assert.equal(formatBytesToMB(104595762), '99.8 MB');
});

test('parseReleaseNotes extracts structured items from GitHub release markdown body', () => {
  const notes = parseReleaseNotes(FALLBACK_RELEASES[0].body);
  assert.equal(notes.length, 4);
  assert.equal(notes[0].title, 'Auto-scroll Chat Realtime');
  assert.ok(notes[0].description.includes('Chat Global'));
});

test('isNewerVersion detects when a new GitHub release tag is newer than installed version', () => {
  assert.equal(isNewerVersion('v0.0.5', 'v0.0.6'), true);
  assert.equal(isNewerVersion('v0.0.6', 'v0.0.6'), false);
  assert.equal(isNewerVersion('v0.0.6', 'v0.0.5'), false);
  assert.equal(isNewerVersion('v0.0.6', 'v0.1.0'), true);
  assert.equal(isNewerVersion(null, 'v0.0.6'), true);
});
