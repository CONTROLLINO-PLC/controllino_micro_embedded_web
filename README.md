# Embbeded web to test Controllino Micro features

The project provides an easy to install tool to test the main features of the Controllino Micro by serving an embedded web application directly from the device, easilly accesible from any web browser.

![dashboard](images/dashboard.png)

## Fast get started

### Download latest firmware

- Controllino Micro RS485 **.uf2** <https://github.com/CONTROLLINO-PLC/micro_embedded_web/releases/download/v1.0.0/web_micro_rs485.uf2>
- Controllino Micro CAN **.uf2** <https://github.com/CONTROLLINO-PLC/micro_embedded_web/releases/download/v1.0.0/web_micro_can.uf2>

### Upload firmware

For easy installation first it is necessary to put the device in bootloader mode, to do this:

- First method: Without external power press the boot button while connecting the USB cable, and then release the button.
- Second method: Press both boot and reset buttons at the same time, then release the reset button and finally release the boot button.

The board will appear as a mass storage device, copy then the **.uf2** file to the device, it will reboot and start the web server.

### Connect to the web server

The default IP address is **10.22.1.184** and the default user and password are **admin** and **admin** respectively so just open a browser and go to <http://10.22.1.184/> to access the web server. Enjoy!

## Tools and technologies used

- PlatformIO to manage the project and build the firmware.
- Mongoose web server as core to genrate the web server app.
- React js to develop the web app.

## Internal and external dependencies description

- From [controllino_rp2040_firmmware](https://github.com/CONTROLLINO-PLC/controllino_rp2040_firmware)
  - CAN modified version of Arduino CAN library (MCP2515) [lib/arduino_can](lib/arduino_can) original library [here](https://github.com/sandeepmistry/arduino-CAN)
  - Controllino Micro variant firmware [lib/controllino_micro](lib/controllino_micro)
- Mongoose web server application [lib/mongoose](lib/mongoose) based on device dashboard example
- External dependencies installed with PlatformIO
  - ArduinoJson
  - ArduinoRS485

## Web development project

Developed on react js uses also gulp to automate some parts of the build process, trying to generate the minimal weight app to embed in the microcontroller.
The final C source needs to be generated using the pack tool from mongoose.(These part still needs to be automated)

### Requirements

- node v18.x.x
- npm v8.x.x
- react v18.x.x
- Python 3.x.x

### Install dependencies

``` bash
cd micro_embedded_web/webdev
```

``` bash
npm install
```

### Start development server

``` bash
npm run dev
```

### Build for production

``` bash
npm run build
```

- Note: Generates a minimized output on **lib/webapp/web**, that serves as input for the pack tool to generate the final C source.

### React project description

- Login
  - Description: Component to get access to the dashboard using user credentials.
  - ubication: [webdev/src/components/Login.jsx](webdev/src/components/Login.jsx)
  - used in:
    - App

- Home
  - description: Display all main screen components
  - ubication: [webdev/src/components/Home.jsx](webdev/src/components/Home.jsx)
  - used in:
    - App

- Navbar
  - description: Header of the web app and render some features as logout
  - ubication: [webdev/src/components/Navbar.jsx](webdev/src/components/Navbar.jsx)
  - used in:
    - Home

- FormComms
  - description: Form to manage the network configuration
  - ubication: [webdev/src/components/FormComms.jsx](webdev/src/components/FormComms.jsx)
  - used in:
    - Home

- FormBoard
  - description: Main form to manage the board
  - ubication: [webdev/src/components/FormBoard.jsx](webdev/src/components/FormBoard.jsx)
  - used in:
    - Home

- Inputs, Outputs and ComComponent
  - description: Actuate and configure inputs, outputs and serial comunications
  - ubication:
    - [webdev/src/components/comComponen.jsx](webdev/src/components/comComponen.jsx)
    - [webdev/src/components/Inputs.jsx](webdev/src/components/Inputs.jsx)
    - [webdev/src/components/Outputs.jsx](webdev/src/components/Outputs.jsx)
  - used in:
    - FormBoard

- ItemContainer
  - description: Container to display inputs, outputs and serial comunications
  - ubication: [webdev/src/components/ItemContainer.jsx](webdev/src/components/ItemContainer.jsx)
  - used in:
    - Inputs
    - Outputs
    - ComComponent

- LedInput, LedOutput and NetworkLeds
  - description: Component to visually display network activity and digital states of inputs and outputs
  - ubication:
    - [webdev/src/components/LedInputs.jsx](webdev/src/components/LedInputs.jsx)
    - [webdev/src/components/LedOutput.jsx](webdev/src/components/LedOutput.jsx)
    - [webdev/src/components/networkLeds.jsx](webdev/src/components/networkLeds.jsx)
  - used in:
    - FormBoard

- TmcuCard, TsensorCard and VsupplyCard
  - description: Card like component to monitor certain internal variables
  - ubication:
    - [webdev/src/components/TmcuCard.jsx](webdev/src/components/TmcuCard.jsx)
    - [webdev/src/components/TsensorCard.jsx](webdev/src/components/TsensorCard.jsx)
    - [webdev/src/components/VsupplyCard.jsx](webdev/src/components/VsuplyCard.jsx)
  - used in:
    - Home
