class Board {
    constructor(board_width, board_height) {
        this.width = board_width;
        this.height = board_height;
        this.tiles = [];
        this.grid = math.zeros(this.width, this.height);
        console.log("Borad: " + board_width + ", " + board_height);
    }

    fillEmptyTiles() {
        console.log("Fill empty tiles");
        // let grid = math.zeros(this.width, this.height);
        //this.refreshGrid();
        
        console.log("GRID")
        console.log(this.grid);
        this.grid.forEach((value, index) => {
            if (value == 0) {
                console.log(index);
                this.addTile(new Tile(index))
            }
        })
                
    }

    refreshGrid(){
        for (let tile of this.tiles) {
            // let dx = [tile.position[0],tile.position[0]+tile.width-1]
            let dx = [...Array(tile.width).keys()].map(x => x+tile.position[0]); 
            if (tile.width == 1) {
                dx = tile.position[0]
            }
            // let dy =[tile.position[1],tile.position[1]+tile.height-1];
            let dy = [...Array(tile.height).keys()].map(x => x+tile.position[1]);
            if (tile.height == 1) {
                dy = tile.position[1]
            }

            console.log(dx + " "+ dy);
            console.log(tile.width+ " "+ tile.height);
            console.log(math.matrix().resize([tile.width,tile.height],tile));
            console.log(this.grid.subset(math.index(dx,dy)));
            this.grid = this.grid.subset(math.index(dx,dy),math.matrix().resize([tile.width,tile.height],tile))
        }
        console.log(this.grid);
    }

    addTile(tile) {
        this.tiles.push(tile);

        let dx = [...Array(tile.width).keys()].map(x => x+tile.position[0]); 
            if (tile.width == 1) {
                dx = tile.position[0]
            }
        
        let dy = [...Array(tile.height).keys()].map(x => x+tile.position[1]);
        if (tile.height == 1) {
            dy = tile.position[1]
        }

        console.log(dx + " "+ dy);
            console.log(tile.width+ " "+ tile.height);
            console.log(math.matrix().resize([tile.width,tile.height],tile));
            console.log(this.grid.subset(math.index(dx,dy)));

        this.grid = this.grid.subset(math.index(dx,dy),math.matrix().resize([tile.width,tile.height],tile))
    }

    getTileAtPosition(position) {
        for( let tile of this.tiles) {
            if (tile.isTileAtPosition(position)) {
                return tile;
            }
        }
        return undefined;
    }

    makePathFromCoordinates(coordinates) {
        let prev;
        for(let pos in coordinates) {
            let tile = this.getTileAtPosition(pos);
            if(prev) {
                prev.nextTile = tile;
            }
            prev = tile;
        }
    }
}
        

class Tile {
    constructor(pos, width=1, height=1) {
        this.position = pos;
        this.width = width;
        this.height = height;
    }

    getPositionInGrid(grid_width, grid_height) {
        let grid = math.zeros(grid_width, grid_height);
        for (let i = 0; i < this.width;i++) {
            for (let j = 0; j < this.height; j++) {
                grid.subset(math.index(this.position[0]+i,this.position[1]+j),1)
            }   
        }
        console.log(this.position + " " + this.width + " " + this.height);
        console.log(grid)
        return grid;
    }

    isTileAtPosition(pos) {
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

    return board;
}

let board = generateDefaultBoard()
console.log(board.tiles);


let s = function (sketch) {
    sketch.setup = function () {
        let spacing = 20;
        createCanvas(board.width*spacing, board.height*spacing, SVG);
        
        stroke(2);
        noFill();
        for(let tile of board.tiles) {
            rect(spacing*tile.position[0],spacing*tile.position[1],spacing*tile.width,spacing*tile.height);
        }
        
    };

    sketch.draw = function() {

    }
}
let myp5 = new p5(s);




function generate_grid(width = 6, height = 6) {
    const dir = Object.freeze({
        up: [0,1],
        left: [-1,0],
        down: [0,-1],
        right: [1,0]
      });

    grid = math.zeros(width, height);
}