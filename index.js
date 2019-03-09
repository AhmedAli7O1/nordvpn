#!/usr/bin/env node
"use strict";

const { getServers, selectServer } = require("./nordvpn.js");
const { startOpenVpn } = require("./openvpn");
const { get } = require("./request");
const { init, createAuth } =  require("./config");
const logger = require("./logger");
const path = require("path");

const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const homedir = require('os').homedir();
const configDir = path.join(homedir, ".nordvpn");
const configPath = path.join(configDir, "config.ovpn");
const authPath = path.join(configDir, "auth.txt");

async function generateServerConf (serverName, protocol) {
  let conf = await get(`https://downloads.nordcdn.com/configs/files/ovpn_${protocol}/servers/${serverName}.${protocol}.ovpn`, false);

  conf = conf.replace("auth-user-pass", `auth-user-pass ${authPath}`);

  await writeFile(configPath, conf);
}

async function openVpn() {
  try {
    logger.debug("start streaming OpenVPN logs");
    await startOpenVpn(configPath);
    logger.debug("end of OpenVPN logs");
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
  logger.debug("checking your local configurations");
  await init(configDir, authPath);

  logger.debug("Fetching servers info from NordVPN API");
  const servers = await getServers();

  logger.debug("getting the best server!");
  const selectedServer = await selectServer(servers);

  logger.debug("**************** Selected Server *****************");
  logger.debug(`Name:     ${selectedServer.name}`);
  logger.debug(`Domain:   ${selectedServer.domain}`);
  logger.debug(`Load:     ${selectedServer.load}`);
  logger.debug(`Country:  ${selectedServer.country}`);
  logger.debug(`Protocol: ${selectedServer.protocol}`);
  logger.debug("**************************************************");


  logger.debug("generating OpenVPN Client configurations file!");
  await generateServerConf(selectedServer.domain, selectedServer.protocol);

  logger.debug("connecting to the OpenVPN server!");
  await openVpn(configPath);
}

exec();