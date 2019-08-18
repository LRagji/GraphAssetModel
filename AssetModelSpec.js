let expect = require('chai').expect;
let targetType = require('./AssetModel');
let AssetList = ['A', 'B', 'C', 'D', 'E', 'F'];
let RelationList = ['R1', 'R2', 'R3'];

it('Asset Model: Validate default selector function works', function (done) {
    let _AssetList = [{ name: 'A', id: 'A' }, { name: 'B', id: 'B' }, { name: 'C', id: 'C' }];
    let _RelationList = [{ name: 'R1', id: 'R1' }, { name: 'R2', id: 'R2' }];
    let model = new targetType(_AssetList, _RelationList);
    model.markRelation(_AssetList[0], _RelationList[0], _AssetList[1]);//A---R1---B
    model.markRelation(_AssetList[1], _RelationList[1], _AssetList[2]);//B---R2---C

    expect(model.getRelationsBetween(_AssetList[0], _AssetList[1])).to.deep.equal([_RelationList[0]]);
    expect(model.getRelationsBetween(_AssetList[1], _AssetList[2])).to.deep.equal([_RelationList[1]]);

    expect(model.getRelatedChildren(_AssetList[1], _RelationList[1])).to.deep.equal([_AssetList[2]]);

    expect(model.getRelatedParents(_AssetList[1], _RelationList[0])).to.deep.equal([_AssetList[0]]);
    done();
});

it('Asset Model: Validate assets can be linked and queried back', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C

    expect(model.getRelationsBetween(AssetList[0], AssetList[1])).to.deep.equal([RelationList[0]]);
    expect(model.getRelationsBetween(AssetList[1], AssetList[2])).to.deep.equal([RelationList[1]]);
    done();
});

it('Asset Model: Validate multiple relations can be queried back', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[0], RelationList[1], AssetList[1]);//A---R2---B

    let relations = model.getRelationsBetween(AssetList[0], AssetList[1]);
    expect(relations.length).to.equal(2);
    expect(relations).to.have.members([RelationList[1], RelationList[0]]);
    done();
});

it('Asset Model: Validate no relations can be queried when no relation exists', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[0], RelationList[1], AssetList[1]);//A---R2---B

    let relations = model.getRelationsBetween(AssetList[2], AssetList[0]);
    expect(relations.length).to.equal(0);
    done();
});

it('Asset Model: Validate self relations can be queried ', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[0]);//A---R1---A

    let relations = model.getRelationsBetween(AssetList[0], AssetList[0]);
    expect(relations.length).to.equal(1);
    expect(relations).to.have.members([RelationList[0]]);
    done();
});

it('Asset Model: Validate relations are directional', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B

    let relations = model.getRelationsBetween(AssetList[0], AssetList[1]);
    expect(relations.length).to.equal(1);
    expect(relations).to.have.members([RelationList[0]]);

    relations = model.getRelationsBetween(AssetList[1], AssetList[0]);
    expect(relations.length).to.equal(0);
    done();
});

it('Asset Model: Validate childrens can be queried back when multiple children exists', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C
    model.markRelation(AssetList[0], RelationList[0], AssetList[2]);//A---R1---C

    let assets = model.getRelatedChildren(AssetList[0], RelationList[0]);
    expect(assets.length).to.equal(2);
    expect(assets).to.have.members([AssetList[1], AssetList[2]]);
    done();
});

it('Asset Model: Validate childrens can be queried back when single child exists', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C
    model.markRelation(AssetList[0], RelationList[0], AssetList[2]);//A---R1---C

    let assets = model.getRelatedChildren(AssetList[1], RelationList[1]);
    expect(assets.length).to.equal(1);
    expect(assets).to.have.members([AssetList[2]]);
    done();
});

it('Asset Model: Validate childrens can be queried back when children exists with different relation', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C
    model.markRelation(AssetList[0], RelationList[1], AssetList[2]);//A---R2---C

    let assets = model.getRelatedChildren(AssetList[0], RelationList[0]);
    expect(assets.length).to.equal(1);
    expect(assets).to.have.members([AssetList[1]]);

    assets = model.getRelatedChildren(AssetList[0], RelationList[1]);
    expect(assets.length).to.equal(1);
    expect(assets).to.have.members([AssetList[2]]);
    done();
});

it('Asset Model: Validate childrens can be queried back when no child exists', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C
    model.markRelation(AssetList[0], RelationList[0], AssetList[2]);//A---R1---C

    let assets = model.getRelatedChildren(AssetList[2], RelationList[0]);
    expect(assets.length).to.equal(0);
    done();
});

