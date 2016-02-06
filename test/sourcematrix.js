eval(require('fs').readFileSync('sourcearray.js', 'utf8'));

describe('SourceArray', function () {
    it('can store one VisualCmd', function () {
        var sourceArray = Object.create(SourceArray).init();
        sourceArray.addCommand(Object.create(VisualCmdRight));
        expect(sourceArray.toArray().length).toEqual(1);
        expect(VisualCmdRight.isPrototypeOf(sourceArray.toArray()[0])).toEqual(true);
    });

    it('can store several VisualCmds', function () {
        var sourceArray = Object.create(SourceArray).init();
        sourceArray.addCommand(Object.create(VisualCmdLeft));
        sourceArray.addCommand(Object.create(VisualCmdLeft));
        sourceArray.addCommand(Object.create(VisualCmdLeft));
        sourceArray.addCommand(Object.create(VisualCmdLeft));
        sourceArray.addCommand(Object.create(VisualCmdLeft));
        sourceArray.addCommand(Object.create(VisualCmdRight));
        expect(sourceArray.toArray().length).toEqual(6);
        expect(VisualCmdLeft.isPrototypeOf(sourceArray.toArray()[0])).toEqual(true);
        expect(VisualCmdRight.isPrototypeOf(sourceArray.toArray()[5])).toEqual(true);
    });

    it('can store loops', function () {
        var visualCmdLoop = Object.create(VisualCmdLoop).init();
        visualCmdLoop.addChild(Object.create(VisualCmdLeft));
        visualCmdLoop.addChild(Object.create(VisualCmdRight));
        visualCmdLoop.addChild(Object.create(VisualCmdLeft));

        var sourceArray = Object.create(SourceArray).init();
        sourceArray.addCommand(Object.create(VisualCmdLeft));
        sourceArray.addCommand(Object.create(visualCmdLoop));
        sourceArray.addCommand(Object.create(VisualCmdLeft));

        var sourceArrayArray = sourceArray.toArray();
        expect(sourceArrayArray.length).toEqual(7);
        expect(VisualCmdLeft.isPrototypeOf(sourceArrayArray[0])).toEqual(true);
        expect(VisualCmdLoop.isPrototypeOf(sourceArrayArray[1])).toEqual(true);
        expect(VisualCmdRight.isPrototypeOf(sourceArrayArray[3])).toEqual(true);
        expect(VisualCmdBodyEnd.isPrototypeOf(sourceArrayArray[5])).toEqual(true);
        expect(VisualCmdLeft.isPrototypeOf(sourceArrayArray[6])).toEqual(true);
    });

    it('can store nested loops', function () {
        var visualCmdLoopInner = Object.create(VisualCmdLoop).init();
        visualCmdLoopInner.addChild(Object.create(VisualCmdRight));

        var visualCmdLoop = Object.create(VisualCmdLoop).init();
        visualCmdLoop.addChild(Object.create(VisualCmdLeft));
        visualCmdLoop.addChild(visualCmdLoopInner);

        var sourceArray = Object.create(SourceArray).init();
        sourceArray.addCommand(Object.create(visualCmdLoop));
        sourceArray.addCommand(Object.create(VisualCmdLeft));

        var sourceArrayArray = sourceArray.toArray();
        expect(sourceArrayArray.length).toEqual(7);
        expect(VisualCmdLoop.isPrototypeOf(sourceArrayArray[0])).toEqual(true);
        expect(VisualCmdLeft.isPrototypeOf(sourceArrayArray[1])).toEqual(true);
        expect(VisualCmdLoop.isPrototypeOf(sourceArrayArray[2])).toEqual(true);
        expect(VisualCmdRight.isPrototypeOf(sourceArrayArray[3])).toEqual(true);
        expect(VisualCmdBodyEnd.isPrototypeOf(sourceArrayArray[4])).toEqual(true);
        expect(VisualCmdBodyEnd.isPrototypeOf(sourceArrayArray[5])).toEqual(true);
        expect(VisualCmdLeft.isPrototypeOf(sourceArrayArray[6])).toEqual(true);
    });

    it('can produce a source string for single command', function () {
        var sourceArray = Object.create(SourceArray).init();
        sourceArray.addCommand(Object.create(VisualCmdRight));
        expect(sourceArray.toSourceString())
            .toEqual('robot.moveRight();\n');
    });

    it('can produce a source string for multiple commands', function () {
        var sourceArray = Object.create(SourceArray).init();
        sourceArray.addCommand(Object.create(VisualCmdRight));
        sourceArray.addCommand(Object.create(VisualCmdLeft));
        sourceArray.addCommand(Object.create(VisualCmdLeft));
        expect(sourceArray.toSourceString())
            .toEqual('robot.moveRight();\n' +
                     'robot.moveLeft();\n' +
                     'robot.moveLeft();\n');
    });

    it('can produce a source string for loops', function () {
        var visualCmdLoop = Object.create(VisualCmdLoop).init();
        visualCmdLoop.addChild(Object.create(VisualCmdRight));
        visualCmdLoop.addChild(Object.create(VisualCmdLeft));

        var sourceArray = Object.create(SourceArray).init();
        sourceArray.addCommand(Object.create(VisualCmdRight));
        sourceArray.addCommand(visualCmdLoop);
        sourceArray.addCommand(Object.create(VisualCmdRight));
        expect(sourceArray.toSourceString())
            .toEqual('robot.moveRight();\n' +
                     'loop {\n' +
                     '    robot.moveRight();\n' +
                     '    robot.moveLeft();\n' +
                     '}\n' +
                     'robot.moveRight();\n');
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

    describe('subclass VisualCmdPushButton', function () {
        it('can print the correct source representation', function () {
            expect(Object.create(VisualCmdPushButton).toSourceString())
                .toEqual('robot.pushButton();\n');
        });
    });

    describe('subclass VisualCmdLoop', function () {
        it('can print the correct source representation with no children', function () {
            expect(Object.create(VisualCmdLoop.init()).toSourceString())
                .toEqual('loop {\n}\n');
        });

        it('can print the correct source representation with several children', function () {
            var visualCmdLoop = Object.create(VisualCmdLoop).init();
            visualCmdLoop.addChild(Object.create(VisualCmdPushButton));
            visualCmdLoop.addChild(Object.create(VisualCmdRight));
            visualCmdLoop.addChild(Object.create(VisualCmdLeft));
            var expectedSource =
                'loop {\n' +
                '    robot.pushButton();\n' +
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
