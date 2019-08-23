module.exports = class ThreeDimensionMatrix {
    constructor(YMax, XMax, ZMax, defaultValue = '0', markValue = '1') {
        this._constructReadOptimizedMatrix = this._constructReadOptimizedMatrix.bind(this);
        this.dimensionSize = {
            "YMax": YMax,
            "XMax": XMax,
            "ZMax": ZMax
        };

        this.matrix = this._constructReadOptimizedMatrix(this.dimensionSize.YMax, this.dimensionSize.XMax, this.dimensionSize.ZMax, this._defaultValue);

        this.read = this.read.bind(this);
        this.mark = this.mark.bind(this);
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

    read(y, x, z, iteratorCallback) {

        let model = this.matrix.model;

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

    mark(y, x, z) {
        if (y == undefined || x == undefined || z == undefined) {
            throw new Error("One or more parameters are null/undefined.");
        }
        let fullModel = this.matrix.model;
        fullModel[y][x][z] = this._markValue;
    }
}