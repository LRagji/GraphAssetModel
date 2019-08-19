
module.exports = class BitStream {

    constructor(numberofBits) {
        this.getBit = this.getBit.bind(this);
        this.setBit = this.setBit.bind(this);

        let numberOfBytes = 0;
        if (numberofBits > 0) {
            numberOfBytes = Math.ceil(Math.floor(numberofBits) / 8);
        }
        this._stream = new Uint8ClampedArray(numberOfBytes);

        this.memorySize = Uint8ClampedArray.BYTES_PER_ELEMENT * this._stream.length;
    }

    getBit(bitNumber) {

    }

    setBit(bitNumber) {

    }

}