const bitsInByte = 8;

module.exports = class BitStream {

    constructor(YMax, XMax, ZMax) {
        this.getBit = this.getBit.bind(this);
        this.setBit = this.setBit.bind(this);
        this.clearBit = this.clearBit.bind(this);

        this.dimensionSize = {
            "YMax": YMax,
            "XMax": XMax,
            "ZMax": ZMax
        };

        this._numberOfBits= YMax * XMax * ZMax;
        
        let numberOfBytes = 0;
        if (this._numberOfBits > 0) {
            numberOfBytes = Math.ceil(Math.floor(this._numberOfBits) / bitsInByte);
        }
        this._stream = new Uint8ClampedArray(numberOfBytes);

        this.memorySize = Uint8ClampedArray.BYTES_PER_ELEMENT * this._stream.length;
    }

    getBit(bitNumber) {
        if (bitNumber < 0 || bitNumber >= this._numberOfBits) {
            throw new Error('Invalid bit number ' + bitNumber);
        }
        let byteTrayIndex = Math.floor(bitNumber / bitsInByte);
        let bitNo = ((bitNumber / bitsInByte) - byteTrayIndex) * bitsInByte;
        let byteTray = this._stream[byteTrayIndex];
        let bitmask = 1 << bitNo;
        return (byteTray & bitmask) !== 0;
    }

    setBit(bitNumber) {
        if (bitNumber < 0 || bitNumber >= this._numberOfBits) {
            throw new Error('Invalid bit number ' + bitNumber);
        }
        let byteTrayIndex = Math.floor(bitNumber / bitsInByte);
        let bitNo = ((bitNumber / bitsInByte) - byteTrayIndex) * bitsInByte;
        let byteTray = this._stream[byteTrayIndex];
        let bitmask = 1 << bitNo;
        this._stream[byteTrayIndex] = byteTray |= bitmask;
        return true;
    }

    clearBit(bitNumber) {
        if (bitNumber < 0 || bitNumber >= this._numberOfBits) {
            throw new Error('Invalid bit number ' + bitNumber);
        }
        let byteTrayIndex = Math.floor(bitNumber / bitsInByte);
        let bitNo = ((bitNumber / bitsInByte) - byteTrayIndex) * bitsInByte;
        let byteTray = this._stream[byteTrayIndex];
        let bitmask = 1 << bitNo;
        this._stream[byteTrayIndex] = byteTray &= ~bitmask;
        return true;
    }

}