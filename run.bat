@ECHO off
if defined SOUI4JS_PATH (
 echo %SOUI4JS_PATH%
 start %SOUI4JS_PATH%\bin64\soui4js-host .
 exit
) else (
 echo "no path"
 if exist ..\soui4js\bin64\soui4js-host.exe (
 	start ..\soui4js\bin64\soui4js-host .
 	exit
 ) else (
 	echo "没有找到环境变量:SOUI4JS_PATH, 在同级目录也没有找到soui4js, 启动失败"
 )
)
