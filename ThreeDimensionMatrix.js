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
        //0|1|1|Return 1D Array                            |   Yn*3X
        //1|0|1|Return 1D Array                            |   Xn*3X
        //0|1|0|Return 2D Array                            |   Yn*2X


        //1|1|1 Return boolean value is they are connected. |TimeComplexity:3X
        if (y !== undefined & x !== undefined & z !== undefined) {
            return model[y][x][z] === this._markValue;
        }
        //0|0|0 Return 3D Array a.k.a Model |TimeComplexity:0
        if (y == undefined & x == undefined & z == undefined) {
            return model;
        }
        //1|1|0 Return 1D Array |TimeComplexity:2X+N*I
        if (y !== undefined & x !== undefined & z == undefined) {
            let Zaxis = model[y][x];
            let returnResult = [];
            Zaxis.forEach((element, idx) => {
                if (element === this._markValue) {
                    returnResult.push(idx);
                }
            });
            return returnResult;
        }
        //1|0|0 Return 2D Array |TimeComplexity:X
        if (y !== undefined & x == undefined & z == undefined) {
            return model[y];
        }
        //0|0|1 Return 2D Array |TimeComplexity:Yn*Xn*3X
        if (y == undefined & x == undefined & z !== undefined) {
            let Yaxis = new Array();
            for (let YCounter = 0; YCounter < model.length; YCounter++) {
                let Xaxis = new Array();
                for (let XCounter = 0; XCounter < model[YCounter].length; XCounter++) {
                    Xaxis.push(model[YCounter][XCounter][z]);
                }
                Yaxis.push(Xaxis);
            }
            return Yaxis;
        }
        //0|1|1 Return 1D Array |TimeComplexity:Yn*3X
        if (y == undefined & x !== undefined & z !== undefined) {
            let Yaxis = new Array();
            for (let YCounter = 0; YCounter < model.length; YCounter++) {
                if (model[YCounter][x][z] === this._markValue) {
                    Yaxis.push(YCounter);
                }
            }
            return Yaxis;
        }
        //1|0|1 Return 1D Array |TimeComplexity:Xn*3X
        if (y !== undefined & x == undefined & z !== undefined) {
            let Xaxis = new Array();
            for (let XCounter = 0; XCounter < model[y].length; XCounter++) {
                Xaxis.push(model[y][XCounter][z]);
            }
            return Xaxis;
        }
        //0|1|0 Return 2D Array |TimeComplexity:Yn*2X
        if (y == undefined & x !== undefined & z == undefined) {
            let Yaxis = new Array();
            for (let YCounter = 0; YCounter < model.length; YCounter++) {
                Yaxis.push(model[YCounter][x]);
            }
            return Yaxis;
        }
    }

    mark(fullModel, y, x, z) {
        if (fullModel == undefined || y == undefined || x == undefined || z == undefined) {
            throw new Error("One or more parameters are null/undefined.");
        }
        fullModel[y][x][z] = this._markValue;
    }
}