const { Framework } = require('@vechain/connex-framework');
const { Driver, SimpleNet, SimpleWallet } = require('@vechain/connex-driver');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

function compileSolidity(sourceCode) {
  const input = {
    language: 'Solidity',
    sources: {
      'contract.sol': {
        content: sourceCode
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts['contract.sol'][Object.keys(output.contracts['contract.sol'])[0]];
  
  return {
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object
  };
}

async function deployContract() {
  try {
    const wallet = new SimpleWallet();
    const privateKey = process.env.PRIVATE_KEY || '0x0123456789012345678901234567890123456789012345678901234567890123';
    wallet.import(privateKey);
    
    const thorUrl = process.env.THOR_URL || 'http://localhost:8669';
    console.log('Using Thor URL:', thorUrl);

    const net = new SimpleNet(thorUrl);
    console.log('SimpleNet instance created');

    const driver = await Driver.connect(net, wallet);
    console.log('Driver instance created');

    const connex = new Framework(driver);
    console.log('Connex Framework instance created');

    const contractPath = path.resolve(__dirname, '../blockchain/product/product.contract.sol');
    const contractSource = fs.readFileSync(contractPath, 'utf8');

    const { abi, bytecode } = compileSolidity(contractSource);
    console.log('Contract compiled');

    const deployClause = connex.thor.account('0x0000000000000000000000000000000000000000').method(abi[0]).asClause(bytecode);

    const result = await connex.vendor.sign('tx', [deployClause])
      .signer(wallet.list[0].address)
      .request();

    const contractAddress = result.outputs[0].contractAddress;
    console.log('Contract deployed at:', contractAddress);

    // Save the contract address to a file
    fs.writeFileSync(path.resolve(__dirname, '../contractAddress.json'), JSON.stringify({ address: contractAddress }));
  } catch (error) {
    console.error('Error in deployContract:', error);
    throw error;
  }
}

module.exports = deployContract;
