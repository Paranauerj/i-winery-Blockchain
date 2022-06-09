const { listInteractions, getInteraction, getInteractionsByWineId, createInteraction, deleteInteraction } = require('./controller.js');

module.exports.LoadRoutes = function(app){

    app.get("/wines/interactions", listInteractions);
    
    app.get("/wines/interactions/:id_interaction_wine", getInteraction);
    
    app.get("/wines/:id_wine", getInteractionsByWineId);
    
    app.post("/wines/interactions", createInteraction);
    
    app.delete("/wines/interactions/:id_interaction_wine", deleteInteraction);

}
