/**
 * moveLeft: mL, moveRight: mR, etc
 * loop: l
 * loop body: lB
 * pushButton: p
 * openDoor: d
 *
 * robot.moveRight();
 * robot.openDoor();
 * loop {
 *     robot.moveLeft(2);
 *     robot.pushButton();
 * }
 *
 * is stored as
 *
 *                  [mL 2]  [p ]
 * [[mR], [d], [l], [lB  ], [lB]]
 *
 * i.e. one array with five inner arrays, where to three first have a length
 * of one, and the two last have a length of two.
 */
var SourceMatrix = {
    init: function() {
        this.sourceMatrix = [];
        return this;
    },
    addCommand: function (visualCmd) {
        this.sourceMatrix.push([visualCmd]);
    },
    toSourceString: function () {
        var str = '';
        this.sourceMatrix.forEach(function (row) {
            row.forEach(function (visualCmd) {
                str += visualCmd.toSourceString();
            });
        });

        return str;
    },
    toArray: function () {
        return this.sourceMatrix.reduce(function (previousValue, currentValue) {
            return previousValue.concat(currentValue);
        });
    }
};

var VisualCmd = {
    init: function (name) {
        this.name = name;
        return this;
    },
    getName: function () {
        return this.name;
    },
    addChild: function (visualCmd) {
        this.children.push(visualCmd);
    }
};

var VisualCmdLeft = Object.create(VisualCmd).init('cmd_left');

VisualCmdLeft.toSourceString = function () {
    return 'robot.moveLeft();\n';
};

var VisualCmdRight = Object.create(VisualCmd).init('cmd_right');

VisualCmdRight.toSourceString = function () {
    return 'robot.moveRight();\n';
};

var VisualCmdLoop = Object.create(VisualCmd).init('cmd_loop');

VisualCmdLoop.init = function () {
    this.children = [];
    return this;
};

VisualCmdLoop.toSourceString = function () {
    var str = 'loop {\n';
    var childrenSource = '';
    this.children.forEach(function (child) {
        child.toSourceString()
            .replace(/\s+$/, '') // rightTrim to remove last newline
            .split('\n')
            .forEach(function (line) {
                str += '    ' + line + '\n';
            });
    });
    str += '}\n';

    return str;
};
