@echo off
echo ===================================================================
echo Starting Kingslayer Jekyll development server from kingslayer-site...
echo ===================================================================
cd /d "%~dp0kingslayer-site"
bundle exec jekyll serve --livereload %*
