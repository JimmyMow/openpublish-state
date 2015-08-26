var axios = require('axios');

var OpenpublishState = function(baseOptions) {

  var network = baseOptions.network;
  var baseUrl = baseOptions.baseUrl || network == "testnet" ? "https://bsync-test.blockai.com" : "https://bsync.blockai.com";

  var findTips = function(options) {
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
        console.log("err: ", err);
        return err;
      });
  };

  return {
    findTips: findTips
  }

};

module.exports = OpenpublishState;
