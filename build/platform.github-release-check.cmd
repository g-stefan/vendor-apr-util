@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

SETLOCAL ENABLEDELAYEDEXPANSION

echo -^> github-release-check vendor-apr-util

set GITHUB_PROJECT=vendor-%PROJECT%

github-release info --repo %GITHUB_PROJECT% --tag v%VERSION%
