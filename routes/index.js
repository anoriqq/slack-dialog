'use strict';

// パッケージの読み込み
const express = require('express');
const router = express.Router();
const debug_router = require('debug')('app:roter');
const debug_request = require('debug')('app:request');
const debug_data = require('debug')('app:data');
const request = require('request');

router.post('/open', (req, res, next) => {
  res.status(200).end();
  debug_router('open post OK');
  debug_router(req.body);
  openDialog(req.body.trigger_id);
});

router.post('/api', (req, res, next) => {
  res.status(200).end();
  debug_router('api post OK');
  const input = JSON.parse(req.body.payload).submission.input;
  debug_router(input);
  getData(input).then(data=>{
    debug_data(data);
    postText(data);
  });
});

function openDialog(trigger_id){
  const options = {
    url: 'https://slack.com/api/dialog.open',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'charset': 'utf8',
      'Authorization': 'Bearer ' + process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN
    },
    json: true,
    json: {
      token: process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN,
      dialog: {
        title: 'たいとる',
        callback_id: 'dialog',
        elements: [
          {
            "type": "text",
            "label": "入力",
            "name": "input"
          }
        ]
      },
      trigger_id: trigger_id
    }
  };
  debug_request(options);
  request(options, (err, res, body)=>{
    if (err){
      debug_request(err);
      return;
    }
    debug_request('done');
    debug_request(body);
  });
}

function getData(input){
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve('OKだよ' + input);
    },5000);
  })
}

function postText(text){
  const options = {
    url: 'https://slack.com/api/chat.postMessage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'charset': 'utf8',
      'Authorization': 'Bearer ' + process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN
    },
    json: true,
    json: {
      token: process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN,
      text: text,
      channel: 'CHB0UV770'

    }
  };
  request(options, (err, res, body) => {
    if (err) {
      debug_request(err);
      return;
    }
    debug_request('post done');
    debug_request(body);
  });
}

module.exports = router;