it('Asset Model: Validate parents can be queried back when multiple parents exists', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[0], AssetList[2]);//B---R1---C
    model.markRelation(AssetList[0], RelationList[0], AssetList[2]);//A---R1---C

    let assets = model.getRelatedParents(AssetList[2], RelationList[0]);
    expect(assets.length).to.equal(2);
    expect(assets).to.have.members([AssetList[1], AssetList[0]]);
    done();
});

it('Asset Model: Validate parents can be queried back when single parent exists', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C
    model.markRelation(AssetList[0], RelationList[0], AssetList[2]);//A---R1---C

    let assets = model.getRelatedParents(AssetList[1], RelationList[0]);
    expect(assets.length).to.equal(1);
    expect(assets).to.have.members([AssetList[0]]);
    done();
});

it('Asset Model: Validate parents can be queried back when parents exists with different relation', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[0], RelationList[1], AssetList[1]);//A---R2---B

    let assets = model.getRelatedParents(AssetList[1], RelationList[0]);
    expect(assets.length).to.equal(1);
    expect(assets).to.have.members([AssetList[0]]);
    done();
});

it('Asset Model: Validate no parent can be queried back when no parent exists', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C
    model.markRelation(AssetList[0], RelationList[0], AssetList[2]);//A---R1---C

    let assets = model.getRelatedParents(AssetList[0], RelationList[0]);
    expect(assets.length).to.equal(0);
    done();
});

it('Asset Model: Validate children with correct relations are returned when multiple children exists with same relation', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C
    model.markRelation(AssetList[0], RelationList[0], AssetList[2]);//A---R1---C

    let childrenWithRelations = model.getAllChildrenWithRelation(AssetList[0]);
    expect(childrenWithRelations.size).to.equal(1);
    expect(childrenWithRelations.get(RelationList[0])).to.deep.equal([AssetList[1], AssetList[2]]);

    done();
});

it('Asset Model: Validate children with correct relations are returned when self referenced', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[0]);//A---R1---A
    model.markRelation(AssetList[0], RelationList[1], AssetList[0]);//A---R2---A

    let childrenWithRelations = model.getAllChildrenWithRelation(AssetList[0]);
    expect(childrenWithRelations.size).to.equal(2);
    expect(childrenWithRelations.get(RelationList[0])).to.deep.equal([AssetList[0]]);
    expect(childrenWithRelations.get(RelationList[1])).to.deep.equal([AssetList[0]]);
    done();
});

it('Asset Model: Validate children with correct relations are returned when multiple children with different relations', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[1], RelationList[1], AssetList[2]);//B---R2---C
    model.markRelation(AssetList[0], RelationList[1], AssetList[2]);//A---R2---C

    let childrenWithRelations = model.getAllChildrenWithRelation(AssetList[0]);
    expect(childrenWithRelations.size).to.equal(2);
    expect(childrenWithRelations.get(RelationList[0])).to.deep.equal([AssetList[1]]);
    expect(childrenWithRelations.get(RelationList[1])).to.deep.equal([AssetList[2]]);
    done();
});

it('Asset Model: Validate parents with correct relations are returned when multiple parent exists with same relation exits', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[1]);//A---R1---B
    model.markRelation(AssetList[2], RelationList[0], AssetList[1]);//C---R1---B

    let parentsWithRelations = model.getAllParentsWithRelation(AssetList[1]);
    expect(parentsWithRelations.size).to.equal(1);
    expect(parentsWithRelations.get(RelationList[0])).to.deep.equal([AssetList[0], AssetList[2]]);

    done();
});

it('Asset Model: Validate parent with correct relations are returned when self referenced', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[0], AssetList[0]);//A---R1---A
    model.markRelation(AssetList[0], RelationList[1], AssetList[0]);//A---R2---A

    let parentsWithRelations = model.getAllParentsWithRelation(AssetList[0]);
    expect(parentsWithRelations.size).to.equal(2);
    expect(parentsWithRelations.get(RelationList[0])).to.deep.equal([AssetList[0]]);
    expect(parentsWithRelations.get(RelationList[1])).to.deep.equal([AssetList[0]]);
    done();
});

it('Asset Model: Validate parent with correct relations are returned when multiple parent with different relations exists', function (done) {
    let model = new targetType(AssetList, RelationList, (x) => x);
    model.markRelation(AssetList[0], RelationList[1], AssetList[1]);//A---R2---B
    model.markRelation(AssetList[2], RelationList[0], AssetList[1]);//C---R1---B

    let parentsWithRelations = model.getAllParentsWithRelation(AssetList[1]);
    expect(parentsWithRelations.size).to.equal(2);
    expect(parentsWithRelations.get(RelationList[0])).to.deep.equal([AssetList[2]]);
    expect(parentsWithRelations.get(RelationList[1])).to.deep.equal([AssetList[0]]);
    done();
});