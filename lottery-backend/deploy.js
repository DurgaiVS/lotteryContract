import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import solcObj from './compile.js'
import fs from 'fs'
import dataObj from '../contractsInfo.json' assert {type: 'json'};
//when executing the file type "node --experimental-json-modules deploy.js".

const provider = new HDWalletProvider(
  'picnic lens patrol mistake able escape abstract airport skin accuse cry hockey',
  'https://rinkeby.infura.io/v3/37ba19b722a04834aae33c7505c1bd53'
);
//This will use the mnemonic to connect to our account(using public & private key & address)
//The link specified is used to connect to the infura node [Can host a node on our local machine]


const web3 = new Web3(provider);
//This is specifically for rinkeby network to send/receive test ether


const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const arg = 'Durgai'

  const lottery = await new web3.eth.Contract(JSON.parse(solcObj.interface))
    .deploy({ data: solcObj.bytecode, arguments: [arg] })
    .send({ from: accounts[0], gas: '1000000'  });

  // console.log(solcObj);
  // console.log('Deployed to', lottery.options.address);
  //displaying the address of the contract deployed.

  // const jsonFile = fs.readFileSync("C:\\users\\durga\\VScode\\Blockchain\\contractsInfo.json", 'utf-8');
  // const dataObj = JSON.parse(jsonFile);
  dataObj.lottery.abi = solcObj.interface;
  dataObj.lottery.bytecode = solcObj.bytecode;
  dataObj.lottery.deployedAddr = lottery.options.address;
  fs.writeFile("../contractsInfo.json", JSON.stringify(dataObj), (e, r) => {
    if(e) console.log(e);
  });

  provider.engine.stop();
  //end the process
}
deploy();