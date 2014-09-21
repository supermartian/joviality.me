/*
 * tree.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

function Pos(x, y) {
    this.x = x;
    this.y = y;
}

function Leaf() {
    this.style = 0;
    this.scale = 0.01;
    this.pos = new Pos();
    this.angle = 0;
}

function Branch(start, end) {
    this.start = start;
    this.end = end;
    this.angle = 0;
    this.thick = 0.1;
    this.branches = [];
    this.leaves = [];
    this.age = 0;
    this.stop = false;
};

Branch.prototype.reAngle = function() {
    this.angle = Math.atan((this.end.y - this.start.y) / (this.end.x - this.start.x));
}

Branch.prototype.getLength = function() {
    return Math.sqrt(Math.pow(this.end.x - this.start.x, 2) +
           Math.pow(this.end.y - this.start.y, 2));
}

Branch.prototype.addBranch = function(root, branch) {
    root.branches.push(branch);
}

Branch.prototype.scale = function() {
    var ll = this.getLength();
    var l = Math.random() * 10;
    var ca = (this.end.x - this.start.x) / ll;
    var sa = (this.end.y - this.start.y) / ll;
    this.end.x = this.end.x + l * ca;
    this.end.y = this.end.y + l * sa;

    var delta = l;
    for (var i = 0; i < this.leaves.length; i++) {
        this.leaves[i].x = this.end.x;
        this.leaves[i].y = this.end.y;
        this.leaves[i].scale += 0.01;
    if (this.leaves[i].scale > 0.1)
        this.leaves[i].scale = 0.1;
    }

    for (var i = 0; i < this.branches.length; i++) {
        /*
         *this.branches[i].start.x = this.branches[i].start.x + delta * ca;
         *this.branches[i].start.y = this.branches[i].start.y + delta * sa;
         *this.branches[i].end.x = this.branches[i].end.x + delta * ca;
         *this.branches[i].end.y = this.branches[i].end.y + delta * sa;
         */
    }
}

Branch.prototype.generateNewBranch = function(root) {
    var ll = root.getLength();
    var l = (root.getLength() / 3) * Math.random();
    var ca = (root.end.x - root.start.x) / ll;
    var sa = (root.end.y - root.start.y) / ll;

    var newBranch = new Branch(new Pos(0, 0), new Pos(0, 0));
    newBranch.start.x = root.end.x;
    newBranch.start.y = root.end.y;

    root.reAngle();
    var angle = -45 / Math.PI * 180 - 120 * Math.random() + 30;
    newBranch.angle = angle * Math.PI / 180;
    var newlength = Math.random() * 10;
    newBranch.end.y = Math.sin(newBranch.angle) * newlength + newBranch.start.y;
    newBranch.end.x = Math.cos(newBranch.angle) * newlength + newBranch.start.x;
    newBranch.reAngle();

    root.addBranch(root, newBranch);
}

Branch.prototype.growLeaf = function(root) {
    if (this.leaves.length > 1) return;
    var newLeaf = new Leaf();
    newLeaf.x = root.end.x;
    newLeaf.y = root.end.y;
    newLeaf.style = Math.floor(Math.random() * 10) % 3;
    root.leaves.push(newLeaf);
}

Branch.prototype.growWidth = function(max) {
}

Branch.prototype.grow = function(root, branch, keep) {
    root.age++;
    if (!keep) return;
    if (this.stop) return;
    if (Math.random() > 0.5) {
        // Likely
        root.scale();
    }

    if (root.getLength() > 100 && Math.random() > 0.5 && branch) {
        // Likely
        root.generateNewBranch(root);
        branch = false;
    } else {
    }

    for (var i = 0; i < root.branches.length; i++) {
        if (root.branches[i].age > 90) {
            root.branches.splice(i, 1);
            continue;
        } else if (root.branches[i].age > 60) {
        }
        if (root.branches[i].age > 90) {
            root.branches.splice(i, 1);
            continue;
        }
        root.branches[i].grow(root.branches[i], branch, true);
        root.branches[i].growLeaf(root.branches[i]);
    }
}
