#!/usr/bin/env node
"use strict";

const { setupOpenVpn } = require("./nordvpn");
const { startOpenVpn } = require("./openvpn");
const { init, createAuth } =  require("./config");
const logger = require("./logger");
const path = require("path");

const homedir = require('os').homedir();
const configDir = path.join(homedir, ".nordvpn");
const configPath = path.join(configDir, "config.ovpn");
const authPath = path.join(configDir, "auth.txt");


async function openVpn() {
  try {
    await startOpenVpn(configPath);
  }
  catch (e) {
    if (e === "AUTH_FAILED") {
      logger.error("Authentication failed!");
      await createAuth(authPath);
      await openVpn();
    }
    else if (e === "SUDO") {
      logger.error("Looks like a permission issue, try using sudo!");
    }
  }
}

async function exec () {
  logger.info("checking your local configurations");
  await init(configDir, authPath);

  await setupOpenVpn(configPath, authPath);

  logger.info("connecting to the OpenVPN server!");
  await openVpn(configPath);
}

exec();