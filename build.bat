@echo off
echo ===================================================================
echo Building Kingslayer Jekyll website from kingslayer-site...
echo ===================================================================
cd /d "%~dp0kingslayer-site"
bundle exec jekyll build %*
