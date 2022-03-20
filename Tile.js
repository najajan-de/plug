"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
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
