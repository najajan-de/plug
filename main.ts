import p5 from 'p5';
import p5Svg from 'p5.js-svg';
import { Board, WallType } from './Board';
import { Tile } from './Tile';
        



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
    board.makeWalls();
    console.log(board.horizontalWalls);
    console.log(board.verticalWalls);
    return board;
}

let board = generateDefaultBoard()
console.log(board.tiles);

p5Svg(p5);
let sketch = function (p:any) {
    let spacing = 20;
    p.setup = function () {
        
        p.createCanvas((board.width+1)*spacing, (board.height+1)*spacing,p.SVG);
        p.translate(spacing/2,spacing/2);
        
        // Visualize Tiles
        p.strokeWeight(1);
        p.noFill();
        // for(let tile of board.tiles) {
        //     p.rect(spacing*tile.position[0],spacing*tile.position[1],spacing*tile.width,spacing*tile.height);
        // }

        // Draw horizontal Walls
        p.stroke('blue')

        for(let col = 0; col < board.horizontalWalls.length; col ++) {
            for( let row = 0; row < board.horizontalWalls[col].length; row++) {
                if( board.horizontalWalls[col][row] == WallType.Dashed) {setLineDash([3,3]);}
                if( board.horizontalWalls[col][row] == WallType.Line) {setLineDash([]);}

                if( board.horizontalWalls[col][row] != WallType.None) {
                    p.beginShape();
                    p.vertex(col*spacing,row*spacing);
                    p.vertex((col+1)*spacing,row*spacing);
                    p.endShape();
                }
            }
        }

        // Draw vertical walls
        p.stroke('green');
        for(let col = 0; col < board.verticalWalls.length; col ++) {
            for( let row = 0; row < board.verticalWalls[col].length; row++) {
                if( board.verticalWalls[col][row] == WallType.Dashed) {setLineDash([3,3]);}
                if( board.verticalWalls[col][row] == WallType.Line) {setLineDash([]);}

                if( board.verticalWalls[col][row] != WallType.None) {
                    p.beginShape();
                    p.vertex(col*spacing,row*spacing);
                    p.vertex(col*spacing,(row+1)*spacing);
                    p.endShape();
                }
            }
        }
   
        // Draw Path
        setLineDash([]);
        p.stroke('red');
        p.beginShape();
        p.visualizePath(board.startTile);

    };

    p.draw = function() {

    }

    p.visualizePath = function(tile: Tile) {
        for(let nextTile of tile.nextTiles) {
            p.beginShape();
            p.vertex(tile.position[0]*spacing+spacing/2, tile.position[1]*spacing+spacing/2);
            p.vertex(nextTile.position[0]*spacing+spacing/2, nextTile.position[1]*spacing+spacing/2);
            p.endShape();
            p.visualizePath(nextTile);
        }
    }

    let setLineDash = function(list:number[]) {
        p.drawingContext.setLineDash(list);
      }
}

let myp5 = new p5(sketch, document.body);


