# Web development proyect running on ESP32

The project is developed on react js, gulp and platformIO to automatically create the necessary header files to run on a web server on the ESP32

## requirements

- node v18.x.x
- npm v8.x.x
- react v18.x.x
- Python 3.x.x

## Getting started

``` bash
git clone https://github.com/CONTROLLINO-PLC/CONTROLLINO_NEO_web.git
```

## Install dependencies

``` bash
pip install -U platformio
```

``` bash
cd CONTROLLINO_NEO_web/webdev/stepper
```

``` bash
npm install
```

## Finally

Now you can develop your project in react js and when executing the "npm run build" command, a series of scripts are automatically executed that end up uploading the compilation to ESP32.