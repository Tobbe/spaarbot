var SourceMatrix = {
    init: function(maxWidth) {
        this.maxWidth = maxWidth;
        this.sourceMatrix = [[]];
        return this;
    },
    addCommand: function (visualCmd) {
        var lastRow = this.sourceMatrix[this.sourceMatrix.length - 1];
        if (lastRow.length === this.maxWidth) {
            lastRow = [];
            this.sourceMatrix.push(lastRow);
        }

        lastRow.push(visualCmd);
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
