/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class IWinery extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const wines = [
            {
                id: "Cz2xVQVJjIvXctwlDhgY",
                date: '2022-05-18',
                location: 'Vila Real',
                move: 'Fermentacao',
                temperature: '30',
                humidity: '80',
                container: "Barril de Aco",
                responsible: "Antonio Costa",
                addedElements: "[{name: 'Acucar', quantity: '200'}"
            },
            {
                id: "Cz2xVQVJjIvXctwlDhgY",
                date: '2022-07-18',
                location: 'Peso da Regua',
                move: 'Movimentacao de Barril',
                temperature: '30',
                humidity: '80',
                container: "Barril de Aço",
                responsible: "Jose das Alfaces",
                addedElements: ""
            },
        ];

        for (let i = 0; i < wines.length; i++) {
            wines[i].docType = 'wine';
            await ctx.stub.putState('WINE' + i, Buffer.from(JSON.stringify(wines[i])));
            console.info('Added <--> ', wines[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryWine(ctx, wineNumber) {
        const wineAsBytes = await ctx.stub.getState(wineNumber); // get the car from chaincode state
        if (!wineAsBytes || wineAsBytes.length === 0) {
            throw new Error(`${wineNumber} does not exist`);
        }
        console.log(wineAsBytes.toString());
        return wineAsBytes.toString();
    }

    async createWine(ctx, wineNumber, id, date, location, move, temperature, humidity, container, responsible, addedElements) {
        console.info('============= START : Create Wine ===========');

        const wine = {
            id,
            docType: 'wine',
            date,
            location,
            move,
            temperature,
            humidity,
            container,
            responsible,
            addedElements,
        };

        await ctx.stub.putState(wineNumber, Buffer.from(JSON.stringify(wine)));
        console.info('============= END : Create Wine ===========');
    }

    async queryAllWines(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    
    /*async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }*/

}

module.exports = IWinery;
