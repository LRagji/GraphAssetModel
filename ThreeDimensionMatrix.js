module.exports = class ThreeDimensionMatrix {
    constructor(YMax, XMax, ZMax, defaultValue = '0', markValue = '1') {
        this._constructReadOptimizedMatrix = this._constructReadOptimizedMatrix.bind(this);
        this.dimensionSize = {
            "YMax": YMax,
            "XMax": XMax,
            "ZMax": ZMax
        };

        this.matrix = this._constructReadOptimizedMatrix(this.dimensionSize.YMax, this.dimensionSize.XMax, this.dimensionSize.ZMax, this._defaultValue);

        this.read = this.read.bind(this, this.matrix.model);
        this.mark = this.mark.bind(this, this.matrix.model);
        this._generateLoop = this._generateLoop.bind(this);
        this._defaultValue = defaultValue;
        this._markValue = markValue;
    }

    _constructReadOptimizedMatrix(YaxisMax, XaxisMax, ZaxisMax, defaultValue = '0') {
        let memSize = 0;
        let Yaxis = new Array();
        for (let YCounter = 0; YCounter < YaxisMax; YCounter++) {
            let Xaxis = new Array();
            for (let XCounter = 0; XCounter < XaxisMax; XCounter++) {
                let Zaxis = new Array();
                for (let ZCounter = 0; ZCounter < ZaxisMax; ZCounter++) {
                    Zaxis.push(defaultValue);
                    memSize += 2;
                }
                Xaxis.push(Zaxis);
            }
            Yaxis.push(Xaxis);
        }
        return {
            model: Yaxis,
            memorySize: memSize
        }
    }

    read(model, y, x, z, iteratorCallback) {
        //TODO:Find Time complexities for all read Operations
        //Given:
        // X: Time taken to access array element with index.Eg: arr[idx]
        // I: Time taken to Jump if else condition.
        // Yn: Number of items on Y axis
        // Xn: Number of items on X axis
        // Zn: Number of items on Z axis
        // Depending on the inputs given time complexity for the function is calculated below:
        //Y|X|Z|                Return Value               |  Time Complexity
        //1|1|1|Return boolean value is they are connected.|   3X
        //0|0|0|Return 3D Array a.k.a Model                |   0
        //1|1|0|Return 1D Array                            |   2X+N*I
        //1|0|0|Return 2D Array                            |   X
        //0|0|1|Return 2D Array                            |   Yn*Xn*3X
        //0|1|1|Return 1D Array                            |   Yn*3X+1I
        //1|0|1|Return 1D Array                            |   Xn*3X+1I
        //0|1|0|Return 2D Array                            |   Yn*2X

        if (model == undefined) {
            throw new Error("Model cannot be undefined");
        }

        //TODO: Check for Negative number for x,y,z axes and should be less than Xmax, Ymax and Zmax

        this._generateLoop(y, model.length, (YIdx) => {
            return this._generateLoop(x, model[YIdx].length, (XIdx) => {
                return this._generateLoop(z, model[YIdx][XIdx].length, (ZIdx) => {
                    if (model[YIdx][XIdx][ZIdx] == this._markValue) {
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

    mark(fullModel, y, x, z) {
        if (fullModel == undefined || y == undefined || x == undefined || z == undefined) {
            throw new Error("One or more parameters are null/undefined.");
        }
        fullModel[y][x][z] = this._markValue;
    }
}