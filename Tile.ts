export type Position = number[];

export class Tile {
    position: Position;
    width: number;
    height: number;
    nextTiles: Tile[];
    task: any;
    constructor(pos:Position, width=1, height=1) {
        this.position = pos;
        this.width = width;
        this.height = height;
        this.nextTiles = [];
        this.task = null;
    }

    /**
     * Checks whether the Tile is on the given position or not
     * @param pos Position to check
     * @returns true, if the Tile is at the position | false, if the Tile is not at the position
     */
    isTileAtPosition(pos:Position) {
        if(pos[0] - this.position[0] < this.width && pos[1] - this.position[1] < this.height) {
            return true;
        } else {
            return false;
        }
    }

    getSizeIdentifier() {
        return (Math.min(this.width, this.height)) + "x" + (Math.max(this.width, this.height))
    }
}