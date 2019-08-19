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