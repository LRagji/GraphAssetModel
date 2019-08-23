const bitsInByte = 8;

module.exports = class BitStream {

    constructor(YMax, XMax, ZMax) {
        this.getBit = this.getBit.bind(this);
        this.setBit = this.setBit.bind(this);
        this.clearBit = this.clearBit.bind(this);
        this.read = this.read.bind(this);
        this.mark = this.mark.bind(this);
        this._generateLoop = this._generateLoop.bind(this);
        this._convertToSerialIndex = this._convertToSerialIndex.bind(this);

        this.dimensionSize = {
            "YMax": YMax,
            "XMax": XMax,
            "ZMax": ZMax
        };

        this._numberOfBits = YMax * XMax * ZMax;

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

    read(y, x, z, iteratorCallback) {
        //TODO: Check for Negative number for x,y,z axes and should be less than Xmax, Ymax and Zmax
        this._generateLoop(y, this.dimensionSize.YMax, (YIdx) => {
            return this._generateLoop(x, this.dimensionSize.XMax, (XIdx) => {
                return this._generateLoop(z, this.dimensionSize.ZMax, (ZIdx) => {
                    let serialIdx = this._convertToSerialIndex(YIdx, XIdx, ZIdx,this.dimensionSize.XMax,this.dimensionSize.YMax);
                    if (this.getBit(serialIdx)) {
                        return iteratorCallback(YIdx, XIdx, ZIdx);
                    }
                });
            });
        });
    }

    _generateLoop(parameter, defaultEP, iteratorFunction) {
        //Scan Or Fetch Mode
        for (let counter = (parameter == undefined ? 0 : parameter); counter < (parameter == undefined ? defaultEP : (parameter + 1)); counter++) {
            if (iteratorFunction(counter) === false) return false;
        }
    }

    mark(y, x, z) {
        if (y == undefined || x == undefined || z == undefined) {
            throw new Error("One or more parameters are null/undefined.");
        }
        let serialIdx = this._convertToSerialIndex(y, x, z,this.dimensionSize.XMax,this.dimensionSize.YMax);
        this.setBit(serialIdx);
    }

    _convertToSerialIndex(y, x, z, xLength, yLength) {
        let twoDimensionSerialIndex = (y * xLength) + x;
        let threeDimensionSerialIndex = twoDimensionSerialIndex + (z * xLength * yLength);
        return threeDimensionSerialIndex;
    }
}