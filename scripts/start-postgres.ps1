$ErrorActionPreference = "Stop"
$pgBin = "C:\Program Files\PostgreSQL\18\bin"
$root = Split-Path $PSScriptRoot -Parent
$dataDir = Join-Path $root "data\pg"
New-Item -ItemType Directory -Force -Path (Split-Path $dataDir) | Out-Null

$env:PGPASSWORD = "conferencerf"
$port = 5433
$user = "conferencerf"

if (-not (Test-Path (Join-Path $dataDir "PG_VERSION"))) {
  New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
  $pwFile = Join-Path $env:TEMP "conferencerf-pw.txt"
  Set-Content -Path $pwFile -Value "conferencerf" -NoNewline
  & "$pgBin\initdb.exe" -D $dataDir -U $user --auth=scram-sha-256 --pwfile=$pwFile --encoding=UTF8 --locale=C
  Remove-Item $pwFile -Force
}

$running = & "$pgBin\pg_isready.exe" -h localhost -p $port -U $user
if ($LASTEXITCODE -ne 0) {
  & "$pgBin\pg_ctl.exe" -D $dataDir -l (Join-Path $dataDir "pg.log") -o "-p $port" start
}

& "$pgBin\pg_isready.exe" -h localhost -p $port -U $user
$exists = & "$pgBin\psql.exe" -h localhost -p $port -U $user -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = 'conferencerf'"
if ($exists.Trim() -ne "1") {
  & "$pgBin\createdb.exe" -h localhost -p $port -U $user conferencerf
}

Write-Output "PostgreSQL готов: localhost:$port / conferencerf"
