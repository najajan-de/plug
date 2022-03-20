"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = exports.Board = void 0;
const p5_1 = __importDefault(require("p5"));
const p5_js_svg_1 = __importDefault(require("p5.js-svg"));
var WallType;
(function (WallType) {
    WallType[WallType["None"] = 0] = "None";
    WallType[WallType["Dashed"] = 1] = "Dashed";
    WallType[WallType["Line"] = 2] = "Line";
})(WallType || (WallType = {}));
class Board {
    constructor(board_width, board_height) {
        this.width = board_width;
        this.height = board_height;
        this.tiles = [];
        this.grid = [[]];
        this.startTile = null;
        this.horizontalWalls = [[]]; // (height+1) x width - matrix
        this.verticalWalls = [[]]; // height x (width+1) - matrix
        for (let i = 0; i < this.width; i++) {
            this.horizontalWalls[i] = [];
            this.verticalWalls[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.horizontalWalls[i][j] = WallType.Line;
                this.verticalWalls[i][j] = WallType.Line;
            }
            this.horizontalWalls[i][this.height] = WallType.Line;
        }
        this.verticalWalls[this.width] = [];
        for (let j = 0; j < this.height; j++) {
            this.verticalWalls[this.width][j] = WallType.Line;
        }
        console.log("Board: " + board_width + ", " + board_height);
    }
    /**
     * Fills all empty flieds of grid with 1x1-sized Tiles
     */
    fillEmptyTiles() {
        console.log("Fill empty tiles");
        // let grid = math.zeros(this.width, this.height);
        //this.refreshGrid();
        console.log("GRID");
        console.log(this.grid);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.grid[i] == undefined || this.grid[i][j] == undefined) {
                    this.addTile(new Tile([i, j]));
                }
            }
        }
    }
    /**
     * Refreshes grid variable from tiles array
     */
    refreshGrid() {
        for (let tile of this.tiles) {
            for (let i = tile.position[0]; i < tile.position[0] + tile.width; i++) {
                for (let j = tile.position[1]; j < tile.position[1] + tile.height; j++) {
                    this.grid[i][j] = tile;
                }
            }
        }
        console.log(this.grid);
    }
    /**
     * Adds a tile to the board: Adding it to the tiles-Array and to the fields in the grid.
     * @param tile Tile to add to board
     */
    addTile(tile) {
        this.tiles.push(tile);
        for (let i = tile.position[0]; i < tile.position[0] + tile.width; i++) {
            for (let j = tile.position[1]; j < tile.position[1] + tile.height; j++) {
                if (!this.grid[i]) {
                    this.grid[i] = [];
                }
                this.grid[i][j] = tile;
            }
        }
    }
    /**
     * Gets the tile on a given position
     * @param position Position to check for Tile
     * @returns Tile or undefined
     */
    getTileAtPosition(position) {
        return this.grid[position[0]][position[1]];
    }
    /**
     * Creates the Path from a list of Positions. Between two positions the path will be straight - vertically or horizontally.
     * Fro each Tile on the path, the nextTile attribute is set.
     * @param coordinateList List of Positions
     */
    makePathFromCoordinates(coordinateList) {
        let fullCoord = [];
        for (let coordNo = 0; coordNo < coordinateList.length - 1; coordNo++) {
            let coordStart = coordinateList[coordNo];
            let coordEnd = coordinateList[coordNo + 1];
            console.log(coordNo + ' ' + coordStart + ' ' + coordEnd);
            let coordList = [];
            if (coordStart == coordEnd) {
                console.log("equal");
                coordList.push(coordStart);
            }
            else if (coordStart[0] == coordEnd[0]) {
                console.log("x is constant", coordStart[1], coordEnd[1]);
                let start = Math.min(coordStart[1], coordEnd[1]);
                let end = Math.max(coordStart[1], coordEnd[1]);
                for (let j = start; j <= end; j++) {
                    coordList.push([coordStart[0], j]);
                    console.log(coordStart[0], j);
                }
                console.log("start: " + coordStart[1] + " | end: " + coordEnd[1]);
                console.log(coordStart[1] > coordEnd[1]);
                if (coordStart[1] > coordEnd[1]) {
                    coordList = coordList.reverse();
                    console.log("reversed");
                }
            }
            else if (coordStart[1] == coordEnd[1]) {
                console.log("y is constant", coordStart[0] >> coordEnd[0]);
                let start = Math.min(coordStart[0], coordEnd[0]);
                let end = Math.max(coordStart[0], coordEnd[0]);
                for (let j = start; j <= end; j++) {
                    coordList.push([j, coordStart[1]]);
                    console.log(j, coordStart[1]);
                }
                if (coordStart[0] > coordEnd[0]) {
                    coordList = coordList.reverse();
                    console.log("reversed");
                }
            }
            fullCoord = [...fullCoord, ...coordList];
            fullCoord.pop();
        }
        fullCoord.push(coordinateList[coordinateList.length - 1]);
        console.log(fullCoord);
        let prev;
        for (let pos of fullCoord) {
            let tile = this.getTileAtPosition(pos);
            if (prev && prev != tile) {
                prev.nextTiles.push(tile);
            }
            prev = tile;
        }
    }
    /**
     * Creates the walls for each Tile
     */
    makeWalls() {
        for (let tile of this.tiles) {
            this.createWallsForTile(tile);
        }
    }
    /**
     * Creates the walls for one Tile. Overrides all inner walls and the exit to the next tiles.
     * @param tile TIle to create the walls for
     */
    createWallsForTile(tile) {
        console.log(" -- createWallsForTile -- ");
        console.log(tile);
        // Inner Walls
        for (let w = 0; w < tile.width; w++) {
            for (let h = 0; h < tile.height; h++) {
                console.log("w = " + (w + tile.position[0]) + " | h = " + (h + tile.position[1]));
                if (w > 0) {
                    this.verticalWalls[w + tile.position[0]][h + tile.position[1]] = WallType.None;
                    console.log("v");
                }
                if (h > 0) {
                    this.horizontalWalls[w + tile.position[0]][h + tile.position[1]] = WallType.None;
                    console.log("h");
                }
            }
        }
        // Dashed Line to Next Tiles
        for (let nextTile of tile.nextTiles) {
            let ownWalls = this.getListOfOuterWalls(tile);
            let nextWalls = this.getListOfOuterWalls(nextTile);
            const equals = (a, b) => a.length === b.length &&
                a.every((v, i) => v === b[i]);
            let horizontalWallsTogether = ownWalls.horizontal.filter(value => nextWalls.horizontal.some(e => equals(e, value)));
            let verticalWallsTogether = ownWalls.vertical.filter(value => nextWalls.vertical.some(e => equals(e, value)));
            console.log(horizontalWallsTogether);
            console.log(verticalWallsTogether);
            for (let hWall of horizontalWallsTogether) {
                this.horizontalWalls[hWall[0]][hWall[1]] = WallType.Dashed;
            }
            for (let vWall of verticalWallsTogether) {
                this.verticalWalls[vWall[0]][vWall[1]] = WallType.Dashed;
            }
        }
    }
    /**
     * Gets the outer Walls of a Tile, horizontally and vertically
     * @param tile Tile to get the outer walls from
     * @returns {horizontal: List of horizontal walls, vertical: List of vertical Walls}
     */
    getListOfOuterWalls(tile) {
        let horizontal = [];
        for (let w = 0; w < tile.width; w++) {
            horizontal.push([tile.position[0] + w, tile.position[1]]);
            horizontal.push([tile.position[0] + w, tile.position[1] + tile.height]);
        }
        let vertical = [];
        for (let h = 0; h < tile.height; h++) {
            vertical.push([tile.position[0], tile.position[1] + h]);
            vertical.push([tile.position[0] + tile.width, tile.position[1] + h]);
        }
        console.log({ horizontal: horizontal, vertical: vertical });
        return { horizontal: horizontal, vertical: vertical };
    }
}
exports.Board = Board;
class Tile {
    constructor(pos, width = 1, height = 1) {
        this.position = pos;
        this.width = width;
        this.height = height;
        this.nextTiles = [];
    }
    /**
     * Checks whether the Tile is on the given position or not
     * @param pos Position to check
     * @returns true, if the Tile is at the position | false, if the Tile is not at the position
     */
    isTileAtPosition(pos) {
        if (pos[0] - this.position[0] < this.width && pos[1] - this.position[1] < this.height) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.Tile = Tile;
function generateDefaultBoard() {
    let board = new Board(8, 8);
    board.addTile(new Tile([7, 1], 1, 2));
    board.addTile(new Tile([3, 7], 2, 1));
    board.addTile(new Tile([0, 6], 2, 2));
    board.addTile(new Tile([0, 3], 1, 2));
    board.addTile(new Tile([5, 1], 2, 3));
    board.addTile(new Tile([5, 4], 1, 2));
    board.addTile(new Tile([3, 5], 2, 1));
    board.addTile(new Tile([3, 3], 2, 2));
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
    return board;
}
let board = generateDefaultBoard();
console.log(board.tiles);
(0, p5_js_svg_1.default)(p5_1.default);
let sketch = function (p) {
    let spacing = 20;
    p.setup = function () {
        p.createCanvas((board.width + 1) * spacing, (board.height + 1) * spacing, p.SVG);
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
                if (board.horizontalWalls[col][row] == WallType.Dashed) {
                    setLineDash([3, 3]);
                }
                if (board.horizontalWalls[col][row] == WallType.Line) {
                    setLineDash([1]);
                }
                if (board.horizontalWalls[col][row] != WallType.None) {
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
                if (board.verticalWalls[col][row] == WallType.Dashed) {
                    setLineDash([3, 3]);
                }
                if (board.verticalWalls[col][row] == WallType.Line) {
                    setLineDash([1]);
                }
                if (board.verticalWalls[col][row] != WallType.None) {
                    p.beginShape();
                    p.vertex(col * spacing, row * spacing);
                    p.vertex(col * spacing, (row + 1) * spacing);
                    p.endShape();
                }
            }
        }
        // Draw Path
        setLineDash([1]);
        p.stroke('red');
        p.beginShape();
        //p.visualizePath(board.startTile);
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
