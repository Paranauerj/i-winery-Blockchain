const { SubmitTransaction, EvaluateTransaction } = require("./smartContractHandler");
require('dotenv').config();

// Pega a API_KEY do .env
const API_KEY = process.env.API_KEY_IWINERY;

module.exports.listInteractions = async function(req, res, next){
    EvaluateTransaction(res, "queryAllWines");
}

module.exports.getInteraction = async function(req, res, next){
    EvaluateTransaction(res, "queryWine", req.params.id_interaction_wine);
}

module.exports.getInteractionsByWineId = async function(req, res, next){
    EvaluateTransaction(res, "queryWineByWineId", req.params.id_wine);
}

module.exports.createInteraction = async function(req, res){
    if(req.headers["x-api-key"] !== API_KEY){
        res.status(403).json({message: "Forbidden - Invalid API Key", code: "403"});
        return;
    }

    var elements = req.body.addedElements;
    var aux = [];
    for(var i = 0; i < elements.length; i++){
        aux.push(JSON.stringify(elements[i]))
    }
    var addedElements = "[" + aux.join(',') + "]";

    SubmitTransaction(res, "createWine", "WINE" + String(Math.floor(Math.random() * 10000000)), req.body.id, req.body.date, req.body.location, req.body.move, req.body.temperature, req.body.humidity, req.body.container, req.body.responsible, addedElements)
}

module.exports.deleteInteraction = async function(req, res){
    if(req.headers["x-api-key"] !== API_KEY){
        res.status(403).json({message: "Forbidden - Invalid API Key", code: "403"});
        return;
    }

    SubmitTransaction(res, "removeWine", req.params.id_interaction_wine);
}