const path = require('path');
const fs = require('fs');
const safeEval = require('safe-eval');
const { Gateway, Wallets } = require('fabric-network');

var contract;

async function loadContract() {
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
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
    contract = network.getContract('fabcar');
}

loadContract();

module.exports.EvaluateTransaction = async function(res, name, ...args){
    try {

        const result = await contract.evaluateTransaction(name, ...args);
        var response;

        if(name == "queryAllWines" || name == "queryWineByWineId"){
            response = safeEval(result.toString());
            for(var i = 0; i < response.length; i++){
                response[i].Record.addedElements = safeEval(response[i].Record.addedElements);
            }
        }

        else{
            response = JSON.parse(result.toString());
            response.addedElements = safeEval(response.addedElements);
        } 

        console.log("EvaluateTransation: ", name);
        res.status(200).json(response);
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
    }
}

module.exports.SubmitTransaction = async function(res, name, ...args){
    try {

        await contract.submitTransaction(name, ...args);
        console.log("Submit Transaction: ", name);
        res.status(200).json({message: "Transaction Submmited!", id: args[0]});
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
    }
}

