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

describe('VisualCmd', function () {
    describe('subclass VisualCmdLeft', function () {
        it('can print the correct source representation', function () {
            expect(Object.create(VisualCmdLeft).toSourceString())
                .toEqual('robot.moveLeft();\n');
        });
    });

    describe('subclass VisualCmdRight', function () {
        it('can print the correct source representation', function () {
            expect(Object.create(VisualCmdRight).toSourceString())
                .toEqual('robot.moveRight();\n');
        });
    });


    describe('subclass VisualCmdLoop', function () {
        it('can print the correct source representation with no children', function () {
            expect(Object.create(VisualCmdLoop.init()).toSourceString())
                .toEqual('loop {\n}\n');
        });

        it('can print the correct source representation with several children', function () {
            var visualCmdLoop = Object.create(VisualCmdLoop).init();
            visualCmdLoop.addChild(Object.create(VisualCmdLeft));
            visualCmdLoop.addChild(Object.create(VisualCmdRight));
            visualCmdLoop.addChild(Object.create(VisualCmdLeft));
            var expectedSource =
                'loop {\n' +
                '    robot.moveLeft();\n' +
                '    robot.moveRight();\n' +
                '    robot.moveLeft();\n' +
                '}\n';
            expect(visualCmdLoop.toSourceString()).toEqual(expectedSource);
        });

        it('can print the correct source representation with nested loops', function () {
            var visualCmdLoopInner = Object.create(VisualCmdLoop).init();
            visualCmdLoopInner.addChild(Object.create(VisualCmdLeft));

            var visualCmdLoop = Object.create(VisualCmdLoop).init();
            visualCmdLoop.addChild(Object.create(VisualCmdLeft));
            visualCmdLoop.addChild(visualCmdLoopInner);
            visualCmdLoop.addChild(Object.create(VisualCmdLeft));

            var expectedSource =
                'loop {\n' +
                '    robot.moveLeft();\n' +
                '    loop {\n' +
                '        robot.moveLeft();\n' +
                '    }\n' +
                '    robot.moveLeft();\n' +
                '}\n';
            expect(visualCmdLoop.toSourceString()).toEqual(expectedSource);
        });
    });
});

