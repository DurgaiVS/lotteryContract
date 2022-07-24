pragma solidity ^0.4.17;


contract Lottery{
    address public manager;
    address[] private players;
    string[] private playersName;
    string public managerName; 
    string public winner;

    function Lottery(string name) public {
        manager = msg.sender;
        managerName = name;
    }
 
    function enter(string name) public payable {
        require(msg.value > 0.0001 ether);
        uint count = 0;
        bool newPlayer = true;
        if(players.length != 0) {
            for(count; count < players.length; count = count + 1) {
                if(players[count] == msg.sender) {
                    newPlayer = false;
                    msg.sender.transfer(msg.value / 10 * 9);
                    break;
                } 
            }
            require(newPlayer);
            players.push(msg.sender);
            playersName.push(name);
        } else {
            players.push(msg.sender);
            playersName.push(name);
        }
    }

    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
        //sha3 is an instance of keccak256
    }

    function pickWinner() public restriction {
        uint index = random() % players.length;
        winner = playersName[index];
        players[index].transfer(this.balance / 10 * 8);
        manager.transfer(this.balance / 10 * 2);
        players = new address[](0);
        playersName = new string[](0);
    }

    modifier restriction() {
        require(msg.sender == manager);
        _;
    }

    function getPlayersCount() public view returns (uint) {
        return players.length;
    }

    function getMinAmount() public pure returns (string) {
        return '0.0001';
    }

}