@echo off
echo ===============================
echo GLB COMPRESSOR
echo ===============================

set GLTF=C:\Users\PC\AppData\Roaming\npm\gltf-transform.cmd

if not exist optimized (
mkdir optimized
)

for %%f in (*.glb) do (
echo Processing %%f
"%GLTF%" optimize "%%f" "optimized\%%~nf.glb" --compress draco --simplify 0.8 --texture-size 512
)

echo ===============================
echo DONE
echo Files saved in /optimized
echo ===============================
pause