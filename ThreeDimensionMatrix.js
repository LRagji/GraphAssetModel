module.exports = class ThreeDimensionMatrix {
    constructor(YMax, XMax, ZMax) {
        this._constructReadOptimizedMatrix = this._constructReadOptimizedMatrix.bind(this);
        this.dimensionSize = {
            "YMax": YMax,
            "XMax": XMax,
            "ZMax": ZMax
        };

        this.matrix = this._constructReadOptimizedMatrix(this.dimensionSize.YMax, this.dimensionSize.XMax, this.dimensionSize.ZMax);

        this.read = this.read.bind(this, this.matrix.model);
        this.mark = this.mark.bind(this, this.matrix.model);
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

    read(model, y, x, z) { //TODO:Find Time complexities for all read Operations
        //1|1|1 Return Single value
        if (y !== undefined & x !== undefined & z !== undefined) {
            return model[y][x][z];
        }
        //0|0|0 Return 3D Array a.k.a Model
        if (y == undefined & x == undefined & z == undefined) {
            return model;
        }
        //1|1|0 Return 1D Array
        if (y !== undefined & x !== undefined & z == undefined) {
            return model[y][x];
        }
        //1|0|0 Return 2D Array
        if (y !== undefined & x == undefined & z == undefined) {
            return model[y];
        }
        //0|0|1 Return 2D Array
        if (y == undefined & x == undefined & z !== undefined) {
            let Yaxis = new Array();
            for (let YCounter = 0; YCounter < model.length; YCounter++) {
                let Xaxis = new Array();
                for (let XCounter = 0; XCounter < model[YCounter].length; XCounter++) {
                    //let Zaxis = new Array();
                    // for (let ZCounter = z; ZCounter < z; ZCounter++) {
                    //     Zaxis.push(defaultValue);
                    //     memSize += 2;
                    // }
                    Xaxis.push(model[YCounter][XCounter][z]);
                }
                Yaxis.push(Xaxis);
            }

            return Yaxis;
        }
        //0|1|1 Return 1D Array
        if (y == undefined & x !== undefined & z !== undefined) {
            let Yaxis = new Array();
            for (let YCounter = 0; YCounter < model.length; YCounter++) {
                Yaxis.push(model[YCounter][x][z]);
            }
            return Yaxis;
        }
        //1|0|1 Return 1D Array
        if (y !== undefined & x == undefined & z !== undefined) {
            let Xaxis = new Array();
            for (let XCounter = 0; XCounter < model[y].length; XCounter++) {
                Xaxis.push(model[y][XCounter][z]);
            }
            return Xaxis;
        }
        //0|1|0 Return 2D Array
        if (y == undefined & x !== undefined & z == undefined) {
            let Yaxis = new Array();
            for (let YCounter = 0; YCounter < model.length; YCounter++) {
                Yaxis.push(model[YCounter][x]);
            }
            return Yaxis;
        }
    }

    mark(fullModel, y, x, z, markValue = '1') {
        if (fullModel == undefined || y == undefined || x == undefined || z == undefined) {
            throw new Error("One or more parameters are null/undefined.");
        }
        fullModel[y][x][z] = markValue;
    }
}