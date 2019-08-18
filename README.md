# GraphAssetModel
This is a graph representation of asset model.
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
