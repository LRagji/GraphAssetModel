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

    read(model, y, x, z) {
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
        let switchValue = 0;
        if (y !== undefined) switchValue += 4;
        if (x !== undefined) switchValue += 2;
        if (z !== undefined) switchValue += 1;

        let Yaxis = [], Xaxis = [], Zaxis = [];
        let YCounter = 0, XCounter = 0;
        switch (switchValue) {
            case 0: //0|0|0
                return model;

            case 1: //0|0|1
                Yaxis = new Array();
                for (YCounter = 0; YCounter < model.length; YCounter++) {
                    Xaxis = new Array();
                    for (XCounter = 0; XCounter < model[YCounter].length; XCounter++) {
                        Xaxis.push(model[YCounter][XCounter][z]);
                    }
                    Yaxis.push(Xaxis);
                }
                return Yaxis;

            case 2: //0|1|0
                Yaxis = new Array();
                for (YCounter = 0; YCounter < model.length; YCounter++) {
                    Yaxis.push(model[YCounter][x]);
                }
                return Yaxis;

            case 3: //0|1|1
                Yaxis = new Array();
                for (YCounter = 0; YCounter < model.length; YCounter++) {
                    if (model[YCounter][x][z] === this._markValue) {
                        Yaxis.push(YCounter);
                    }
                }
                return Yaxis;

            case 4: //1|0|0
                return model[y];

            case 5: //1|0|1
                Xaxis = new Array();
                for (XCounter = 0; XCounter < model[y].length; XCounter++) {
                    if (model[y][XCounter][z] === this._markValue) {
                        Xaxis.push(XCounter);
                    }
                }
                return Xaxis;

            case 6: //1|1|0
                Zaxis = model[y][x];
                let returnResult = [];
                Zaxis.forEach((element, idx) => {
                    if (element === this._markValue) {
                        returnResult.push(idx);
                    }
                });
                return returnResult;

            case 7: //1|1|1
                return model[y][x][z] === this._markValue;
                
            default:
                throw new Error("Unknown query!");
        }
    }

    mark(fullModel, y, x, z) {
        if (fullModel == undefined || y == undefined || x == undefined || z == undefined) {
            throw new Error("One or more parameters are null/undefined.");
        }
        fullModel[y][x][z] = this._markValue;
    }
}