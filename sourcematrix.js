function SourceMatrix(maxWidth) {
    this.maxWidth = maxWidth;
    this.sourceMatrix = [[]];
}

SourceMatrix.prototype.addCommand = function (visualCmd) {
    var lastRow = this.sourceMatrix[this.sourceMatrix.length - 1];
    if (lastRow.length === this.maxWidth) {
        lastRow = [];
        this.sourceMatrix.push(lastRow);
    }

    lastRow.push(visualCmd);
};

SourceMatrix.prototype.toSourceString = function () {
    var str = '';
    this.sourceMatrix.forEach(function (row) {
        row.forEach(function (visualCmd) {
            str += visualCmd.toSourceString();
        });
    });

    return str;
};

SourceMatrix.prototype.toArray = function () {
    return this.sourceMatrix.reduce(function (previousValue, currentValue) {
        return previousValue.concat(currentValue);
    });
};

function VisualCmd(name) {
    this.name = name;
}

VisualCmd.prototype.getName = function () {
    return this.name;
};

function VisualCmdLeft() {
}

VisualCmdLeft.prototype = new VisualCmd('cmd_left');
VisualCmdLeft.prototype.constructor = VisualCmdLeft;
VisualCmdLeft.prototype.parent = VisualCmd.prototype;

VisualCmdLeft.prototype.toSourceString = function () {
    return 'robot.moveLeft();\n';
};

function VisualCmdRight() {
}

VisualCmdRight.prototype = new VisualCmd('cmd_right');
VisualCmdRight.prototype.constructor = VisualCmdRight;
VisualCmdRight.prototype.parent = VisualCmd.prototype;

VisualCmdRight.prototype.toSourceString = function () {
    return 'robot.moveRight();\n';
};
