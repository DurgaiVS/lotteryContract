import path from 'path';
import fs from 'fs';
import solc from 'solc';

const lotteryPath = path.resolve("C:\\Users\\durga\\VScode\\Blockchain\\lottery\\contract\\Lottery.sol");
//since __dirname is not defined in ESmodule

const source = fs.readFileSync(lotteryPath, 'utf-8');
const expFile = solc.compile(source, 1).contracts[':Lottery'];
//this contracts['"here":Lottery'],"here" is used to speciy filename we compile
//here we only compile one file, so...
// console.log(expFile)

export default expFile
