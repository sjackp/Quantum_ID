@echo off
color 0c
echo Initializing JackGPT...
ping -n 2 localhost >nul
color 06
echo Initialization complete.
ping -n 2 localhost >nul
color 0e
echo Starting boot sequence...
ping -n 2 localhost >nul
color 0a
echo Boot sequence in progress...
ping -n 2 localhost >nul
color 0b
echo Boot sequence complete.
ping -n 2 localhost >nul
color 0a

node index.js
