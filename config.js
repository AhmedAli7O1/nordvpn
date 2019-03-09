"use strict";

const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();
const mkdir = util.promisify(fs.mkdir);
const lstat = util.promisify(fs.lstat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);


async function isDirExist (configDir) {
  try {
    const stat = await lstat(configDir);
    return stat.isDirectory();
  }
  catch(e) { return false; }
}

async function isAuthExist (authPath) {
  try {
    const stat = await lstat(authPath);
    if (stat.isFile()) {
      const content = await readFile(authPath, { encoding: "utf8" });
      return content;
    }
    else {
      return false;
    }
  }
  catch (e) { return false; }
}

async function createAuth (authPath) {
  const { username, password } = await prompt([
    {
      type: "input",
      name: "username",
      message: "NordVPN account User Name:"
    },
    {
      type: "password",
      name: "password",
      message: "NordVPN account Password:",
      mask: "*"
    }
  ]);

  await writeFile(authPath, username + "\n" + password);
}

async function init (configDir, authPath) {

  if (!await isDirExist(configDir)) {
    await mkdir(configDir);
  }

  if (!await isAuthExist(authPath)) {
    await createAuth(authPath);
  }

}

module.exports = {
  isDirExist,
  isAuthExist,
  createAuth,
  init
};