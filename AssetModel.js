let ThreeDimensionMatrix = require('./ThreeDimensionMatrix');

module.exports = class AssetModel {
    constructor(assetList, relationList, identifier = (obj) => obj.id) {
        this.markRelation = this.markRelation.bind(this);
        this.getRelationsBetween = this.getRelationsBetween.bind(this);
        this.getRelatedParents = this.getRelatedParents.bind(this);
        this.getRelatedChildren = this.getRelatedChildren.bind(this);

        this._findIndexOf = this._findIndexOf.bind(this);
        this._model = new ThreeDimensionMatrix(assetList.length, assetList.length, relationList.length);
        this.memorySize = this._model.matrix.memorySize;
        this._assetList = assetList;
        this._relationList = relationList;
        this._identifierFunction = identifier;
    }

    _findIndexOf(list, searchItem, selector) {
        let searchingFor = selector(searchItem);
        for (let ctr = 0; ctr < list.length; ctr++) {
            if (selector(list[ctr]) === searchingFor) {
                return ctr;
            }
        }

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
        let relationsIndexs = this._model.read(fromIdx, toIdx, undefined);

        return relationsIndexs.map(idx => this._relationList[idx]);
    }

    getRelatedChildren(fromAsset, withRelation) {
        let fromIdx = this._findIndexOf(this._assetList, fromAsset, this._identifierFunction);
        let relationIdx = this._findIndexOf(this._relationList, withRelation, this._identifierFunction);
        let toIndexs = this._model.read(fromIdx, undefined, relationIdx);

        return toIndexs.map(idx => this._assetList[idx]);
    }

    getRelatedParents(toAsset, withRelation) {
        let toIdx = this._findIndexOf(this._assetList, toAsset, this._identifierFunction);
        let relationIdx = this._findIndexOf(this._relationList, withRelation, this._identifierFunction);
        let fromIndexs = this._model.read(undefined, toIdx, relationIdx);

        return fromIndexs.map(idx => this._assetList[idx]);
    }
}