export type ApkArch = 'universal' | 'arm64' | 'arm32';
export type AppPlatform = 'android' | 'windows' | 'linux' | 'macos';

export interface PlatformInfo {
  id: AppPlatform;
  label: string;
  subtitle: string;
  extensionsLabel: string;
}

export const PLATFORM_LIST: PlatformInfo[] = [
  {
    id: 'android',
    label: 'Android',
    subtitle: 'APK Installer',
    extensionsLabel: '.apk (Universal / ARM64 / ARM32)',
  },
  {
    id: 'windows',
    label: 'Windows',
    subtitle: 'Desktop PC 64-bit',
    extensionsLabel: '.exe / .msi',
  },
  {
    id: 'linux',
    label: 'Linux',
    subtitle: 'AppImage / Debian',
    extensionsLabel: '.AppImage / .deb / .tar.gz',
  },
  {
    id: 'macos',
    label: 'macOS',
    subtitle: 'Apple Silicon & Intel',
    extensionsLabel: '.dmg / .pkg',
  },
];

export interface ReleaseAsset {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  digest?: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
  assets: ReleaseAsset[];
}

export interface ReleaseNoteItem {
  title: string;
  description: string;
}

export const GITHUB_REPO = 'nuenimegrup-png/NuenimeApp';
export const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;
export const GITHUB_API_RELEASES_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;
export const GITHUB_API_LATEST_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

export const FALLBACK_RELEASES: GitHubRelease[] = [
  {
    tag_name: 'v0.0.6',
    name: 'Nuenime v0.0.6',
    published_at: '2026-10-27T21:08:27Z',
    html_url: 'https://github.com/nuenimegrup-png/NuenimeApp/releases/tag/v0.0.6',
    body: `## Nuenime v0.0.6\n\n- **Auto-scroll Chat Realtime**: Pesan baru di Chat Global dan Chat Pribadi langsung otomatis scroll ke pesan paling bawah.\n- **Centang Biru Member**: Seluruh member terverifikasi memiliki badge centang biru di profil, koneksi, dan obrolan. Centang merah khusus untuk Admin & Developer.\n- **Integrasi Web NuePet Zoo & Dunia Nuenime**: Terintegrasi via tautan responsif tanpa membebani ukuran bundle APK.\n- **Perbaikan Transaksi & Keamanan**: Penyelesaian RPC approval top-up admin dan isolasi database Supabase.\n\nDownload file APK di bawah ini dan pasang di perangkat Android Anda.`,
    assets: [
      {
        name: 'Nuenime-v0.0.6-universal.apk',
        size: 106742380,
        download_count: 30,
        browser_download_url: 'https://github.com/nuenimegrup-png/NuenimeApp/releases/download/v0.0.6/Nuenime-v0.0.6-universal.apk',
        digest: 'sha256:8d5b2af5f5921760b179b10cc7720900d09ed9f867cf888edf256829769fa9be',
      },
      {
        name: 'Nuenime-v0.0.6-arm64.apk',
        size: 104595762,
        download_count: 0,
        browser_download_url: 'https://github.com/nuenimegrup-png/NuenimeApp/releases/download/v0.0.6/Nuenime-v0.0.6-arm64.apk',
        digest: 'sha256:aca67f5285220a2dc873f70c46f2b3d94fe20a3009f67a73e4ea00d1ff5561db',
      },
      {
        name: 'Nuenime-v0.0.6-arm32.apk',
        size: 104218934,
        download_count: 0,
        browser_download_url: 'https://github.com/nuenimegrup-png/NuenimeApp/releases/download/v0.0.6/Nuenime-v0.0.6-arm32.apk',
        digest: 'sha256:d502ee7024d5af0a0cfc894b83fdf698369ac7abe2003f138275db2791b5c3b5',
      },
    ],
  },
  {
    tag_name: 'v0.0.5',
    name: 'Nuenime v0.0.5',
    published_at: '2026-10-27T00:07:28Z',
    html_url: 'https://github.com/nuenimegrup-png/NuenimeApp/releases/tag/v0.0.5',
    body: `## Nuenime v0.0.5\n\n- Pembaruan stabilitas pemutar video dan peningkatan responsivitas antarmuka Android.`,
    assets: [
      {
        name: 'aniraku-v0.0.5-universal.apk',
        size: 105400000,
        download_count: 14,
        browser_download_url: 'https://github.com/nuenimegrup-png/NuenimeApp/releases/download/v0.0.5/aniraku-v0.0.5-universal.apk',
      },
      {
        name: 'aniraku-v0.0.5-arm64.apk',
        size: 103200000,
        download_count: 5,
        browser_download_url: 'https://github.com/nuenimegrup-png/NuenimeApp/releases/download/v0.0.5/aniraku-v0.0.5-arm64.apk',
      },
      {
        name: 'aniraku-v0.0.5-arm32.apk',
        size: 102900000,
        download_count: 2,
        browser_download_url: 'https://github.com/nuenimegrup-png/NuenimeApp/releases/download/v0.0.5/aniraku-v0.0.5-arm32.apk',
      },
    ],
  },
];

