var test = require('tape');
var openpublishState = require('./axios-index')({
  network: "testnet"
});

// findTips
test('should find the tips for a document with a sha1 of 2dd0b83677ac2271daab79782f0b9dcb4038d659', function(t) {
   openpublishState.findTips({ sha1: "2dd0b83677ac2271daab79782f0b9dcb4038d659" })
      .then(function(res) {
         t.ok(res.tipCount > 0, 'tipCount');
         t.ok(res.totalTipAmount > 0, 'totalTipAmount');
         t.ok(res.tips.length > 0, 'tips');
         t.end();
      });
});

test('should not find the tips for a document with a sha1 of XXX', function(t) {
   openpublishState.findTips({ sha1: "XXX"})
      .then(function(res) {
         // this should actually return an err and tipInfo == false, but we need an api change on bsync
         t.ok(!res.err, 'err is false');
         t.ok(res.tips.length === 0, 'tipInfo.tips is empty');
         t.end();
      });
});

// findAllTips
test('should find all open tips', function (t) {
  openpublishState.findAllTips({})
   .then(function(res) {
      t.ok(!res.err, 'err is false');
      t.ok(res.length > 0, "at least found some open tips");
      t.ok(res[0].tx_out_hash !== null, "txid of tip is not null");
      t.ok(res[0].sha1 !== null, "sha1 of tip is not null");
      t.end();
   });
});
