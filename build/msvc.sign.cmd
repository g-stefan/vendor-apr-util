@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

echo -^> sign vendor-apr-util

pushd temp\apr-util\bin
for /r %%i in (*.dll) do call grigore-stefan.sign "apr-util" "%%i"
for /r %%i in (*.exe) do call grigore-stefan.sign "apr-util" "%%i"
popd
