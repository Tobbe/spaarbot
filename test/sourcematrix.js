eval(require('fs').readFileSync('sourcematrix.js', 'utf8'));

describe('SourceMatrix', function () {
    it('can store one VisualCmd', function () {
        var sourceMatrix = Object.create(SourceMatrix).init(10);
        sourceMatrix.addCommand(Object.create(VisualCmdRight));
        expect(sourceMatrix.toArray().length).toEqual(1);
        expect(VisualCmdRight.isPrototypeOf(sourceMatrix.toArray()[0])).toEqual(true);
    });

    it('can store several VisualCmds', function () {
        var sourceMatrix = Object.create(SourceMatrix).init(10);
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdRight));
        expect(sourceMatrix.toArray().length).toEqual(6);
        expect(VisualCmdLeft.isPrototypeOf(sourceMatrix.toArray()[0])).toEqual(true);
        expect(VisualCmdRight.isPrototypeOf(sourceMatrix.toArray()[5])).toEqual(true);
    });

    it('can store several VisualCmds, spanning several rows', function () {
        var sourceMatrix = Object.create(SourceMatrix).init(2);
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdRight));
        sourceMatrix.addCommand(Object.create(VisualCmdLeft));
        sourceMatrix.addCommand(Object.create(VisualCmdRight));
        expect(sourceMatrix.toArray().length).toEqual(7);
        expect(VisualCmdLeft.isPrototypeOf(sourceMatrix.toArray()[0])).toEqual(true);
        expect(VisualCmdRight.isPrototypeOf(sourceMatrix.toArray()[4])).toEqual(true);
        expect(VisualCmdLeft.isPrototypeOf(sourceMatrix.toArray()[5])).toEqual(true);
        expect(VisualCmdRight.isPrototypeOf(sourceMatrix.toArray()[6])).toEqual(true);
    });
});