export function normalizeVersionTag(tag: string): {
  badge: string;
  clean: string;
  raw: string;
} {
  const trimmed = (tag || 'v1.0.0').trim();
  const clean = trimmed.replace(/^[vV]/, '');
  return {
    badge: `V${clean}`,
    clean,
    raw: trimmed.startsWith('v') || trimmed.startsWith('V') ? `v${clean}` : `v${clean}`,
  };
}

export function detectPreferredArch(userAgent: string): ApkArch {
  const ua = (userAgent || '').toLowerCase();
  if (ua.includes('arm64') || ua.includes('aarch64') || ua.includes('armv8')) {
    return 'universal';
  }
  if (ua.includes('armv7') || ua.includes('armeabi') || ua.includes('arm32')) {
    return 'arm32';
  }
  return 'universal';
}

export function getAssetArch(assetName: string): ApkArch {
  const lower = (assetName || '').toLowerCase();
  if (lower.includes('arm64') || lower.includes('aarch64') || lower.includes('v8a')) {
    return 'arm64';
  }
  if (lower.includes('arm32') || lower.includes('armeabi') || lower.includes('v7a')) {
    return 'arm32';
  }
  return 'universal';
}

export function isPlatformAssetMatch(assetName: string, platform: AppPlatform): boolean {
  const lower = (assetName || '').toLowerCase();
  if (platform === 'android') {
    return lower.endsWith('.apk') || lower.endsWith('.aab');
  }
  if (platform === 'windows') {
    return (
      lower.endsWith('.exe') ||
      lower.endsWith('.msi') ||
      lower.includes('-win') ||
      lower.includes('windows')
    );
  }
  if (platform === 'linux') {
    return (
      lower.endsWith('.appimage') ||
      lower.endsWith('.deb') ||
      lower.endsWith('.rpm') ||
      lower.endsWith('.tar.gz') ||
      lower.includes('-linux')
    );
  }
  if (platform === 'macos') {
    return (
      lower.endsWith('.dmg') ||
      lower.endsWith('.pkg') ||
      lower.includes('-mac') ||
      lower.includes('macos') ||
      lower.includes('darwin')
    );
  }
  return false;
}

export function selectApkAsset(
  release: GitHubRelease | null | undefined,
  preferredArch: ApkArch = 'universal'
): ReleaseAsset | null {
  if (!release || !Array.isArray(release.assets) || release.assets.length === 0) {
    return null;
  }
  const apkAssets = release.assets.filter((a) => isPlatformAssetMatch(a.name, 'android'));
  if (apkAssets.length === 0) {
    return null;
  }

  const exactMatch = apkAssets.find((a) => getAssetArch(a.name) === preferredArch);
  if (exactMatch) return exactMatch;

  const universalMatch = apkAssets.find((a) => getAssetArch(a.name) === 'universal');
  if (universalMatch) return universalMatch;

  return apkAssets[0];
}

export function selectPlatformAsset(
  release: GitHubRelease | null | undefined,
  platform: AppPlatform,
  preferredArch: ApkArch = 'universal'
): ReleaseAsset | null {
  if (!release || !Array.isArray(release.assets) || release.assets.length === 0) {
    return null;
  }
  if (platform === 'android') {
    return selectApkAsset(release, preferredArch);
  }
  const matches = release.assets.filter((a) => isPlatformAssetMatch(a.name, platform));
  return matches.length > 0 ? matches[0] : null;
}

export function formatBytesToMB(bytes: number): string {
  if (!bytes || bytes <= 0) return '101.8 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function formatIndonesianDate(isoDate: string): string {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function parseReleaseNotes(body: string): ReleaseNoteItem[] {
  if (!body) return [];
  const lines = body.split(/\r?\n/);
  const items: ReleaseNoteItem[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line.startsWith('-') && !line.startsWith('*')) continue;
    const content = line.replace(/^[-*]\s*/, '').trim();
    const boldMatch = content.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
    if (boldMatch) {
      items.push({
        title: boldMatch[1].trim(),
        description: boldMatch[2].trim(),
      });
    } else {
      items.push({
        title: '',
        description: content.replace(/\*\*/g, ''),
      });
    }
  }
  return items;
}

export function parseSemverParts(version: string): number[] {
  const clean = (version || '').trim().replace(/^[vV]/, '');
  return clean
    .split(/[.-]/)
    .map((part) => Number.parseInt(part, 10))
    .map((n) => (Number.isNaN(n) ? 0 : n));
}

export function isNewerVersion(installedTag: string | null | undefined, latestTag: string): boolean {
  if (!installedTag) return true;
  const a = parseSemverParts(installedTag);
  const b = parseSemverParts(latestTag);
  const len = Math.max(a.length, b.length, 3);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (bv > av) return true;
    if (bv < av) return false;
  }
  return false;
}
