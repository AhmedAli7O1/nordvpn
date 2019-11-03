'use strict';

const inquirer = require('inquirer');
const _ = require('lodash');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));


async function autocomplete(data, message) {
  const answer = await inquirer.prompt([
    {
      type: 'autocomplete',
      choices: data,
      default: data[0],
      message: message || 'select from the following',
      name: 'autocomplete',
      pageSize: 20,
      source: autocompleteFilter(data)
    }
  ]);

  return answer.autocomplete;
}

async function checkbox (data, message) {
  const answer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'checkbox',
      message: message || 'select one or more',
      choices: data,
      default: data[0]
    }
  ]);

  return answer.checkbox;
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

module.exports = {
  autocomplete, checkbox
};
