var test = require('tape');
var openpublishState = require('./axios-index')({
  network: "testnet"
});

// findTips
test('should find the tips for a document with a sha1 of 2dd0b83677ac2271daab79782f0b9dcb4038d659', function(t) {
   openpublishState.findTips({ sha1: "2dd0b83677ac2271daab79782f0b9dcb4038d659" })
      .then(function(res) {
         t.ok(res.data.tipCount > 0, 'tipCount');
         t.ok(res.data.totalTipAmount > 0, 'totalTipAmount');
         t.ok(res.data.tips.length > 0, 'tips');
         t.end();
      });
});

test('should not find the tips for a document with a sha1 of XXX', function(t) {
   openpublishState.findTips({ sha1: "XXX"})
      .then(function(res) {
         // this should actually return an err and tipInfo == false, but we need an api change on bsync
         t.ok(!res.err, 'err is false');
         t.ok(res.data.tips.length === 0, 'tipInfo.tips is empty');
         t.end();
      });
});

// findAllTips
test('should find all open tips', function (t) {
  openpublishState.findAllTips({})
   .then(function(res) {
      t.ok(!res.err, 'err is false');
      t.ok(res.data.length > 0, "at least found some open tips");
      t.ok(res.data[0].tx_out_hash !== null, "txid of tip is not null");
      t.ok(res.data[0].sha1 !== null, "sha1 of tip is not null");
      t.end();
   });
});

// findDoc
test('should find a document with a sha1 of 2dd0b83677ac2271daab79782f0b9dcb4038d659', function(t) {
   openpublishState.findDoc({sha1: "2dd0b83677ac2271daab79782f0b9dcb4038d659"})
      .then(function(res) {
         t.equal(res.data.output.tx_hash, '2587d9a8662afb37fc32bfdb4914c2d08a134fd709cb7a84db08a22ca578dedf', 'txid');
         t.equal(res.data.sourceAddresses[0], 'msLoJikUfxbc2U5UhRSjc2svusBSqMdqxZ', 'sourceAddresses');
         t.equal(res.data.name, 'ega_art_detail.gif', 'name');
         t.equal(res.data.btih, '9028e4200b976662d11159c2b16a6c12ef83d967', 'btih');
         t.equal(res.data.sha1, '2dd0b83677ac2271daab79782f0b9dcb4038d659', 'sha1');
         t.ok(!res.data.tips, 'no tips');
         t.end();
      });
});

// findAllByType
test('should find 10 images that have been registered with Open Publish', function(t) {
   openpublishState.findAllByType({type:'image', limit: 2})
      .then(function(res) {
         t.ok(res.data.length === 2, 'has 2 documents');
         var openpublishDoc = res.data[0];
         t.ok(openpublishDoc.output.tx_hash, 'txid');
         t.ok(openpublishDoc.sourceAddresses[0], 'sourceAddresses');
         t.ok(openpublishDoc.name, 'name');
         t.ok(openpublishDoc.btih, 'btih');
         t.ok(openpublishDoc.sha1, 'sha1');
         t.end();
      });
});

// findDocsByUser
test('should find all opendocs by specified user', function (t) {
   openpublishState.findDocsByUser({address: "mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg"})
      .then(function(res) {
         t.ok(!res.err, 'err is false');
         t.ok(res.data.length > 0, "found some posts at this address");
         var doc = res.data[0];
         t.ok(doc.sha1 !== null, "doc's sha1 should not be null");
         t.ok(doc.btih !== null, "doc's btih should not be null");
         t.ok(doc.name !== null, "doc's name should not be null");
         t.ok(doc.size !== null, "doc's size should not be null");
         t.ok(doc.type !== null, "doc's type should not be null");
         t.end();
      });
});

test('should find all opendocs and opendocs\' tips by specified user', function (t) {
   openpublishState.findDocsByUser({
    address: "mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg",
    includeTips: true
   }).then(function(res) {
      console.log("here at test with: ", res);
      t.ok(!res.err, 'err is false');
      t.ok(res.data.length > 0, "found some posts at this address");
      var doc = res.data[0];
      t.ok(doc.sha1 !== null, "doc's sha1 should not be null");
      t.ok(doc.btih !== null, "doc's btih should not be null");
      t.ok(doc.name !== null, "doc's name should not be null");
      t.ok(doc.size !== null, "doc's size should not be null");
      t.ok(doc.type !== null, "doc's type should not be null");
      console.log("doc: ", doc);
      t.ok(doc.tipCount >= 0, 'tipCount');
      t.ok(doc.totalTipAmount >= 0, 'totalTipAmount');
      t.ok(doc.tips.length >= 0, 'tips');
      t.end();
   });

});
