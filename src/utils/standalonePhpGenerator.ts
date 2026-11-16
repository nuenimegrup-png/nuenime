import { GitHubRelease, GITHUB_REPO } from './githubRelease';

export function buildStandalonePhpSource(fallbackRelease: GitHubRelease): string {
  const defaultTag = fallbackRelease.tag_name || 'v0.0.6';
  const defaultVerClean = defaultTag.replace(/^[vV]/, '');
  const defaultAsset =
    fallbackRelease.assets.find((a) => a.name.toLowerCase().includes('universal')) ||
    fallbackRelease.assets[0];
  const defaultUrl =
    defaultAsset?.browser_download_url ||
    `https://github.com/${GITHUB_REPO}/releases/latest`;

  return `<?php
/* Nuenime — Landing + Auto-Download GitHub Releases (${GITHUB_REPO}) — single file */
$repo = '${GITHUB_REPO}';
$apiUrl = "https://api.github.com/repos/{$repo}/releases/latest";
$cacheFile = sys_get_temp_dir() . '/nuenime_latest_release.json';
$cacheTtl = 300; // 5 menit cache agar cepat & tidak terkena limit GitHub API

$releaseData = null;
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTtl)) {
  $releaseData = json_decode(@file_get_contents($cacheFile), true);
}

if (!$releaseData && function_exists('curl_init')) {
  $ch = curl_init($apiUrl);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 5,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTPHEADER => [
      'Accept: application/vnd.github+json',
      'User-Agent: Nuenime-AutoUpdater'
    ]
  ]);
  $resp = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($code === 200 && $resp) {
    $decoded = json_decode($resp, true);
    if (!empty($decoded['tag_name'])) {
      $releaseData = $decoded;
      @file_put_contents($cacheFile, $resp);
    }
  }
}

$tagName = $releaseData['tag_name'] ?? '${defaultTag}';
$verClean = ltrim($tagName, 'vV');
$verBadge = 'V' . $verClean;
$apkUrl = '${defaultUrl}';
$apkName = '${defaultAsset?.name || 'Nuenime-universal.apk'}';

if (!empty($releaseData['assets']) && is_array($releaseData['assets'])) {
  foreach ($releaseData['assets'] as $asset) {
    if (stripos($asset['name'], 'universal') !== false && stripos($asset['name'], '.apk') !== false) {
      $apkUrl = $asset['browser_download_url'];
      $apkName = $asset['name'];
      break;
    }
  }
  if ($apkUrl === '${defaultUrl}' && !empty($releaseData['assets'][0]['browser_download_url'])) {
    $apkUrl = $releaseData['assets'][0]['browser_download_url'];
    $apkName = $releaseData['assets'][0]['name'];
  }
}

// Endpoint redirect langsung: ?download=latest
if (isset($_GET['download']) && $_GET['download'] === 'latest') {
  header("Location: " . $apkUrl);
  exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nuenime</title>
<meta name="description" content="Nuenime — aplikasi streaming anime untuk gratis Oleh Nueva Group">
<link rel="icon" type="image/png" href="https://raw.githubusercontent.com/${GITHUB_REPO}/main/assets/images/logo-app.png">
<link rel="apple-touch-icon" href="https://raw.githubusercontent.com/${GITHUB_REPO}/main/assets/images/logo-app.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<!-- File PHP ini sudah terhubung otomatis dengan https://github.com/${GITHUB_REPO}/releases -->
<!-- Versi aktif saat ini: <?= htmlspecialchars($verBadge) ?> (${defaultVerClean}) -->
</html>`;
}
