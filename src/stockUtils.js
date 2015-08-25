
var stockUtils = (function() {
    var symbolMapping = new Array();
    symbolMapping['amazon'] = 'AMZN';
    symbolMapping['apple'] = 'AAPL';
    symbolMapping['google'] = 'GOOG';
    symbolMapping['microsoft'] = 'MSFT';
    symbolMapping['ebay'] = 'EBAY';
    symbolMapping['facebook'] = 'FB';
    symbolMapping['twitter'] = 'TWTR';

    function getSymbolForCompany(company) {
        return symbolMapping[company.toLowerCase()];
    }

    function getNasdaqQuote(symbol, reponseCallback) {
        console.log("Making service call for :" + symbol);
        var http = require('http');
        

        httpResponseCallback = function(response) {
            var responseStr = ''
            response.on('data', function (chunk) {
                console.log("Data recieved for service call for  :" + symbol);
                responseStr += chunk;
            });

            response.on('end', function () {
                console.log("Data reception complete for service call for  :" + symbol);
                var res = JSON.parse(responseStr.substring(responseStr.indexOf("[")+1,responseStr.length-(responseStr.indexOf("[")-2))); 
                console.log("Stock Price from Google finanace:" + res["l"]);
                reponseCallback.func.call(reponseCallback.context, {errorCode: "OK", price: "$" + res["l"]});            
            });
        };

        var req = http.request("http://finance.google.com/finance/info?client=ig&q=NASDAQ:" + symbol, httpResponseCallback);
        console.log("Made service call for  :" + symbol);
        req.end();

    }

return {
    getStockPrice: function(company, reponseCallback) {
        var symbol = getSymbolForCompany(company);
        if(symbol === undefined) {
            reponseCallback.func.call(reponseCallback.context, {errorCode: "NO_SYMBOL"});
            return;
        } 
        getNasdaqQuote(symbol, reponseCallback);
    }
}
})();

module.exports = stockUtils;