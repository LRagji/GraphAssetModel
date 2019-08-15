let expect = require('chai').expect;
let targetType = require('./ThreeDimensionMatrix');

function convertToString(y, x, z) {
    return y + ',' + x + ',' + z;
}

it('Three Dimension Matrix: Calculate correct memory size', function (done) {
    let size = 10;
    let charByteSize = 2;
    let target = new targetType(size, size, size);
    expect(target.matrix.memorySize).to.equal(size * size * size * charByteSize);
    expect(target.dimensionSize.XMax).to.equal(size);
    expect(target.dimensionSize.YMax).to.equal(size);
    expect(target.dimensionSize.ZMax).to.equal(size);
    done();
});

it('Three Dimension Matrix: Validate markings are correct', function (done) {
    let size = 10;
    let target = new targetType(size, size, size);

    target.mark(0, 0, 0);
    target.mark(9, 9, 9);

    let hits = [];
    target.read(undefined, undefined, undefined, (y, x, z) => {
        hits.push(convertToString(y, x, z));
        return true;
    });

    expect(hits).to.deep.equal(['0,0,0', '9,9,9']);
    done();
});

it('Three Dimension Matrix: Validate iterator stops when asked to', function (done) {
    let size = 10;
    let target = new targetType(size, size, size);

    target.mark(0, 0, 0);
    target.mark(9, 9, 9);

    let hits = [];
    target.read(undefined, undefined, undefined, (y, x, z) => {
        hits.push(convertToString(y, x, z));
        return false;
    });

    expect(hits).to.deep.equal(['0,0,0']);
    done();
});


it('Three Dimension Matrix: Mark and Get same index on 3rd Axis', function (done) {
    let size = 10;
    let x = 0, y = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedResult = [];
    for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
        target.mark(y, x, counter);
        expectedResult.push(convertToString(y, x, counter));
    }

    let actualResult = [];
    for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
        target.read(y, x, counter, (y, x, z) => {
            actualResult.push(convertToString(y, x, counter));
            return true
        });
    }
    expect(actualResult).to.deep.equal(expectedResult);
    done();
});

it('Three Dimension Matrix: Mark and Get same index on 2nd Axis', function (done) {
    let size = 10;
    let z = 0, y = 0, defaultChar = '0', markchar = 'D';;
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedResult = [];
    for (let counter = 0; counter < target.dimensionSize.XMax; counter++) {
        target.mark(y, counter, z);
        expectedResult.push(convertToString(y, counter, z));
    }

    let actualResult = [];
    for (let counter = 0; counter < target.dimensionSize.XMax; counter++) {
        target.read(y, counter, z, (y, x, z) => {
            actualResult.push(convertToString(y, counter, z));
            return true
        });
    }
    expect(actualResult).to.deep.equal(expectedResult);
    done();
});

it('Three Dimension Matrix: Mark and Get same index on 1st Axis', function (done) {
    let size = 10;
    let z = 0, x = 0, defaultChar = '0', markchar = 'D';;
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedResult = [];
    for (let counter = 0; counter < target.dimensionSize.YMax; counter++) {
        target.mark(counter, x, z);
        expectedResult.push(convertToString(counter, x, z));
    }

    let actualResult = [];
    for (let counter = 0; counter < target.dimensionSize.YMax; counter++) {
        target.read(counter, x, z, (y, x, z) => {
            actualResult.push(convertToString(counter, x, z));
            return true
        });
    }
    expect(actualResult).to.deep.equal(expectedResult);
    done();
});

it('Three Dimension Matrix: Mark and Get 1Dimension Array on 1st Axis', function (done) {
    let size = 10;
    let z = 0, x = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedArray = [];
    for (let counter = 0; counter < target.dimensionSize.YMax; counter++) {
        target.mark(counter, x, z, markchar);
        expectedArray.push(counter);
    }

    let actualResult = [];
    target.read(undefined, x, z, (y, x, z) => {
        actualResult.push(y);
        return true
    })

    expect(actualResult).to.deep.equal(expectedArray);
    done();
});

it('Three Dimension Matrix: Mark and Get 1Dimension Array on 2nd Axis', function (done) {
    let size = 10;
    let z = 0, y = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedArray = [];
    for (let counter = 0; counter < target.dimensionSize.XMax; counter++) {
        target.mark(y, counter, z, markchar);
        expectedArray.push(counter);
    }

    let actualResult = [];
    target.read(y, undefined, z, (y, x, z) => {
        actualResult.push(x);
        return true
    })

    expect(actualResult).to.deep.equal(expectedArray);
    done();
});

it('Three Dimension Matrix: Mark and Get 1Dimension Array on 3rd Axis', function (done) {
    let size = 10;
    let x = 0, y = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedArray = [];
    for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
        target.mark(y, x, counter);
        expectedArray.push(counter);
    }

    let actualResult = [];
    target.read(y, x, undefined, (y, x, z) => {
        actualResult.push(z);
        return true
    })

    expect(actualResult).to.deep.equal(expectedArray);
    done();
});

it('Three Dimension Matrix: Mark and Get 2Dimension on 2nd & 3rd Axis', function (done) {
    let size = 10;
    let y = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedArray = [];
    for (let Xcounter = 0; Xcounter < target.dimensionSize.XMax; Xcounter++) {
        for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
            target.mark(y, Xcounter, counter);
            expectedArray.push(convertToString(y, Xcounter, counter));
        }
    }

    let actualResult = [];
    target.read(y, undefined, undefined, (y, x, z) => {
        actualResult.push(convertToString(y, x, z));
        return true
    })

    expect(actualResult).to.deep.equal(expectedArray);
    done();
});

it('Three Dimension Matrix: Mark and Get 2Dimension on 1st & 2nd Axis', function (done) {
    let size = 10;
    let z = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedArray = [];
    for (let Ycounter = 0; Ycounter < target.dimensionSize.YMax; Ycounter++) {
        for (let counter = 0; counter < target.dimensionSize.XMax; counter++) {
            target.mark(Ycounter, counter, z);
            expectedArray.push(convertToString(Ycounter, counter, z));
        }
    }

    let actualResult = [];
    target.read(undefined, undefined, z, (y, x, z) => {
        actualResult.push(convertToString(y, x, z));
        return true
    })

    expect(actualResult).to.deep.equal(expectedArray);
    done();
});

it('Three Dimension Matrix: Mark and Get 2Dimension on 1st & 3rd Axis', function (done) {
    let size = 10;
    let x = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedArray = [];
    for (let Ycounter = 0; Ycounter < target.dimensionSize.YMax; Ycounter++) {
        for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
            target.mark(Ycounter, x, counter);
            expectedArray.push(convertToString(Ycounter, x, counter));
        }
    }

    let actualResult = [];
    target.read(undefined, x, undefined, (y, x, z) => {
        actualResult.push(convertToString(y, x, z));
        return true
    })

    expect(actualResult).to.deep.equal(expectedArray);
    done();
});