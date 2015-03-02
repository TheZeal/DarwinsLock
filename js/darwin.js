var SIZEOFBOARD = 840

var c=document.getElementById("board");
var ctx=c.getContext("2d");

var battlefieldXSize = 21;
var battlefieldYSize = 21;
var unitSelected = -1;
document.onkeydown = checkKey;

var started = 1
var testmode = 0
var tick = 0;
var random = 0
var battlefield = createBattlefield(21,21)

crux = [0,0,-1,0,1,0,0,-1,0,1,-1,-1,1,1,-1,1,1,-1]
crux = [0,0,-2,1,-2,-1,-1,2,-1,-2,2,1,2,-1,1,2,1,-2]
crux = [0,0,-1,0,1,0,0,-1,0,1,-1,-1,1,1,-1,1,1,-1,-2,1,-2,-1,-1,2,-1,-2,2,1,2,-1,1,2,1,-2,2,0,0,2,-2,0,0,-2]
crux = [1,1,-1,-1,1,-1,-1,1] // twice as much.
crux = [1,0] // wave generator :)
crux = [1,0,0,-1,-1,-1] // funfacts...
crux = [1,-1,1,-2,2,-1] // on the right way
crux = [1,-1,1,-2,2,-1,3,-1,1,-3]  // I think I see where this is going
crux = [1,-1,1,-2,2,-1,3,-1,1,-3,1,-4,2,-3,3,-2,4,-1] // Excessive? Naaah.
crux = [] // Aaaaah, at las..
for(var i=1;i!=21;i++) // Noo, please
{
    for(var j=1;i!=j;j++) // Aha!
    {
        crux.push(j)
        crux.push(-i+j)
    }
} // Evolution pool. <3
crux = [0,0,1,0,0,1,-1,0,0,-1,20,0,0,20,-20,0,0,-20] // Return to basics, but... 
// WARNING : DOES WORK, HOEWEVER THIS IS NOT THE RIGHT WAY TO DO IT.
//crux = [1,1,-1,-1,1,-1,-1,1,20,20,-20,-20,20,-20,-20,20,-1,20,1,20,-1,-20,1,-20,20,1,20,-1,-20,1,-20,-1] // I think that you are insane

// Are theses crux equivalent? One is diagonal and the other is orthogonal, but the border passage transforms even cases into odd ones.

crux = [1,1,-1,-1,1,-1,-1,1,20,20,-20,-20,20,-20,-20,20,-1,20,1,20,-1,-20,1,-20,20,1,20,-1,-20,1,-20,-1]

// TODO : Would you kindly push this with git?

cruxPool = 
[
[0,0,-1,0,1,0,0,-1,0,1,-1,-1,1,1,-1,1,1,-1],
[0,0,-2,1,-2,-1,-1,2,-1,-2,2,1,2,-1,1,2,1,-2],
[0,0,-1,0,1,0,0,-1,0,1,-1,-1,1,1,-1,1,1,-1,-2,1,-2,-1,-1,2,-1,-2,2,1,2,-1,1,2,1,-2,2,0,0,2,-2,0,0,-2],
[1,1,-1,-1,1,-1,-1,1],
[1,0],
[1,-1,1,-2,2,-1],
[1,-1,1,-2,2,-1,3,-1,1,-3],
[1,-1,1,-2,2,-1,3,-1,1,-3,1,-4,2,-3,3,-2,4,-1],
[0,0,1,0,0,1,-1,0,0,-1,20,0,0,20,-20,0,0,-20],
[1,1,-1,-1,1,-1,-1,1,20,20,-20,-20,20,-20,-20,20,-1,20,1,20,-1,-20,1,-20,20,1,20,-1,-20,1,-20,-1]
]

crux = [0,0,1,0,0,1,-1,0,0,-1,20,0,0,20,-20,0,0,-20]

