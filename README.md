# Web development proyect running on rp2040

The project is developed on react js, gulp and platformIO to automatically create the necessary header files to run on a web server on the rp2040

## requirements

- node v18.x.x
- npm v8.x.x
- react v18.x.x
- Python 3.x.x

## Getting started

``` bash
git clone https://github.com/CONTROLLINO-PLC/micro_embedded_web
```

## Install dependencies

``` bash
pip install -U platformio
```

``` bash
cd micro_embedded_web/webdev
```

``` bash
npm install
```
### Start on dev mode

``` bash
npm run dev
```

### build an SPA 

``` bash 
npm run build
```

## Web React Components

- Login
    -
    - description: Component to get access to the dashboard using user credentials
    - ubication: [webdev/src/components/Login.jsx](webdev/src/components/Login.jsx)
    - used in:
        - App

- Home
    -
    - description: Display all components
    - ubication: [webdev/src/components/Home.jsx](webdev/src/components/Home.jsx)
    - used in:
        - App

- Navbar
    -
    - description: Header of the web app and render some features as logout
    - ubication: [webdev/src/components/Navbar.jsx](webdev/src/components/Navbar.jsx)
    - used in:
        - Home

- FormComms
    -
    - description: Form to manage the network of the controllino
    - ubication: [webdev/src/components/FormComms.jsx](webdev/src/components/FormComms.jsx)
    - used in:
        - Home

- FormBoard
    -
    - description: Container of the comonents displayed
    - ubication: [webdev/src/components/FormBoard.jsx](webdev/src/components/FormBoard.jsx)
    - used in:
        - Home

- Outputs Inputs ComComponent
    -
    - description: Set and display the controllino Inputs Outputs and serial comunications
    - ubication: 
        - [webdev/src/components/comComponen.jsx](webdev/src/components/comComponen.jsx)
        - [webdev/src/components/Inputs.jsx](webdev/src/components/Inputs.jsx)
        - [webdev/src/components/Outputs.jsx](webdev/src/components/Outputs.jsx)
    - used in:       
        - FormBoard

- ItemContainer
    - description: Abstraction layer to display the board elements
    - ubication: [webdev/src/components/ItemContainer.jsx](webdev/src/components/ItemContainer.jsx)
    - used in:
        - Inputs
        - Outputs
        - ComComponent

- LedInput LedOutput NetworkLeds
    -
    - description: Component to display the states of the controllino network, input and output pins
    - ubication: 
        - [webdev/src/components/LedInputs.jsx](webdev/src/components/LedInputs.jsx)
        - [webdev/src/components/LedOutput.jsx](webdev/src/components/LedOutput.jsx)
        - [webdev/src/components/networkLeds.jsx](webdev/src/components/networkLeds.jsx)
    - used in:
        - FormBoard


- TmcuCard TsensorCard VsupplyCard
    -
    - description: Display some controllino paramethers like power supply
    - ubication: 
        - [webdev/src/components/TmcuCard.jsx](webdev/src/components/TmcuCard.jsx)
        - [webdev/src/components/TsensorCard.jsx](webdev/src/components/TsensorCard.jsx)
        - [webdev/src/components/VsupplyCard.jsx](webdev/src/components/VsupplyCard.jsx)
    - used in:
        - Home



