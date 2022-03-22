"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p5_1 = __importDefault(require("p5"));
const p5_js_svg_1 = __importDefault(require("p5.js-svg"));
const Board_1 = require("./Board");
const Tile_1 = require("./Tile");
const Game_1 = require("./Game");
function generateDefaultBoard() {
    let game = new Game_1.Game(8, 8);
    let board = game.board;
    board.addTile(new Tile_1.Tile([7, 1], 1, 2));
    board.addTile(new Tile_1.Tile([3, 7], 2, 1));
    board.addTile(new Tile_1.Tile([0, 6], 2, 2));
    board.addTile(new Tile_1.Tile([0, 3], 1, 2));
    board.addTile(new Tile_1.Tile([5, 1], 2, 3));
    board.addTile(new Tile_1.Tile([5, 4], 1, 2));
    board.addTile(new Tile_1.Tile([3, 5], 2, 1));
    board.addTile(new Tile_1.Tile([3, 3], 2, 2));
    board.fillEmptyTiles();
    board.startTile = board.getTileAtPosition([0, 0]);
    board.makePathFromCoordinates([
        [0, 0],
        [7, 0],
        [7, 7],
        [0, 7],
        [0, 1],
        [5, 1]
    ]);
    board.makePathFromCoordinates([
        [5, 3],
        [5, 5],
        [2, 5]
    ]);
    board.makePathFromCoordinates([
        [6, 3],
        [6, 6],
        [2, 6],
        [2, 5]
    ]);
    board.makePathFromCoordinates([
        [2, 5],
        [1, 5],
        [1, 4],
        [2, 4],
        [2, 3],
        [1, 3],
        [1, 2],
        [4, 2],
        [4, 3]
    ]);
    board.makeWalls();
    console.log(board.horizontalWalls);
    console.log(board.verticalWalls);
    game.assignTasks();
    return board;
}
let board = generateDefaultBoard();
console.log(board.tiles);
(0, p5_js_svg_1.default)(p5_1.default);
let sketch = function (p) {
    let spacing = 20;
    p.setup = function () {
        p.createCanvas((board.width + 1) * spacing, (board.height + 1) * spacing, p.SVG);
        p.translate(spacing / 2, spacing / 2);
        // Visualize Tiles
        p.strokeWeight(1);
        p.noFill();
        // for(let tile of board.tiles) {
        //     p.rect(spacing*tile.position[0],spacing*tile.position[1],spacing*tile.width,spacing*tile.height);
        // }
        // Draw horizontal Walls
        p.stroke('blue');
        for (let col = 0; col < board.horizontalWalls.length; col++) {
            for (let row = 0; row < board.horizontalWalls[col].length; row++) {
                if (board.horizontalWalls[col][row] == Board_1.WallType.Dashed) {
                    setLineDash([5, 10, 5]);
                }
                if (board.horizontalWalls[col][row] == Board_1.WallType.Line) {
                    setLineDash([]);
                }
                if (board.horizontalWalls[col][row] != Board_1.WallType.None) {
                    p.beginShape();
                    p.vertex(col * spacing, row * spacing);
                    p.vertex((col + 1) * spacing, row * spacing);
                    p.endShape();
                }
            }
        }
        // Draw vertical walls
        p.stroke('green');
        for (let col = 0; col < board.verticalWalls.length; col++) {
            for (let row = 0; row < board.verticalWalls[col].length; row++) {
                if (board.verticalWalls[col][row] == Board_1.WallType.Dashed) {
                    setLineDash([5, 10, 5]);
                }
                if (board.verticalWalls[col][row] == Board_1.WallType.Line) {
                    setLineDash([]);
                }
                if (board.verticalWalls[col][row] != Board_1.WallType.None) {
                    p.beginShape();
                    p.vertex(col * spacing, row * spacing);
                    p.vertex(col * spacing, (row + 1) * spacing);
                    p.endShape();
                }
            }
        }
        // Draw Path
        // setLineDash([]);
        // p.stroke('red');
        // p.beginShape();
        // p.visualizePath(board.startTile);
        // Draw Tasks (Debug)
        p.noStroke();
        p.fill(0);
        p.textSize(4);
        p.textAlign(p.CENTER, p.CENTER);
        for (let tile of board.tiles) {
            if (tile.task) {
                p.text(tile.task.formatting, spacing * tile.position[0], spacing * tile.position[1], spacing * tile.width, spacing * tile.height);
            }
        }
        p.noFill();
        p.strokeWeight(2);
    };
    p.draw = function () {
    };
    p.visualizePath = function (tile) {
        for (let nextTile of tile.nextTiles) {
            p.beginShape();
            p.vertex(tile.position[0] * spacing + spacing / 2, tile.position[1] * spacing + spacing / 2);
            p.vertex(nextTile.position[0] * spacing + spacing / 2, nextTile.position[1] * spacing + spacing / 2);
            p.endShape();
            p.visualizePath(nextTile);
        }
    };
    let setLineDash = function (list) {
        p.drawingContext.setLineDash(list);
    };
};
let myp5 = new p5_1.default(sketch, document.body);
