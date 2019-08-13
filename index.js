let ThreeDimensionMatrix = require('./ThreeDimensionMatrix');

class AssetModel {
    constructor(assetList, relationList, identifier = (obj) => obj.id) {
        this.markRelation = this.markRelation.bind(this);
        this.getRelationsBetween = this.getRelationsBetween.bind(this);
        this.getRelatedWithAsset = this.getRelatedWithAsset.bind(this);
        this.getRelatedAsset = this.getRelatedAsset.bind(this);

        this._findIndexOf = this._findIndexOf.bind(this);
        this._filterMap = this._filterMap.bind(this);
        this._model = new ThreeDimensionMatrix(assetList.length, assetList.length, relationList.length);
        this.memorySize = this._model.matrix.memorySize;
        this._assetList = assetList;
        this._relationList = relationList;
        this._identifierFunction = identifier;
        this._marked = '1', this._unMarked = '0';
    }

    _findIndexOf(list, searchItem, selector) {
        let searchingFor = selector(searchItem);
        for (let ctr = 0; ctr < list.length; ctr++) {
            if (selector(list[ctr]) === searchingFor) {
                return ctr;
            }
        }

    }

    _filterMap(inputList, mapList) {
        let returnRelations = [];
        for (let ctr = 0; ctr < inputList.length; ctr++) {
            if (inputList[ctr] === this._marked) {
                returnRelations.push(mapList[ctr]);
            }
        }
        return returnRelations;
    }

    markRelation(fromAsset, withRelation, toAsset) {
        let fromIdx = this._findIndexOf(this._assetList, fromAsset, this._identifierFunction);
        let toIdx = this._findIndexOf(this._assetList, toAsset, this._identifierFunction);
        let relationIdx = this._findIndexOf(this._relationList, withRelation, this._identifierFunction);
        return this._model.mark(fromIdx, toIdx, relationIdx);
    }

    getRelationsBetween(fromAsset, toAsset) {
        let fromIdx = this._findIndexOf(this._assetList, fromAsset, this._identifierFunction);
        let toIdx = this._findIndexOf(this._assetList, toAsset, this._identifierFunction);
        let relations = this._model.read(fromIdx, toIdx, undefined);

        return this._filterMap(relations, this._relationList);
    }

    getRelatedAsset(fromAsset, withRelation) {
        let fromIdx = this._findIndexOf(this._assetList, fromAsset, this._identifierFunction);
        let relationIdx = this._findIndexOf(this._relationList, withRelation, this._identifierFunction);
        let toIds = this._model.read(fromIdx, undefined, relationIdx);

        return this._filterMap(toIds, this._assetList);
    }

    getRelatedWithAsset(toAsset, withRelation) {
        let toIdx = this._findIndexOf(this._assetList, toAsset, this._identifierFunction);
        let relationIdx = this._findIndexOf(this._relationList, withRelation, this._identifierFunction);
        let fromIds = this._model.read(undefined, toIdx, relationIdx);

        return this._filterMap(fromIds, this._assetList);
    }
}

let AssetList = ['A', 'B', 'C'];
let RelationList = ['R1', 'R2', 'R3'];

let model = new AssetModel(AssetList, RelationList, (x) => x);
model.markRelation(AssetList[0], RelationList[0], AssetList[1]);
model.markRelation(AssetList[1], RelationList[1], AssetList[2]);

console.log("Consumed " + model.memorySize + " bytes.");

console.log(model.getRelatedWithAsset(AssetList[1],RelationList[0]));