function drawSquare(x,y,size,color)
{
    ctx.beginPath();
    ctx.rect(x*40+(40-size)/2,y*40+(40-size)/2,size,size);
    ctx.fillStyle=color;
    ctx.fill();
}

var multiplier = 3000
var stw_ratio = 10e10
var results =
{
    rubis : 0,
    saphirs : 0,
    emeralds : 0
}

var cursor =
{
    coords :
    {
        x:15,
        y:5
    },
}


function createBattlefield(x,y)
{
    var map = [];
    for (var i = 0; i <x; i++)
    {
        map[i] = [];
        for (var j = 0; j < y; j++)
        {
            map[i][j] = {
                            saphirs : 1000,
                            rubis : 1000,
                            emeralds : 1000,
                        }
        }
    }
    return map;
}


function affBattlefield()
{
    ctx.beginPath();
    ctx.rect(0,0,SIZEOFBOARD,SIZEOFBOARD);
    ctx.fillStyle="black";
    ctx.fill();

    for (var i = 0; i<battlefieldXSize; i++)
    {
        for (var j = 0; j<battlefieldYSize; j++)
        {
            Math.floor(battlefield[i][j].knars/3000*255)

            drawSquare(i,j,38,"rgb(" + Math.floor(battlefield[i][j].rubis/3000*255) + "," + Math.floor(battlefield[i][j].emeralds/3000*255) + "," +  Math.floor(battlefield[i][j].saphirs/3000*255) + ")")
        }
    }
}

function countEmeralds(x,y)
{
    var emeralds = 0
    for (var i=0;i<crux.length;i+=2)
    {
        x0 = x+crux[i];
        y0 = y+crux[i+1];
        if (x0>=0 && x0<=20 && y0>=0 && y0<=20)
            emeralds+=battlefield[x0][y0].emeralds;
    }
    return emeralds
}

function countSaphirs(x,y)
{
    var saphirs = 0
    for (var i=0;i<crux.length;i+=2)
    {
        x0 = x+crux[i];
        y0 = y+crux[i+1];
        if (x0>=0 && x0<=20 && y0>=0 && y0<=20)
            saphirs+=battlefield[x0][y0].saphirs;
    }
    return saphirs
}

function countRubis(x,y)
{
    var rubis = 0
    for (var i=0;i<crux.length;i+=2)
    {
        x0 = x+crux[i];
        y0 = y+crux[i+1];
        if (x0>=0 && x0<=20 && y0>=0 && y0<=20)
            rubis+=battlefield[x0][y0].rubis;
    }
    return rubis
}

function countTotalRubis()
{
    var count = 0
    for (var i = 0; i<battlefieldXSize; i++)
    {
        for (var j = 0; j<battlefieldYSize; j++)
        {
            count+=battlefield[i][j].rubis
        }
    }
    return count
}

function countTotalEmeralds()
{
    var count = 0
    for (var i = 0; i<battlefieldXSize; i++)
    {
        for (var j = 0; j<battlefieldYSize; j++)
        {
            count+=battlefield[i][j].emeralds
        }
    }
    return count
}

function countTotalSaphirs()
{
    var count = 0
    for (var i = 0; i<battlefieldXSize; i++)
    {
        for (var j = 0; j<battlefieldYSize; j++)
        {
            count+=battlefield[i][j].saphirs
        }
    }
    return count
}



