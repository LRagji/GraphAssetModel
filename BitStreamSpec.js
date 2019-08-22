let expect = require('chai').expect;
let targetType = require('./BitStream');

it('Bit Stream: Calculate correct memory size for byte', function (done) {

    let target = new targetType(8);
    expect(target.memorySize).to.equal(1);
    done();
});

it('Bit Stream: Calculate correct memory size for float', function (done) {

    let target = new targetType(8.3);
    expect(target.memorySize).to.equal(1);
    done();
});

it('Bit Stream: Calculate correct memory size for under byte size', function (done) {

    let target = new targetType(7);
    expect(target.memorySize).to.equal(1);
    done();
});

it('Bit Stream: Calculate correct memory size for over byte size', function (done) {

    let target = new targetType(9);
    expect(target.memorySize).to.equal(2);
    done();
});

it('Bit Stream: Calculate correct memory size for zero bits', function (done) {

    let target = new targetType(0);
    expect(target.memorySize).to.equal(0);
    done();
});

it('Bit Stream: Calculate correct memory size for negative bits', function (done) {

    let target = new targetType(-1);
    expect(target.memorySize).to.equal(0);
    done();
});

it('Bit Stream: Get value of negative bit', function (done) {

    let target = new targetType(10);
    expect(() => target.getBit(-1)).to.throw('Invalid bit number -1');
    done();
});

it('Bit Stream: Get value of bit outside the assigned bits', function (done) {

    let target = new targetType(10);
    expect(() => target.getBit(11)).to.throw('Invalid bit number 11');
    done();
});

it('Bit Stream: Get value of bit zero with zero bits requested', function (done) {

    let target = new targetType(0);
    expect(() => target.getBit(0)).to.throw('Invalid bit number 0');
    done();
});

it('Bit Stream: Set value of negative bit', function (done) {
    let target = new targetType(10);
    expect(() => target.setBit(-1)).to.throw('Invalid bit number -1');
    done();
});

it('Bit Stream: Set value of bit outside the assigned bits', function (done) {
    let target = new targetType(10);
    expect(() => target.setBit(11)).to.throw('Invalid bit number 11');
    done();
});

it('Bit Stream: Set value of bit zero with zero bits requested', function (done) {
    let target = new targetType(0);
    expect(() => target.setBit(0)).to.throw('Invalid bit number 0');
    done();
});

it('Bit Stream: Clear value of negative bit', function (done) {
    let target = new targetType(10);
    expect(() => target.clearBit(-1)).to.throw('Invalid bit number -1');
    done();
});

it('Bit Stream: Clear value of bit outside the assigned bits', function (done) {
    let target = new targetType(10);
    expect(() => target.clearBit(11)).to.throw('Invalid bit number 11');
    done();
});

it('Bit Stream: Get Set Clear Bit Fields', function (done) {
    const numberOfBits = 1000 * 1000 * 5;
    let target = new targetType(numberOfBits);
    let expected = "";
    for (let ctr = 0; ctr < numberOfBits; ctr++) {
        if (ctr % 2 == 0) {
            target.setBit(ctr);
            expected += '1';
        }
        else {
            target.clearBit(ctr);
            expected += '0';
        }
    }
    let actual = "";
    for (let ctr = 0; ctr < numberOfBits; ctr++) {
        actual += target.getBit(ctr) ? '1' : '0';
    }
    expect(expected).to.be.equal(actual);
    done();
});

it('Bit Stream: Clear value of bit zero with zero bits requested', function (done) {
    let target = new targetType(0);
    expect(() => target.clearBit(0)).to.throw('Invalid bit number 0');
    done();
});