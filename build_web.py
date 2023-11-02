import os
import subprocess
import shutil

def main():
    # Remove web build directory
    if (os.path.exists("./lib/webapp/web")):
        shutil.rmtree("./lib/webapp/web")

    # Build web app
    os.chdir("./webdev")
    subprocess.run(["npm", "install"], shell=True)
    subprocess.run(["npm", "run", "build"], shell=True)
    os.chdir("..")

    # Compile pack.c
    subprocess.run(["gcc", "./tools/pack.c"], shell=True)

    # Pack web files into packed_fs.c
    os.chdir("./lib/webapp")
    packed_fs_file = open("packed_fs.c", "w")
    subprocess.run(
        [
            "..\\..\\a",
            "web/*.gz", 
            "web/*.ico",
            "web/assets/*.gz", 
            "web/assets/*.png"
        ], 
        shell=True , stdout=packed_fs_file)
    packed_fs_file.close()

main()