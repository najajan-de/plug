import { Board } from './Board';
import { Tile, Position } from './Tile';
import { Task, tasks } from './Task'

let fontSizes = {
    small: 12, 
    medium: 14, 
    large: 16
}



export class Game {
    board: Board;
    taskPool: Task[];
    tasksMaximumReached: Task[];

    constructor(width: number, height: number) {

        this.board = new Board(width,height);
        this.taskPool = tasks
        this.tasksMaximumReached = []

    }

    assignMandatoryTasks() {
        
        let mandatory = this.taskPool.filter(value => {
                return value.count.hasOwnProperty("minimum") || value.count.hasOwnProperty("exact") 
        })
            
        for(let task of mandatory) {
            if (task.count.minimum) {
                for (let i = 0; i < task.count.minimum;i++) {
                    this.assignTaskRandom(task);
                }
            
                if (task.count.exact) {
                    let taskUsed:number = this.getTaskUsageCount(task);

                    for ( let i = 0; i<task.count.exact-taskUsed;i++) {
                        this.assignTaskRandom(task);
                    }
                }
            }
        }
        
    }

    assignTaskRandom(task:Task) {
        let possibleTiles = this.board.tiles.filter(tile => task.tileSizes.includes(tile.getSizeIdentifier()) && !tile.task)
        let rnd = Math.floor(Math.random() * possibleTiles.length);
        possibleTiles[rnd].task = task;
    }

    getTaskUsageCount(task:Task) {
        return this.board.tiles.filter(tile => tile.task==task).length;
    }

    isTaskValid(task:Task) {
        let usageCount = this.getTaskUsageCount(task);
        if(task.count !== undefined) {
            if(task.count.exact !== undefined) {
                if(usageCount >= task.count.exact) {
                    return false;
                }
            }
            if(task.count.maximum !== undefined) {
                if(usageCount >= task.count.maximum) {
                    return false
                }
            }
        }
        return true;
    }

    assignTasks() {
        let tilesWithoutTasks = this.board.tiles.filter(tile => !tile.task)
        for(let tile of tilesWithoutTasks) {
            
            let size:string = tile.getSizeIdentifier();

            let possibleTasks = this.taskPool.filter(task => {
                if ( !this.isTaskValid(task) ){ return false;}
                // console.log(task.count);
                // console.log("count" in task);
                // console.log(task.count !== undefined)
                if(task.count !== undefined) {if ( task.count.exact !== undefined ) {if (task.count.exact < this.getTaskUsageCount(task)) {return false;}}}
                if(task.count !== undefined) {if(task.count.maximum !== undefined) {if (task.count.maximum < this.getTaskUsageCount(task))  {return false;}}}
                if(!task.tileSizes.includes(size)) {return false}
                return true;
            }
                // !this.tasksMaximumReached.includes(task) && 
                // (task.count.exact || 0)<this.getTaskUsageCount(task) && 
                // (task.count.maximum || 0)<this.getTaskUsageCount(task)
                
                )
                console.log("possible tasks:")
                console.log(possibleTasks);

            if(possibleTasks.length<1) {
                continue;
            }
            let task = possibleTasks[Math.floor(Math.random()*possibleTasks.length)];


            tile.task = task;

            if (task.count !== undefined) if (task.count.exact !== undefined) {
                let taskUsed:number = this.getTaskUsageCount(task);

                for ( let i = 0; i<task.count.exact-taskUsed;i++) {
                    this.assignTaskRandom(task);
                }
            }
            
        }
    }

}