let AssetModel = require('./AssetModel');

let AssetList = ['A', 'B', 'C'];
let RelationList = ['R1', 'R2', 'R3'];

let model = new AssetModel(AssetList, RelationList, (x) => x);
model.markRelation(AssetList[0], RelationList[0], AssetList[1]);
model.markRelation(AssetList[1], RelationList[1], AssetList[2]);

console.log("Consumed " + model.memorySize + " bytes.");

console.log(model.getRelatedWithAsset(AssetList[1], RelationList[0]));