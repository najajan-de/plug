export type Position = number[];

export class Tile {
    position: Position;
    width: number;
    height: number;
    nextTiles: Tile[];
    constructor(pos:Position, width=1, height=1) {
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
    isTileAtPosition(pos:Position) {
        if(pos[0] - this.position[0] < this.width && pos[1] - this.position[1] < this.height) {
            return true;
        } else {
            return false;
        }
    }
}