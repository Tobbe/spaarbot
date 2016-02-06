var SourceArray = {
    init: function() {
        this.sourceArray = [];
        return this;
    },
    addCommand: function (visualCmd) {
        this.sourceArray = this.sourceArray.concat(visualCmd.toArray());
    },
    toSourceString: function () {
        var str = '';
        var skip = 0;
        this.sourceArray.forEach(function (visualCmd) {
            if (skip) {
                skip--;
            } else {
                str += visualCmd.toSourceString();
                skip = visualCmd.toArray().length - 1;
            }
        });

        return str;
    },
    toArray: function () {
        return this.sourceArray;
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
    },
    toArray: function () {
        var array = [this];

        if (this.children) {
            this.children.forEach(function (child) {
                array = array.concat(child.toArray());
            });

            array.push(Object.create(VisualCmdBodyEnd));
        }

        return array;
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
            .slice(0, -1) // remove last newline
            .split('\n')
            .forEach(function (line) {
                str += '    ' + line + '\n';
            });
    });
    str += '}\n';

    return str;
};

var VisualCmdBodyEnd = Object.create(VisualCmd);
