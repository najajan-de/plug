import p5 from 'p5';
import p5Svg from 'p5.js-svg';
type Position = number[];

export class Board {
    width: number;
    height: number;
    tiles: Tile[];
    grid: Tile[][];
    startTile: Tile|null;
    constructor(board_width: number, board_height: number) {
        this.width = board_width;
        this.height = board_height;
        this.tiles = [];
        this.grid = [[]];
        this.startTile = null;
        console.log("Board: " + board_width + ", " + board_height);
    }

    fillEmptyTiles() {
        console.log("Fill empty tiles");
        // let grid = math.zeros(this.width, this.height);
        //this.refreshGrid();
        
        console.log("GRID")
        console.log(this.grid);
        for (let i = 0; i<this.width;i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.grid[i] == undefined || this.grid[i][j] == undefined) {
                    this.addTile(new Tile([i,j]))
                }
            }
        }
                
    }

    refreshGrid(){
        for (let tile of this.tiles) {
            
            for(let i=tile.position[0];i<tile.position[0]+tile.width;i++) {
                for(let j =tile.position[1];j<tile.position[1]+tile.height;j++) {
                    this.grid[i][j] = tile;
                }
            }

        }
        console.log(this.grid);
    }

    addTile(tile: Tile) {
        this.tiles.push(tile);

        for(let i=tile.position[0];i<tile.position[0]+tile.width;i++) {
            for(let j =tile.position[1];j<tile.position[1]+tile.height;j++) {
                if ( !this.grid[i] ) { this.grid[i]=[] }
                this.grid[i][j] = tile;
            }
        }
    }

    getTileAtPosition(position:Position) {
        return this.grid[position[0]][position[1]];
    }

    makePathFromCoordinates(coordinateList:Position[]) {
        let fullCoord:Position[] = [];

        for(let coordNo = 0; coordNo < coordinateList.length - 1; coordNo++) {
            let coordStart = coordinateList[coordNo];
            let coordEnd = coordinateList[coordNo + 1];
            console.log(coordNo + ' '+coordStart+' '+coordEnd);
            let coordList:Position[] = []

            if (coordStart == coordEnd) {
                console.log("equal");

                coordList.push(coordStart);

            }
            else if (coordStart[0] == coordEnd[0]) {
                console.log("x is constant",coordStart[1], coordEnd[1]);

                let start = Math.min(coordStart[1], coordEnd[1]);
                let end = Math.max(coordStart[1], coordEnd[1]);

                for(let j = start; j<=end; j++) {
                    coordList.push([coordStart[0], j]);
                    console.log(coordStart[0], j);
                }
                console.log("start: " + coordStart[1] + " | end: " + coordEnd[1]);
                console.log(coordStart[1] > coordEnd[1])
                if(coordStart[1] > coordEnd[1]) {
                    coordList = coordList.reverse();
                    console.log("reversed");
                }

            } else if (coordStart[1]==coordEnd[1]) { 
                console.log("y is constant",coordStart[0] >> coordEnd[0]);

                let start = Math.min(coordStart[0], coordEnd[0]);
                let end = Math.max(coordStart[0], coordEnd[0]);

                for(let j = start; j<=end; j++) {
                    coordList.push([j,coordStart[1]]);
                    console.log(j, coordStart[1]);
                }

                if(coordStart[0] > coordEnd[0]) {
                    coordList = coordList.reverse();
                    console.log("reversed");
                }


            }

            fullCoord = [...fullCoord,...coordList];
            fullCoord.pop();
        }
        fullCoord.push(coordinateList[coordinateList.length - 1]);
        console.log(fullCoord);

        let prev;
        for(let pos of fullCoord) {
            let tile = this.getTileAtPosition(pos);
            if(prev && prev!=tile) {
                prev.nextTile = tile;
            }
            prev = tile;
        }
    }
}
        

export class Tile {
    position: Position;
    width: number;
    height: number;
    nextTile: Tile | null;
    constructor(pos:Position, width=1, height=1) {
        this.position = pos;
        this.width = width;
        this.height = height;
        this.nextTile = null;
    }


    isTileAtPosition(pos:Position) {
        if(pos[0] - this.position[0] < this.width && pos[1] - this.position[1] < this.height) {
            return true;
        } else {
            return false;
        }
    }
}

function generateDefaultBoard() {
    let board = new Board(8,8);
    board.addTile(new Tile([7,1],1,2));
    board.addTile(new Tile([3,7],2,1));
    board.addTile(new Tile([0,6],2,2));
    board.addTile(new Tile([0,3],1,2));
    board.addTile(new Tile([5,1],2,3));
    board.addTile(new Tile([5,4],1,2));
    board.addTile(new Tile([3,5],2,1));
    board.addTile(new Tile([3,3],2,2));

    board.fillEmptyTiles();

    board.startTile=board.getTileAtPosition([0,0]);

    board.makePathFromCoordinates([
        [0,0],
        [7,0],
        [7,7],
        [0,7],
        [0,1],
        [5,1]
    ]);

    board.makePathFromCoordinates([
        [5,3],
        [5,5],
        [2,5]
    ])

    board.makePathFromCoordinates([
        [6,3],
        [6,6],
        [2,6],
        [2,5]
    ])

    board.makePathFromCoordinates([
        [2,5],
        [1,5],
        [1,4],
        [2,4],
        [2,3],
        [1,3],
        [1,2],
        [4,2],
        [4,3]
    ])

    return board;
}

let board = generateDefaultBoard()
console.log(board.tiles);

p5Svg(p5);
let sketch = function (p:any) {
    p.setup = function () {
        let spacing = 20;
        p.createCanvas(board.width*spacing, board.height*spacing,p.SVG);
        
        p.strokeWeight(2);
        p.noFill();
        for(let tile of board.tiles) {
            p.rect(spacing*tile.position[0],spacing*tile.position[1],spacing*tile.width,spacing*tile.height);
        }
        p.stroke('red');
        p.beginShape();
        let tile = board.startTile;
        while (tile) {
            p.vertex(tile.position[0]*spacing+spacing/2, tile.position[1]*spacing+spacing/2);
            tile=tile.nextTile;
        }
        p.endShape();

    };

    p.draw = function() {

    }
}

let myp5 = new p5(sketch, document.body);
