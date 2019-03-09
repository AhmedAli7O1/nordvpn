"use strict";

const https = require("https");


function get (url, isJSON = false) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (isJSON) {
          resolve(JSON.parse(data));
        }
        else {
          resolve(data);
        }
      });

    }).on("error", reject);
  });
}

module.exports = {
  get
};