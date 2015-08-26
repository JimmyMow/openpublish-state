var axios = require('axios');

var OpenpublishState = function(baseOptions) {

  var network = baseOptions.network;
  var baseUrl = baseOptions.baseUrl || network == "testnet" ? "https://bsync-test.blockai.com" : "https://bsync.blockai.com";

  var processOpenpublishDoc = function(doc) {
    doc.txid = doc.txid || doc.txout_tx_hash;
    return doc;
  };

  var findTips = function(options) {
    console.log(options.sha1);
    return axios.get(baseUrl + "/opendocs/sha1/" + options.sha1 + "/tips")
      .then(function(res) {
        var totalTipAmount = 0;
        for (var i=0; i < res.data.length; i++) {
          totalTipAmount += res.data[i].amount;
        }

        var data =  {
          tips: res.data,
          totalTipAmount: totalTipAmount,
          tipCount: res.data.length
        };

        return { data: data };
      })
      .catch(function(err) {
        return { err: err };
      });
  };

  var findAllTips = function(options) {
    return axios.get(baseUrl + "/opentips")
      .then(function(res) {
        return { data: res.data };
      })
      .catch(function(err) {
        return { err: err };
      });
  };

  var findDoc = function(options) {
    return axios.get(baseUrl + "/opendocs/sha1/" + options.sha1)
      .then(function(res) {
        var openpublishDoc = res.data;
        if (!openpublishDoc) {
          return { err: true };
        }
        processOpenpublishDoc(openpublishDoc);
        if (options.includeTips) {
          findTips({sha1:sha1})
            .then(function(res) {
              openpublishDoc.totalTipAmount = res.totalTipAmount;
              openpublishDoc.tipCount = res.tipCount;
              openpublishDoc.tips = res.tips;
            })
            .catch(function(err) {
              return { err: err }
            });
            return { data: openpublishDoc };
        }
        else {
          return { data: openpublishDoc };
        }
    });
  };

  return {
    findTips: findTips,
    findAllTips: findAllTips,
    findDoc: findDoc
  }

};


module.exports = OpenpublishState;