function renderEvolution()
{
    if(started == 1){
        for (var i = 0; i<battlefieldXSize; i++)
        {
            for (var j = 0; j<battlefieldYSize; j++)
            {
                saphirs = countSaphirs(i,j)
                emeralds = countEmeralds(i,j)
                rubis = countRubis(i,j)
                // strong
                if(Math.random()<saphirs/(saphirs+rubis))
                {
                    if(battlefield[i][j].rubis>0)
                    {
                        battlefield[i][j].saphirs=Math.min(battlefield[i][j].saphirs+multiplier,2000)
                        battlefield[i][j].rubis=Math.max(battlefield[i][j].rubis-multiplier,0)
                    }
                }
                if(Math.random()<rubis/(rubis+emeralds))
                {
                    if(battlefield[i][j].emeralds>0)
                    {
                        battlefield[i][j].rubis=Math.min(battlefield[i][j].rubis+multiplier,2000)
                        battlefield[i][j].emeralds=Math.max(battlefield[i][j].emeralds-multiplier,0)
                    }
                }
                if(Math.random()<emeralds/(emeralds+saphirs))
                {
                    if(battlefield[i][j].saphirs>0)
                    {
                        battlefield[i][j].emeralds=Math.min(battlefield[i][j].emeralds+multiplier,2000)
                        battlefield[i][j].saphirs=Math.max(battlefield[i][j].saphirs-multiplier,0)
                    }
                }
                // weak
                if(Math.random()<rubis/(saphirs+rubis)/stw_ratio)
                {
                    if(battlefield[i][j].saphirs>0)
                    {
                        battlefield[i][j].rubis=Math.min(battlefield[i][j].rubis+multiplier,2000)
                        battlefield[i][j].saphirs=Math.max(battlefield[i][j].saphirs-multiplier,0)
                    }
                }
                if(Math.random()<emeralds/(rubis+emeralds)/stw_ratio)
                {
                    if(battlefield[i][j].rubis>0)
                    {
                        battlefield[i][j].emeralds=Math.min(battlefield[i][j].emeralds+multiplier,2000)
                        battlefield[i][j].rubis=Math.max(battlefield[i][j].rubis-multiplier,0)
                    }
                }
                if(Math.random()<saphirs/(emeralds+saphirs)/stw_ratio)
                {
                    if(battlefield[i][j].emeralds>0)
                    {
                        battlefield[i][j].saphirs=Math.min(battlefield[i][j].saphirs+multiplier,2000)
                        battlefield[i][j].emeralds=Math.max(battlefield[i][j].emeralds-multiplier,0)
                    }
                }
            }
        }
    }
}

function increment()
{
    tick++
    if (tick%100 == 0)
    {
        multiplier+=10
    }
}

function mainLoop()
{
    requestID = window.requestAnimationFrame(mainLoop);
    renderEvolution()
    affBattlefield();
    //increment()

}

function testLoop()
{
    var c = 0
    while(c!=10)
    {
        renderEvolution()
        if(countTotalSaphirs()==3000*21*21)
        {
            results.saphirs++
            c++
            console.log(results)
            battlefield = createBattlefield(21,21)
        }
        if(countTotalEmeralds()==3000*21*21)
        {
            results.emeralds++
            c++
            console.log(results)
            battlefield = createBattlefield(21,21)
        }
        if(countTotalRubis()==3000*21*21)
        {
            results.rubis++
            c++
            console.log(results)
            battlefield = createBattlefield(21,21)
        }
    }
}

function cursorUp()
{
cursor.coords.y--;
}

function cursorDown()
{
cursor.coords.y++;
}

function cursorLeft()
{
cursor.coords.x--;
}

function cursorRight()
{
cursor.coords.x++;
}

function checkKey(e) {
 
    e = e || window.event;

    if (e.keyCode == '38' && cursor.coords.y>0)
    {
        cursorUp();
    }
    else if (e.keyCode == '40' && cursor.coords.y<20)
    {
        cursorDown();
    }
    else if (e.keyCode == '37' && cursor.coords.x>0)
    {
        cursorLeft();
    }
    else if (e.keyCode == '39' && cursor.coords.x<20)
    {
        cursorRight();
    }
    else if (e.keyCode == '76')
    {
        started=1;
    }
    else if (e.keyCode == '32')
    {
        random = 1
    }
    else if (e.keyCode == '82')
    {
        if(random ==1)
        crux=cruxPool[Math.floor(Math.random()*cruxPool.length)]
        battlefield = createBattlefield(21,21)
    }
}

requestID = window.requestAnimationFrame(mainLoop);

