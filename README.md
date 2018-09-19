# MagicBoard
This is a modified version of [MagicMirror](https://github.com/MichMich/MagicMirror/). This project aims is to build a smart information board instead of a smart mirror that MagicMirror is initially used for.

## Setup

For install

```bash
git clone https://github.com/knowit/MagicBoard.git

npm install
```

*Now, for every modules in `/modules` you need to run `npm install` for every modules that has a `package.json`*

This project uses [node-serialport](https://github.com/node-serialport/node-serialport) to allow the use of [PIR Motion sensor](https://learn.adafruit.com/pir-passive-infrared-proximity-motion-sensor/overview). It is part of the MMM-MotionSensor module. If you don't want to use it, remove or comment it out in `config/config.js` or else run:
```bash
npm rebuild
```


## Debug
Easiest way to debug application is to run `npm start`, open a browser and enter `localhost:8080`. The reason is that the debug channel is running in the browser.

## Troubleshoot
Errors on `npm start`

```bash
WARNING! Could not load config file. Starting with default configuration. Error found: Error: The module '/Users/kienvu/Documents/MagicMirror/node_modules/serialport/build/Release/serialport.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 64. This version of Node.js requires
NODE_MODULE_VERSION 57. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```

* [node-serialport](https://github.com/node-serialport/node-serialport) requires that you use npm v.8.x, so this error occur if npm v10.x is used. A suggestion is to use a [node version manager](https://github.com/creationix/nvm/) to switch between different node versions.


```bash
(node:42723) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: Error: No such file or directory, cannot open /dev/ttyUSB0
(node:42723) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

* This is a warning that comes from `modules/MMM-MotionSensor/node_helper.js/`, because you need to set the correct PORT to listen to the motion sensor. A suggestion to find the PORT is to use the [Arduino IDE](https://www.arduino.cc/en/Main/Software) to detect the correct PORT.

