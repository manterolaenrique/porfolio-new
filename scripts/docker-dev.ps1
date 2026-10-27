$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw 'Instalá Docker Desktop para Windows 11 con WSL 2 antes de continuar.' }
docker info --format '{{.ServerVersion}}' 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Docker Desktop no está ejecutando el motor Linux. Abrilo, esperá a que indique que está listo y repetí npm run docker:dev.' }
if (-not $env:NEXORA_PORT) {
  $existingBinding = docker ps --filter 'label=com.docker.compose.project=nexora-development' --format '{{.Ports}}'
  if ($existingBinding -match '127\.0\.0\.1:(\d+)->3000/tcp') { $env:NEXORA_PORT = $Matches[1] }
  if (-not $env:NEXORA_PORT) {
    foreach ($candidatePort in @(3000, 3333, 3001)) {
      if (-not (Get-NetTCPConnection -State Listen -LocalPort $candidatePort -ErrorAction SilentlyContinue)) { $env:NEXORA_PORT = "$candidatePort"; break }
    }
  }
  if (-not $env:NEXORA_PORT) { throw 'Los puertos locales autorizados 3000, 3333 y 3001 están ocupados. Detené el contenedor Nexora anterior o seleccioná un puerto con NEXORA_PORT y autorizalo en Sanity.' }
}
$localConfig = Join-Path (Get-Location) '.env.docker.local'
if (-not (Test-Path -LiteralPath $localConfig)) { Copy-Item -LiteralPath '.env.docker.example' -Destination $localConfig }
$configText = Get-Content -LiteralPath $localConfig -Raw
if ($configText -notmatch '(?m)^NEXT_PUBLIC_SANITY_DATASET=development\s*$' -or $configText -match '(?m)^NEXT_PUBLIC_SANITY_DATASET=production\s*$') { throw '.env.docker.local debe seleccionar exclusivamente development.' }
# Report legacy env files; Compose forces development before Next.js loads them.
foreach ($name in @('.env.development.local', '.env.local', '.env.development', '.env')) {
  if (Test-Path -LiteralPath $name) {
    $text = Get-Content -LiteralPath $name -Raw
    if ($text -match '(?m)^NEXT_PUBLIC_SANITY_DATASET=development\s*$') { break }
    if ($text -match '(?m)^NEXT_PUBLIC_SANITY_DATASET=production\s*$') { Write-Host "$name apunta a production, pero Compose fuerza development antes de cargar archivos."; break }
  }
}
docker compose config --quiet
if ($LASTEXITCODE -ne 0) { throw 'La configuración de Compose no es válida.' }
docker compose up --build --detach --wait --wait-timeout 300
if ($LASTEXITCODE -ne 0) { throw 'No se pudo iniciar Nexora. Revisá docker compose logs web. Para un puerto ocupado: $env:NEXORA_PORT=3002.' }
$port = if ($env:NEXORA_PORT) { $env:NEXORA_PORT } else { '3000' }
$site = "http://localhost:$port/nexora"
$studio = "http://localhost:$port/admin"
Write-Host "Nexora: $site`nStudio: $studio (autenticación oficial de Sanity)"
Start-Process $site
Start-Process $studio
