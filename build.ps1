<#
.SYNOPSIS
  Builds the Kingslayer Jekyll website from the actual project root (kingslayer-site).
#>
$siteDir = Join-Path $PSScriptRoot "kingslayer-site"
Set-Location -Path $siteDir
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "Building Kingslayer Jekyll website from:" -ForegroundColor Cyan
Write-Host "  $siteDir" -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Cyan
bundle exec jekyll build @args
