import { Tile, Position } from './Tile';
export enum WallType {
    None,
    Dashed,
    Line
}

export class Board {
    width: number;
    height: number;
    tiles: Tile[];
    grid: Tile[][];
    startTile: Tile|null;
    horizontalWalls: WallType[][];
    verticalWalls: WallType[][];
    constructor(board_width: number, board_height: number) {
        this.width = board_width;
        this.height = board_height;
        this.tiles = [];
        this.grid = [[]];
        this.startTile = null;

        this.horizontalWalls = [[]]; // (height+1) x width - matrix
        this.verticalWalls = [[]];  // height x (width+1) - matrix
        for(let i = 0; i<this.width; i++) {
            	this.horizontalWalls[i] = [];
                this.verticalWalls[i] = [];
                for(let j = 0; j<this.height; j++) {
                    this.horizontalWalls[i][j] = WallType.Line;
                    this.verticalWalls[i][j] = WallType.Line;
                }
                this.horizontalWalls[i][this.height] = WallType.Line;
        }
        
        this.verticalWalls[this.width] = [];
        for(let j = 0; j<this.height; j++) {
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

    /**
     * Refreshes grid variable from tiles array
     */
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

    /**
     * Adds a tile to the board: Adding it to the tiles-Array and to the fields in the grid.
     * @param tile Tile to add to board
     */
    addTile(tile: Tile) {
        this.tiles.push(tile);

        for(let i=tile.position[0];i<tile.position[0]+tile.width;i++) {
            for(let j =tile.position[1];j<tile.position[1]+tile.height;j++) {
                if ( !this.grid[i] ) { this.grid[i]=[] }
                this.grid[i][j] = tile;
            }
        }
    }

    /**
     * Gets the tile on a given position
     * @param position Position to check for Tile
     * @returns Tile or undefined
     */
    getTileAtPosition(position:Position) {
        return this.grid[position[0]][position[1]];
    }

    /**
     * Creates the Path from a list of Positions. Between two positions the path will be straight - vertically or horizontally.
     * Fro each Tile on the path, the nextTile attribute is set.
     * @param coordinateList List of Positions
     */
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
    createWallsForTile(tile: Tile){
        console.log(" -- createWallsForTile -- ");
        console.log(tile)

        // Inner Walls
        for(let w = 0; w<tile.width; w++){
            
            for(let h = 0; h<tile.height;h++) {
                console.log("w = "+(w+tile.position[0]) + " | h = "+(h+tile.position[1]));
                if(w>0) {
                    this.verticalWalls[w+tile.position[0]][h+tile.position[1]] = WallType.None;
                    console.log("v");
                    
                }
                if(h>0) {
                    this.horizontalWalls[w+tile.position[0]][h+tile.position[1]] = WallType.None;
                    console.log("h");
                }
            }
        }

        // Dashed Line to Next Tiles
        for (let nextTile of tile.nextTiles) {
            let ownWalls = this.getListOfOuterWalls(tile);
            let nextWalls = this.getListOfOuterWalls(nextTile)

            const equals = (a:any[], b:any[]) =>
            a.length === b.length &&
            a.every((v, i) => v === b[i]);


            let horizontalWallsTogether = ownWalls.horizontal.filter(value => nextWalls.horizontal.some(e => equals(e,value)));
            let verticalWallsTogether = ownWalls.vertical.filter(value => nextWalls.vertical.some(e => equals(e,value)));
            console.log(horizontalWallsTogether);
            console.log(verticalWallsTogether);
            for (let hWall of horizontalWallsTogether) {
                this.horizontalWalls[hWall[0]][hWall[1]] = WallType.Dashed;
            }

            for(let vWall of verticalWallsTogether) {
                this.verticalWalls[vWall[0]][vWall[1]] = WallType.Dashed;
            }
        }
    }

    /**
     * Gets the outer Walls of a Tile, horizontally and vertically
     * @param tile Tile to get the outer walls from
     * @returns {horizontal: List of horizontal walls, vertical: List of vertical Walls}
     */
    getListOfOuterWalls(tile: Tile) {
        let horizontal:number[][] = []
        for(let w = 0; w<tile.width;w++) {
            horizontal.push([tile.position[0]+w,tile.position[1]])
            horizontal.push([tile.position[0]+w,tile.position[1]+tile.height])
        }

        let vertical:number[][] = []
        for(let h = 0; h<tile.height;h++) {
            vertical.push([tile.position[0],tile.position[1]+h])
            vertical.push([tile.position[0]+tile.width,tile.position[1]+h])
        }
        console.log({horizontal: horizontal, vertical: vertical})
        return {horizontal: horizontal, vertical: vertical}
    }

    
}