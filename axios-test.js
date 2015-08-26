var test = require('tape');
var axios = require('axios');
var openpublishState = require('./axios-index')({
  network: "testnet"
});

test('should find the tips for a document with a sha1 of 2dd0b83677ac2271daab79782f0b9dcb4038d659', function(t) {
   openpublishState.findTips({sha1: "2dd0b83677ac2271daab79782f0b9dcb4038d659"})
      .then(function(res) {
         t.ok(res.tipCount > 0, 'tipCount');
         t.ok(res.totalTipAmount > 0, 'totalTipAmount');
         t.ok(res.tips.length > 0, 'tips');
         t.end();
      });
});
