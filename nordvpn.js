"use strict";

const logger = require("./logger");
const _ = require("lodash");
const { get } = require("./request");
const inquirer = require("inquirer");
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));


async function getServers () {
  return await get("https://nordvpn.com/api/server", true);
}

function autocompleteFilter (list) {
  return function (answers, input) {
    return new Promise(resolve => {
      if (!input) resolve(list);

      resolve(_.filter(list, item => {
        return item.toLowerCase().indexOf(input.toLowerCase()) > -1;
      }));
    });
  }
}

async function selectServer (servers) {

  const countryList = _.uniq(_.map(servers, "country"));
  const protocols = ["tcp", "udp"];

  const { country, protocol } = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "country",
      message: "search for a country:",
      source: autocompleteFilter(countryList)
    },
    {
      type: "autocomplete",
      name: "protocol",
      message: "preferred protocol:",
      source: autocompleteFilter(protocols)
    }
  ]);

  const avaliableServers = _.filter(servers, x => {
    return x.country === country && x.features[`openvpn_${protocol}`];
  });

  const selectedServer = _.head(_.sortBy(avaliableServers, "load"));
  selectedServer.protocol = protocol;

  return selectedServer;
}

module.exports = {
  getServers,
  selectServer
};
