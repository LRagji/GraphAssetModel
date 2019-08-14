let expect = require('chai').expect;
let targetType = require('./AssetModel');
let AssetList = ['A', 'B', 'C', 'D', 'E', 'F'];
let RelationList = ['R1', 'R2', 'R3'];

it('Asset Model: Validate assets can be linked and queried back', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C

    expect(model.getRelationsBetween(AssetList[0], AssetList[1])).to.deep.equal([RelationList[0]]);
    expect(model.getRelationsBetween(AssetList[1], AssetList[2])).to.deep.equal([RelationList[1]]);
    done();
});

it('Asset Model: Validate multiple relations can be created and queried back', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[0], RelationList[1], AssetList[1]);//A---R2---B

    let relations = model.getRelationsBetween(AssetList[0], AssetList[1]);
    expect(relations.length).to.equal(2);
    expect(relations).to.have.members([RelationList[1], RelationList[0]]);
    done();
});

it('Asset Model: Validate childrens can be queried back', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C
    model.markRelation(AssetList[0], RelationList[0], AssetList[2]);//A---R1---C

    let assets = model.getRelatedAsset(AssetList[0], RelationList[0]);
    expect(assets.length).to.equal(2);
    expect(assets).to.have.members([AssetList[1], AssetList[2]]);
    done();
});