"use strict";

const { spawn } = require('child_process');
const logger = require("./logger");


async function startOpenVpn (configPath) {
  return new Promise((resolve, reject) => {
    const openvpn = spawn('openvpn', [configPath]);

    let errorMsg;

    openvpn.stdout.on('data', (data) => {
      const message = data.toString();

      if (message.indexOf("AUTH_FAILED") > -1) {
        errorMsg = "AUTH_FAILED";
      }

      if (message.indexOf("Cannot ioctl TUNSETIFF tun: Operation not permitted") > -1) {
        errorMsg = "SUDO";
      }

      if (process.argv.includes('debug')) {
        logger.debug(message);
      }

      const restarting = message.match(/Restart pause, [0-9]+ second\(s\)/g);

      if (restarting) {
        logger.warn(restarting[0]);
      }
      else if(message.indexOf("Initialization Sequence Completed") > -1) {
        logger.info('VPN Connected!');
      }
    });

    openvpn.stderr.on('data', (data) => {
      logger.error(data.toString());
      return resolve();
    });

    openvpn.on('close', (code) => {
      if (errorMsg) {
        reject(errorMsg);
      }
      else {
        resolve();
      }
    });
  });
}

module.exports = {
  startOpenVpn
};