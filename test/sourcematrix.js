eval(require('fs').readFileSync('sourcematrix.js', 'utf8'));

describe('SourceMatrix', function () {
    it('can store one VisualCmd', function () {
        var sourceMatrix = new SourceMatrix(10);
        sourceMatrix.addCommand(new VisualCmdLeft());
        expect(sourceMatrix.toArray().length).toEqual(1);
        expect(sourceMatrix.toArray()[0]).toEqual(jasmine.any(VisualCmdLeft));
    });

    it('can store several VisualCmds', function () {
        var sourceMatrix = new SourceMatrix(10);
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdRight());
        expect(sourceMatrix.toArray().length).toEqual(6);
        expect(sourceMatrix.toArray()[0]).toEqual(jasmine.any(VisualCmdLeft));
        expect(sourceMatrix.toArray()[5]).toEqual(jasmine.any(VisualCmdRight));
    });

    it('can store several VisualCmds, spanning several rows', function () {
        var sourceMatrix = new SourceMatrix(2);
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdRight());
        sourceMatrix.addCommand(new VisualCmdLeft());
        sourceMatrix.addCommand(new VisualCmdRight());
        expect(sourceMatrix.toArray().length).toEqual(7);
        expect(sourceMatrix.toArray()[0]).toEqual(jasmine.any(VisualCmdLeft));
        expect(sourceMatrix.toArray()[4]).toEqual(jasmine.any(VisualCmdRight));
        expect(sourceMatrix.toArray()[5]).toEqual(jasmine.any(VisualCmdLeft));
        expect(sourceMatrix.toArray()[6]).toEqual(jasmine.any(VisualCmdRight));
    });
});

