<#
.SYNOPSIS
  Starts the Kingslayer Jekyll development server from the actual project root (kingslayer-site).
#>
$siteDir = Join-Path $PSScriptRoot "kingslayer-site"
Set-Location -Path $siteDir
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "Starting Kingslayer Jekyll development server from:" -ForegroundColor Cyan
Write-Host "  $siteDir" -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Cyan
bundle exec jekyll serve --livereload @args
