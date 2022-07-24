import assert from 'assert';
import ganache from 'ganache-cli';
import Web3 from 'web3';
import solcObj from '../compile.js';

const web3 = new Web3(ganache.provider());
let accounts;
let lottery;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    //returns account number associated with the specified pneumonic
    lottery = await new web3.eth.Contract(JSON.parse(solcObj.interface))
    .deploy({ data: solcObj.bytecode, arguments: ['Durgai'] })
    .send({ from: accounts[0], gas: '1000000' });
    //deploys the contract on the ganache
});

describe('Lottery Contract', () => {

    it('Deploys!?', () => {
        assert.ok(lottery.options.address);
        //checks whether the contract is deployed
    });

    it('One player added!?', async () => {
        await lottery.methods.enter('Durgai').send({ 
            from: accounts[0], 
            value: web3.utils.toWei('0.0002', 'ether') 
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(players[0], accounts[0]);
        assert.equal(1, players.length);
        //check whether a single player is added to the lottery round
    });

    it('Multiple player added!?', async () => {
        await lottery.methods.enter('Durgai').send({ 
            from: accounts[0], 
            value: web3.utils.toWei('0.0002', 'ether') 
        });
        await lottery.methods.enter('DVS').send({ 
            from: accounts[1], 
            value: web3.utils.toWei('0.0002', 'ether') 
        });
        await lottery.methods.enter('Vel').send({ 
            from: accounts[2], 
            value: web3.utils.toWei('0.0002', 'ether') 
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(players[0], accounts[0]);
        assert.equal(players[1], accounts[1]);
        assert.equal(players[2], accounts[2]);
        assert.equal(3, players.length);
        //check whether multiple players are added to the lottery round
    });
    
    it('blocking a player from multiple entry', async () => {
        try {
            await lottery.methods.enter('Durgai').send({ 
                from: accounts[0], 
                value: web3.utils.toWei('0.0002', 'ether') 
            }); 
            await lottery.methods.enter('Durgai').send({ 
                from: accounts[0], 
                value: web3.utils.toWei('0.0002', 'ether') 
            });
            
            assert(false);
            //since a falsy value inside assert, this will cause failing in test
        } catch (e) {
            assert(e);
            //since a value is passed as e into assert, this will pass the test
        }
        //checks whether it prevents a player from entering into the lottery round multiple times
    });

    it('Minimum requirement check', async () => {
        try {
            await lottery.methods.enter('Durgai').send({ 
                from: accounts[0], 
                value: web3.utils.toWei('0.00009', 'ether') 
            });

            assert(false);
        } catch (e) {
            assert(e);
        }
        //checks whether the entry criteria is satisfied by the player
    });

    it('pickWinner working status from players', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (e) {
            assert(e);
        }
        //makes sure that a player should not be able to start the pickWinner function
    });

    it('pickWinner working status from manager', async () => {
        await lottery.methods.enter('Durgai').send({ 
            from: accounts[0], 
            value: web3.utils.toWei('0.0002', 'ether') 
        });
        await lottery.methods.enter('DVS').send({ 
            from: accounts[1], 
            value: web3.utils.toWei('0.0002', 'ether') 
        });

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(0, players.length);
        //makes sure that only manager is able to start the pickWinner function
    });

    it('does winner receive money', async () => {
        await lottery.methods.enter('Durgai').send({ 
            from: accounts[0], 
            value: web3.utils.toWei('2', 'ether') 
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        assert.notEqual(finalBalance, initialBalance);

        /*
        To be more precise, 
        const difference = finalBalance - initialBalance;
        assert(difference > web3.eth.toWei('1.8', 'ether'));
        */
        //since some amount of ether is spend as gas, we won't get exact amount in return that we spend
    });
});
