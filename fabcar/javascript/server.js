/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();

app.get("/wines", async function(req, res, next){
    EvaluateTransaction(res, req, "queryAllWines");
});

app.get("/wines/:id_wine", async function(req, res, next){
    EvaluateTransaction(res, "queryWine", req.params.id_wine);
});

app.post("/wines", async function(req, res){
    var elements = req.body.addedElements;
    var aux = [];
    for(var i = 0; i < elements.length; i++){
        aux.push(JSON.stringify(elements[i]))
    }

    var addedElements = aux.join(',');

    SubmitTransaction(res, createWine, String(Math.floor(Math.random() * 10000000)), req.body.id, req.body.date, req.body.location, req.body.move, req.body.temperature, req.body.humidity, req.body.container, req.body.responsible, addedElements)
});

app.listen("8001");

async function EvaluateTransaction(res, name, ...args){
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');

        const result = await contract.evaluateTransaction(name, args);
        var response = args.length == 0 ? eval(result.toString()) : JSON.parse(result.toString());
        res.status(200).json(response);

        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
}

async function SubmitTransaction(res, name, ...args){
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');

        await contract.submitTransaction(name, args);
        res.status(200).json({message: "Transaction Submmited!"});

        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
}
