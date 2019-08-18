let ThreeDimensionMatrix = require('./ThreeDimensionMatrix');

module.exports = class AssetModel {
    constructor(assetList, relationList, identifier = (obj) => obj.id) {
        this.markRelation = this.markRelation.bind(this);
        this.getRelationsBetween = this.getRelationsBetween.bind(this);
        this.getRelatedParents = this.getRelatedParents.bind(this);
        this.getRelatedChildren = this.getRelatedChildren.bind(this);
        this.getAllChildrenWithRelation = this.getAllChildrenWithRelation.bind(this);
        this.getAllParentsWithRelation = this.getAllParentsWithRelation.bind(this);
        this.getAllParentAndChildren = this.getAllParentAndChildren.bind(this);

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
        let results = [];
        this._model.read(fromIdx, toIdx, undefined, (y, x, z) => {
            results.push(this._relationList[z]);
            return true;
        });

        return results
    }

    getRelatedChildren(fromAsset, withRelation) {
        let fromIdx = this._findIndexOf(this._assetList, fromAsset, this._identifierFunction);
        let relationIdx = this._findIndexOf(this._relationList, withRelation, this._identifierFunction);
        let results = [];
        this._model.read(fromIdx, undefined, relationIdx, (y, x, z) => {
            results.push(this._assetList[x]);
            return true;
        });

        return results;
    }

    getRelatedParents(toAsset, withRelation) {
        let toIdx = this._findIndexOf(this._assetList, toAsset, this._identifierFunction);
        let relationIdx = this._findIndexOf(this._relationList, withRelation, this._identifierFunction);
        let results = [];
        this._model.read(undefined, toIdx, relationIdx, (y, x, z) => {
            results.push(this._assetList[y]);
            return true;
        });

        return results;
    }

    getAllChildrenWithRelation(fromAsset) {
        let fromIdx = this._findIndexOf(this._assetList, fromAsset, this._identifierFunction);
        let results = new Map();
        this._model.read(fromIdx, undefined, undefined, (y, x, z) => {
            let relationObject = this._relationList[z];
            let child = this._assetList[x];
            let childrens = results.has(relationObject) ? results.get(relationObject) : [];
            childrens.push(child);
            results.set(relationObject, childrens);
            return true;
        })
        return results;
    }

    getAllParentsWithRelation(toAsset) {

    }

    getAllParentAndChildren(withRelation) {

    }

}