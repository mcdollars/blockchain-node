const SHA256 = require('crypto-js/sha256');

class CryptoBlock {
    constructor(index, timestamp, data, precedingHash = " ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
        this.nonce = 0;
    }

    computeHash() {
        return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    proofOfWork(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }

}


class CryptoBlockchain {
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = 4;
    }

    startGenesisBlock() {
        return new CryptoBlock(0, "01/01/2020", "Initial Block in the Chain", "0");
    }

    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        // newBlock.hash = newBlock.computeHash();
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }

    checkChainValidity() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }

            if (currentBlock.precedingHash !== precedingBlock.hash)
                return false;
        }
        return true;
    }

}


let smashingCoin = new CryptoBlockchain();
smashingCoin.addNewBlock(new CryptoBlock(1, "01/06/2020", { sender: "Iris Ljesnjanin", recipient: "Cosima Mielke", quantity: 50 }));
smashingCoin.addNewBlock(new CryptoBlock(2, "01/07/2020", { sender: "Vitaly Friedman", recipient: "Ricardo Gimenes", quantity: 100 }));
console.log(JSON.stringify(smashingCoin, null, 4));
