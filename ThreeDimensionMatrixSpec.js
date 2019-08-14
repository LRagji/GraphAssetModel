let expect = require('chai').expect;
let targetType = require('./ThreeDimensionMatrix');

it('Three Dimension Matrix:Calculate correct memory size & axis length', function (done) {
    let size = 10;
    let charByteSize = 2;
    let target = new targetType(size, size, size);
    expect(target.matrix.memorySize).to.equal(size * size * size * charByteSize);
    expect(target.dimensionSize.XMax).to.equal(size);
    expect(target.dimensionSize.YMax).to.equal(size);
    expect(target.dimensionSize.ZMax).to.equal(size);
    let targetMatrix = target.read(undefined, undefined, undefined);
    expect(targetMatrix.length).to.equal(target.dimensionSize.YMax);
    expect(targetMatrix[0].length).to.equal(target.dimensionSize.XMax);
    expect(targetMatrix[0][0].length).to.equal(target.dimensionSize.ZMax);
    done();
});

it('Three Dimension Matrix:Mark and Get same index on 3rd Axis', function (done) {
    let size = 10;
    let x = 0, y = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
        target.mark(y, x, counter);
    }
    for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
        expect(target.read(y, x, counter)).to.equal(markchar);
    }
    done();
});

it('Three Dimension Matrix:Mark and Get same index on 2nd Axis', function (done) {
    let size = 10;
    let z = 0, y = 0, defaultChar = '0', markchar = 'D';;
    let target = new targetType(size, size, size, defaultChar, markchar);
    for (let counter = 0; counter < target.dimensionSize.XMax; counter++) {
        target.mark(y, counter, z);
    }
    for (let counter = 0; counter < target.dimensionSize.XMax; counter++) {
        expect(target.read(y, counter, z)).to.equal(markchar);
    }
    done();
});

it('Three Dimension Matrix:Mark and Get same index on 1st Axis', function (done) {
    let size = 10;
    let z = 0, x = 0, defaultChar = '0', markchar = 'D';;
    let target = new targetType(size, size, size, defaultChar, markchar);
    for (let counter = 0; counter < target.dimensionSize.YMax; counter++) {
        target.mark(counter, x, z);
    }
    for (let counter = 0; counter < target.dimensionSize.YMax; counter++) {
        expect(target.read(counter, x, z)).to.equal(markchar);
    }
    done();
});

it('Three Dimension Matrix:Mark and Get 1Dimension Array on 1st Axis', function (done) {
    let size = 10;
    let z = 0, x = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedArray = [];
    for (let counter = 0; counter < target.dimensionSize.YMax; counter++) {
        target.mark(counter, x, z, markchar);
        expectedArray.push(markchar);
    }

    expect(target.read(undefined, x, z)).to.deep.equal(expectedArray);

    done();
});

it('Three Dimension Matrix:Mark and Get 1Dimension Array on 2nd Axis', function (done) {
    let size = 10;
    let z = 0, y = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedArray = [];
    for (let counter = 0; counter < target.dimensionSize.XMax; counter++) {
        target.mark(y, counter, z, markchar);
        expectedArray.push(markchar);
    }

    expect(target.read(y, undefined, z)).to.deep.equal(expectedArray);

    done();
});

it('Three Dimension Matrix:Mark and Get 1Dimension Array on 3rd Axis', function (done) {
    let size = 10;
    let x = 0, y = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expectedArray = [];
    for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
        target.mark(y, x, counter);
        expectedArray.push(markchar);
    }

    expect(target.read(y, x, undefined)).to.deep.equal(expectedArray);
    done();
});

it('Three Dimension Matrix:Mark and Get 2Dimension on 2nd & 3rd Axis', function (done) {
    let size = 10;
    let y = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expected2DArray = [];
    for (let Xcounter = 0; Xcounter < target.dimensionSize.XMax; Xcounter++) {
        let temp = [];
        for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
            target.mark(y, Xcounter, counter);
            temp.push(markchar);
        }
        expected2DArray.push(temp);
    }

    for (let Xcounter = 0; Xcounter < target.dimensionSize.XMax; Xcounter++) {
        expect(target.read(y, Xcounter, undefined)).to.deep.equal(expected2DArray[Xcounter]);
    }
    done();
});

it('Three Dimension Matrix:Mark and Get 2Dimension on 1st & 2nd Axis', function (done) {
    let size = 10;
    let z = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expected2DArray = [];
    for (let Ycounter = 0; Ycounter < target.dimensionSize.YMax; Ycounter++) {
        let temp = [];
        for (let counter = 0; counter < target.dimensionSize.XMax; counter++) {
            target.mark(Ycounter, counter, z);
            temp.push(markchar);
        }
        expected2DArray.push(temp);
    }

    for (let Ycounter = 0; Ycounter < target.dimensionSize.YMax; Ycounter++) {
        expect(target.read(Ycounter, undefined, z)).to.deep.equal(expected2DArray[Ycounter]);
    }
    done();
});

it('Three Dimension Matrix:Mark and Get 2Dimension on 1st & 3rd Axis', function (done) {
    let size = 10;
    let x = 0, defaultChar = '0', markchar = 'D';
    let target = new targetType(size, size, size, defaultChar, markchar);
    let expected2DArray = [];
    for (let Ycounter = 0; Ycounter < target.dimensionSize.YMax; Ycounter++) {
        let temp = [];
        for (let counter = 0; counter < target.dimensionSize.ZMax; counter++) {
            target.mark(Ycounter, x, counter);
            temp.push(markchar);
        }
        expected2DArray.push(temp);
    }

    for (let Zcounter = 0; Zcounter < target.dimensionSize.ZMax; Zcounter++) {
        expect(target.read(undefined, x, Zcounter)).to.deep.equal(expected2DArray[Zcounter]);
    }
    done();
});