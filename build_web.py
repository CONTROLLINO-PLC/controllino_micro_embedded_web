import sys
import os
import subprocess
import shutil

def main():
    _win32 = False
    if sys.platform == "win32":
        _win32 = True

    # Remove web build directory
    if (os.path.exists("lib/webapp/web")):
        shutil.rmtree("lib/webapp/web")

    # Build web app
    os.chdir("webdev")
    if _win32:
        subprocess.run(["npm", "install"], shell=True)
        subprocess.run(["npm", "run", "build"], shell=True)
    else:	
        subprocess.run(["npm install"], shell=True)
        subprocess.run(["npm run build"], shell=True)
    os.chdir("..")

    # Compile pack.c
    if _win32:
        subprocess.run(["gcc", "tools/pack.c"], shell=True)
    else:
        subprocess.run(["gcc tools/pack.c"], shell=True)

    # Pack web files into packed_fs.c
    os.chdir("lib/webapp")
    packed_fs_file = open("packed_fs.c", "w")
    if _win32:
        subprocess.run(
            [
                "..\\..\\a.exe",
                "web/*.gz", 
                "web/*.ico",
                "web/assets/*.gz", 
                "web/assets/*.png"
            ], 
            shell=True , stdout=packed_fs_file)
    else:
        subprocess.run(
        [
            "../../a.* web/*.gz web/*.ico web/assets/*.gz web/assets/*.png"
        ], 
        shell=True , stdout=packed_fs_file)
    packed_fs_file.close()
    print(sys.platform)

main()