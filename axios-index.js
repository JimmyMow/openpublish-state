var axios = require('axios');

var OpenpublishState = function(baseOptions) {

  var network = baseOptions.network;
  var baseUrl = baseOptions.baseUrl || network == "testnet" ? "https://bsync-test.blockai.com" : "https://bsync.blockai.com";

  var findTips = function(options) {
    console.log(options.sha1);
    return axios.get(baseUrl + "/opendocs/sha1/" + options.sha1 + "/tips")
      .then(function(res) {
        var totalTipAmount = 0;
        for (var i=0; i < res.data.length; i++) {
          totalTipAmount += res.data[i].amount;
        }

        return {
          tips: res.data,
          totalTipAmount: totalTipAmount,
          tipCount: res.data.length
        };
      })
      .catch(function(err) {
        return { err: err };
      });
  };

  var findAllTips = function(options) {
    return axios.get(baseUrl + "/opentips")
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        return { err: err };
      });
  };

  return {
    findTips: findTips,
    findAllTips: findAllTips
  }

};


module.exports = OpenpublishState;
