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
    init: function (context, icon) {
        this.context = context;
        this.icon = icon;
        this.nestingLevel = 0;
        return this;
    },
    getNestingLevel: function () {
        return this.nestingLevel;
    },
    addChild: function (visualCmd) {
        visualCmd.nestingLevel = this.nestingLevel + 1;
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
    },
    drawOutline: function (x, y, width) {
        function roundedRect(x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.context.beginPath();
            this.context.moveTo(x+r - 1, y);
            this.context.arcTo(x+w, y,   x+w, y+h, r);
            this.context.arcTo(x+w, y+h, x,   y+h, r);
            this.context.arcTo(x,   y+h, x,   y,   r);
            this.context.arcTo(x,   y,   x+w, y,   r);
            this.context.fill();
            this.context.stroke();
            this.context.closePath();
        }

        this.context.strokeStyle = '#777';
        this.context.lineWidth = 2;
        this.context.fillStyle = 'white';

        roundedRect.call(this, x + 2, y + 2, width || 52, 52, 4);
    },
    draw: function (y) {
        this.drawOutline(this.nestingLevel * 10, y);
        this.context.drawImage(this.icon, this.nestingLevel * 10 + 4, y + 4);
    }
};

var VisualCmdLeft = Object.create(VisualCmd);

VisualCmdLeft.toSourceString = function () {
    return 'robot.moveLeft();\n';
};

var VisualCmdRight = Object.create(VisualCmd);

VisualCmdRight.toSourceString = function () {
    return 'robot.moveRight();\n';
};

var VisualCmdLoop = Object.create(VisualCmd);

VisualCmdLoop.init = function () {
    this.children = [];
    var parent = Object.getPrototypeOf(Object.getPrototypeOf(this));
    parent.init.apply(this, arguments);
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

var VisualCmdPushButton = Object.create(VisualCmd);

VisualCmdPushButton.toSourceString = function () {
    return 'robot.pushButton();\n';
};
