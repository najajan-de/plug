type Count = {
    minimum?:number, 
    exact?:number, 
    maximum?:number
}

type Style = {
    usecase:string,
    fontSize?:number
}

export class Task {
    text:string
    formatting:string
    tileSizes:string[]
    count:Count
    style?:Style

    constructor(obj:any);
    constructor(text:string,formatting?:string,tileSizes?:string[],count?:Count,style?:Style); 
    constructor(textOrObj:any,formatting?:string,tileSizes?:string[],count?:Count,style?:Style) {
        if(typeof textOrObj === "string"){
            this.text = textOrObj

            this.formatting = formatting ? formatting : textOrObj;
            this.tileSizes = tileSizes ? tileSizes : ["1x1"];
            this.count = count ? count : {};
            this.style = style;
        } else {
            this.text = textOrObj.text
            this.formatting = textOrObj.formatting ? textOrObj.formatting : textOrObj.text;
            this.tileSizes = textOrObj.tileSizes ? textOrObj.tileSizes : ["1x1"];
            this.count = textOrObj.count;
            this.style = textOrObj.style;
        }

        
    }

    isForTileSize(tileSize:string) : boolean {
        return this.tileSizes.includes(tileSize);
    }

    
}

let tasksJson:any[] = [

    {text:"Trink %i"},
{text:"Verteil %i"},
{text:"%s trinkt %i"},
{text:"%s verteilt %i"},
{text:"Spieler rechts von dir trinkt %i"},
{text:"Spieler links von dir trinkt %i"},
{text:"Alle trinken %i"},
{text:"Alle anderen "},
{text:"Alle Brunetten trinken %i"},
{text:"Alle Blonden trinken %i"},
{text:"Auf Ex!"},
{text:"Trink Buddy"},
{text:"Neue Regel!"},
{text:"Reimrunde!"},
{text:"Wurmloch", count:{exact:2}},
{text:"Geh %i Feld(er) zurück"},
{text:"Geh %i Feld(er) vor"},
{text:"Münze werfen\nZahl: Alle trinken %i\nKopf: Du trinkst %i", count:{maximum:1}, tileSizes:["1x2"]},
{text:"Schnick Schnack Schnuck\nDer Verlieren trinkt %i", count:{maximum:1}, tileSizes:["1x2"]},
{text:"Verbotenes Wort\nWer es sagt muss trinken!", count:{maximum:1}, tileSizes:["1x2"]},
{text:"Question Master", count:{maximum:1}, tileSizes:["1x2"]},
{text:"Plätze tauschen", count:{maximum:1}, tileSizes:["1x2"]},
{text:"Riese und Zwerg", count:{maximum:1}, tileSizes:["2x2"]},

]

export let tasks:Task[] = [];

for(let task of tasksJson) {
    tasks.push(new Task(task))
    console.log(tasks[tasks.length - 1])
}

