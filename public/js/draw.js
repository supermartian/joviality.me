/*
 * draw.js
 * Copyright (C) 2014 Yuzhong Wen <wyz2014@vt.edu>
 *
 * Distributed under terms of the MIT license.
 */

var canvas1 = document.getElementById('layer1');
var context1 = canvas1.getContext('2d');
var canvas2 = document.getElementById('layer2');
var context2 = canvas2.getContext('2d');

var leaves = [];

var img = new Image();
img.src = "/img/2.png";
leaves.push(img);
img = new Image();
img.src = "/img/2.png";
leaves.push(img);
img = new Image();
img.src = "/img/2.png";
leaves.push(img);

var drawTree = function(tree) {
    context1.beginPath();
    context1.moveTo(tree.start.x, tree.start.y);
    context1.quadraticCurveTo(tree.end.x, tree.end.y+40, tree.end.x, tree.end.y);
    context1.lineWidth = tree.thick;
    context1.stroke();

    for (var i = 0; i < tree.branches.length; i++) {
        drawTree(tree.branches[i]);
    }

    for (var i = 0; i < tree.leaves.length; i++) {
        context2.drawImage(leaves[tree.leaves[i].style], tree.leaves[i].x, tree.leaves[i].y, tree.leaves[i].scale * leaves[i].width, tree.leaves[i].scale * leaves[i].height);
    }
};

var tree = new Branch({x:200, y:600}, {x:200, y:500});
tree.thick = 0.4;

drawTree(tree);

canvas2.addEventListener("mousedown", getPosition, false);

function getPosition(event)
{
    canvas2.width = canvas2.width;
    canvas1.width = canvas1.width;
    tree.grow(tree, true, true);
    drawTree(tree);
}
