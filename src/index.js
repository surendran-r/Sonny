/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.df6cbba5-617c-4a42-943b-68003f3dc94d";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var stockUtils = require('./stockUtils');

/**
 * Sonny is a child of AlexaSkill, this is for code reuse and modularity
 */
var Sonny = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Sonny.prototype = Object.create(AlexaSkill.prototype);
Sonny.prototype.constructor = Sonny;

Sonny.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Sonny onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

Sonny.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Sonny onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Hi, This is Sonny. Suren and Vinisha's personal assisant. You can ask me about stock prices and recipies for food.";
    response.askWithCard(speechOutput,undefined, "Hi From Sonny", speechOutput);
};

Sonny.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Sonny onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Sonny.prototype.intentHandlers = {
    // register custom intent handlers
    StockIntent: function (intent, session, response) {
        var CARD_HEADER = "Stock Price";
        console.log("Sonny Stock request for " + intent.slots.Symbol.value);

        var reponseCallback = { func: function(stockPriceResponse) {
                if(stockPriceResponse.errorCode === "OK") {
                    var voiceResponse = intent.slots.Symbol.value + " is trading at " + stockPriceResponse.price;
                    var textResponse = "Stock Price of " + intent.slots.Symbol.value + " is " + stockPriceResponse.price;
                    response.tellWithCard(voiceResponse, CARD_HEADER, textResponse) ;
                } else {
                    var voiceResponse = "Sorry! seems to be some trouble in getting the stock price for " + intent.slots.Symbol.value ;
                    var textResponse = "Failed to get Stock Price of " + intent.slots.Symbol.value + " due to " + stockPriceResponse.errorCode;
                    response.tellWithCard(voiceResponse, CARD_HEADER, textResponse) ;
                }
            },
        context: this 
        };      
        stockUtils.getStockPrice(intent.slots.Symbol.value, reponseCallback);
    },
    RecipeIntent: function (intent, session, response) {
        console.log("Sonny recipe for " + intent.slots.DishName.value);
        response.tellWithCard("I will get the recipe for " + intent.slots.DishName.value, "Recpie" , "Recipe for " + intent.slots.DishName.value);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Sonny skill.
    var sonny = new Sonny();
    sonny.execute(event, context);
};

