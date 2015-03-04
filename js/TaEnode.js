var SIZEOFBOARD = 840


var battlefieldXSize = 21;
var battlefieldYSize = 21;
var unitSelected = -1;

var started = 1
var testmode = 0
var tick = 0;
var random = 0


var battlefield = createBattlefield(21,21)
var fooBattlefield = createBattlefield(21,21)

instructions = 
{
    advance : function(x,y)
    {
        var fx;
        var fy;
        switch(battlefield[x][y].held.orientation)
        {
            case "left" : 
            {
                fx = x-1
                fy = y
                break
            }
            case "right" : 
            {
                fx = x+1
                fy = y
                break
            }

            case "up" : 
            {
                fx = x
                fy = y-1
                break
            }

            case "down" : 
            {
                fx = x
                fy = y+1
                break
            }
        }
        if(fx<0 || fx>20 || fy<0 || fy>20 || battlefield[fx][fy].held)
        {
            fx = x
            fy = y
        }
        if(fooBattlefield[fx][fy].held)
        {
            fooBattlefield[fx][fy].held="no"
        }
        else
        {
            fooBattlefield[fx][fy].held = 
            {
                orientation : battlefield[x][y].held.orientation,
                elements : battlefield[x][y].held.elements,
                phase : (battlefield[x][y].held.phase+1)%battlefield[x][y].held.elements.length,
                color : battlefield[x][y].held.color
            }
        }
    },
    turnLeft : function(x,y)
    {
        var nOr
        switch(battlefield[x][y].held.orientation)
        {
            case "left" : 
            {
                nOr="down"
                break
            }
            case "right" : 
            {
                nOr="up"
                break
            }

            case "up" : 
            {
                nOr="left"
                break
            }

            case "down" : 
            {
                nOr="right"
                break
            }
        }
        fooBattlefield[x][y].held = 
        {
            orientation : nOr,
            elements : battlefield[x][y].held.elements,
            phase : (battlefield[x][y].held.phase+1)%battlefield[x][y].held.elements.length,
            color : battlefield[x][y].held.color
        }

    },
    turnRight : function(x,y)
    {
        var nOr
        switch(battlefield[x][y].held.orientation)
        {
            case "left" : 
            {
                nOr="up"
                break
            }
            case "right" : 
            {
                nOr="down"
                break
            }

            case "up" : 
            {
                nOr="right"
                break
            }

            case "down" : 
            {
                nOr="left"
                break
            }
        }
        fooBattlefield[x][y].held = 
        {
            orientation : nOr,
            elements : battlefield[x][y].held.elements,
            phase : (battlefield[x][y].held.phase+1)%battlefield[x][y].held.elements.length,
            color : battlefield[x][y].held.color
        }

    },
    lay : function(x,y)
    {
        fooBattlefield[x][y].held = 
        {
            orientation : battlefield[x][y].held.orientation,
            elements : battlefield[x][y].held.elements,
            phase : (battlefield[x][y].held.phase+1)%battlefield[x][y].held.elements.length,
            color : battlefield[x][y].held.color
        }
        fooBattlefield[x][y].egg = 
        {
            orientation : battlefield[x][y].held.orientation,
            elements : battlefield[x][y].held.elements,
            phase : 2,
            color : battlefield[x][y].held.color
        }
    },
    eggWait : function(x,y)
    {
        fooBattlefield[x][y].egg = 
        {
            orientation : battlefield[x][y].egg.orientation,
            elements : battlefield[x][y].egg.elements,
            phase : battlefield[x][y].egg.phase-1,
            color : battlefield[x][y].egg.color
        }
    },
    hatch : function(x,y)
    {
        fooBattlefield[x][y].held = 
        {
            orientation : battlefield[x][y].egg.orientation,
            elements : battlefield[x][y].egg.elements,
            phase : 0,
            color : battlefield[x][y].egg.color
        }
        fooBattlefield[x][y].egg = 0
    },
    destroy : function(x,y)
    {
        var fx;
        var fy;
        switch(battlefield[x][y].held.orientation)
        {
            case "left" : 
            {
                fx = x-1
                fy = y
                break
            }
            case "right" : 
            {
                fx = x+1
                fy = y
                break
            }

            case "up" : 
            {
                fx = x
                fy = y-1
                break
            }

            case "down" : 
            {
                fx = x
                fy = y+1
                break
            }
        }
        if(fx>=0 && fx<=20 && fy>=0 && fy<=20)
        {
            if(fooBattlefield[fx][fy].destroyToken)
            {
                if(fooBattlefield[fx][fy].destroyToken.color!=battlefield[x][y].held.color)
                {
                    fooBattlefield[fx][fy].destroyToken = 
                    {
                        color : "_voidColor"
                    }
                }
            }
            else
            {
                fooBattlefield[fx][fy].destroyToken = 
                {
                    color : battlefield[x][y].held.color
                }
            }
        }
        fooBattlefield[x][y].held = 
        {
            orientation : battlefield[x][y].held.orientation,
            elements : battlefield[x][y].held.elements,
            phase : (battlefield[x][y].held.phase+1)%battlefield[x][y].held.elements.length,
            color : battlefield[x][y].held.color
        }
    },
}
tab=[[],[]]
pool = ["advance","destroy","lay","turnLeft"]
tab[0]=["turnLeft","lay","destroy","advance","destroy","lay","destroy","advance","advance","lay","destroy","lay","advance","destroy","advance","lay","advance","destroy","advance","turnLeft","advance","turnLeft","lay","advance","lay","advance","destroy","destroy","turnLeft","lay","advance","advance","lay","advance","lay","destroy","turnLeft","destroy","turnLeft","turnLeft","destroy","advance","advance","destroy","advance","destroy","destroy","turnLeft","lay","turnLeft","turnLeft","destroy","turnLeft","lay","destroy","lay","advance","destroy","turnLeft","advance","turnLeft","turnLeft","advance","lay","turnLeft","destroy","advance","destroy","destroy","advance","turnLeft","destroy","turnLeft","advance","destroy","lay","destroy","turnLeft","turnLeft","turnLeft","turnLeft","destroy","turnLeft","turnLeft","lay","destroy","lay","destroy","advance","lay","lay","advance","lay","destroy","destroy","destroy","turnLeft","advance","destroy","turnLeft","advance","turnLeft","lay","advance","advance","advance","lay","lay","lay","advance","lay","advance","advance","advance","lay","destroy","advance","advance","advance","lay","lay","advance","lay","turnLeft","advance","lay","lay","destroy","destroy","turnLeft","advance","destroy","destroy","destroy","turnLeft","advance","advance","advance","destroy","advance","turnLeft","advance","lay","turnLeft","destroy","advance","turnLeft","lay","destroy","advance","turnLeft","lay","turnLeft","lay","advance","destroy","lay","turnLeft","advance","advance","turnLeft","destroy","lay","destroy"]
tab[1]=["turnLeft","lay","destroy","advance","destroy","lay","destroy","advance","advance","lay","destroy","lay","advance","destroy","advance","lay","advance","destroy","advance","turnLeft","advance","turnLeft","lay","advance","lay","advance","destroy","destroy","turnLeft","lay","advance","advance","lay","advance","lay","destroy","turnLeft","destroy","turnLeft","turnLeft","destroy","advance","advance","destroy","advance","destroy","destroy","turnLeft","lay","turnLeft","turnLeft","destroy","turnLeft","lay","destroy","lay","advance","destroy","turnLeft","advance","turnLeft","turnLeft","advance","lay","turnLeft","destroy","advance","destroy","destroy","advance","turnLeft","destroy","turnLeft","advance","destroy","lay","destroy","turnLeft","turnLeft","turnLeft","turnLeft","destroy","turnLeft","turnLeft","lay","destroy","lay","destroy","advance","lay","lay","advance","lay","destroy","destroy","destroy","turnLeft","advance","destroy","turnLeft","advance","turnLeft","lay","advance","advance","advance","lay","lay","lay","advance","lay","advance","advance","advance","lay","destroy","advance","advance","advance","lay","lay","advance","lay","turnLeft","advance","lay","lay","destroy","destroy","turnLeft","advance","destroy","destroy","destroy","turnLeft","advance","advance","advance","destroy","advance","turnLeft","advance","lay","turnLeft","destroy","advance","turnLeft","lay","destroy","advance","turnLeft","lay","turnLeft","lay","advance","destroy","lay","turnLeft","advance","advance","turnLeft","destroy","lay","destroy"]
battlefield[2][2].held = {orientation:"down",elements:tab[0],phase : 0,color:"yellow"}
battlefield[18][18].held = {orientation:"up",elements:tab[1],phase : 0,color:"red"}
best=[[["lay","advance","destroy","turnLeft"]],[["lay","advance","destroy","turnLeft"]]]
// coool : [ "turnLeft", "lay", "advance", "destroy", "lay", "advance", "turnLeft", "advance", "advance" ]
// ["lay","turnLeft","advance","lay","destroy","advance","advance","destroy","lay","advance","destroy","turnLeft","advance","advance","destroy","turnLeft","turnLeft"]


function replaceFoo()
{
//    battlefield=JSON.parse(JSON.stringify(fooBattlefield))
    battlefield = fooBattlefield;
    fooBattlefield = createBattlefield(21,21);
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
                            held : 0,
                            egg : 0,
                            destroyToken : 0
                        }
        }
    }
    return map;
}

function renderEvolution()
{
    if(started === 1){
        for (var i = 0; i<battlefieldXSize; i++)
        {
            for (var j = 0; j<battlefieldYSize; j++)
            {
                if(battlefield[i][j].held)
                    instructions[battlefield[i][j].held.elements[battlefield[i][j].held.phase]](i,j)
            }
        }
        for (var i = 0; i<battlefieldXSize; i++)
        {
            for (var j = 0; j<battlefieldYSize; j++)
            {        
                if(battlefield[i][j].egg)
                {
                    if(battlefield[i][j].egg.phase===0)
                    {
                        instructions.hatch(i,j)
                    }
                    else
                    {
                        instructions.eggWait(i,j)
                    }
                }
            }
        }
        for (var i = 0; i<battlefieldXSize; i++)
        {
            for (var j = 0; j<battlefieldYSize; j++)
            {        
                if(fooBattlefield[i][j].destroyToken && fooBattlefield[i][j].held)
                {
                    if(fooBattlefield[i][j].destroyToken.color!==fooBattlefield[i][j].held.color)
                    {

                        fooBattlefield[i][j].held = 0
                        fooBattlefield[i][j].egg = 0
                    }
                }
            }
        }
        for (var i = 0; i<battlefieldXSize; i++)
        {
            for (var j = 0; j<battlefieldYSize; j++)
            {        
                if(fooBattlefield[i][j].held==="no")
                {
                    fooBattlefield[i][j].held = 0
                }
            }
        }
        replaceFoo()
        tick++
    }
}
var tick = 0;
var animated = 1
var wayToGo = 1
var previousWinner = 0
var wins = 0
function mainLoop()
{
    renderEvolution()
    if(tick===500)
    {
        path = Math.floor(Math.random()*3)
        winner = giveWinner()
        if(previousWinner!=winner && winner!=2)
        {
            previousWinner = winner
            console.log(JSON.stringify(tab[winner]))
            console.log("Player " + winner + " ended a " + wins + " win streak.\n")
            wins = 0
        }
        wins ++
        if(wins>100)
        {
            wins = 0
            tab[1-winner]=JSON.parse(JSON.stringify(tab[winner]))
            console.log("Restarted player "+(1-winner)+"\n")
        }
        for(var i=0;i!=2;i++)
        {
            if(winner!=i)
            {
                if(path===0)
                {
                    pos = Math.floor(Math.random()*(tab[i].length+1))
                    extracted = Math.floor(Math.random()*(pool.length))
                    tab[i].splice(pos,0,pool[extracted])
                }
                if(path===1 && tab[i].length>1)
                {
                    pos = Math.floor(Math.random()*(tab[i].length+1))
                    tab[i].splice(pos,1)
                }
                if(path===2)
                {
                    pos = Math.floor(Math.random()*(tab[i].length+1))
                    extracted = Math.floor(Math.random()*(pool.length))
                    tab[i].splice(pos,1,pool[extracted])
                }
            }
        }
        tick = 0
        battlefield=createBattlefield(21,21)
        battlefield[2][2].held = {orientation:"down",elements:tab[0],phase : 0,color:"yellow"}
        battlefield[18][18].held = {orientation:"up",elements:tab[1],phase : 0,color:"red"}
    }
}

function giveWinner()
{
    var cr=0;
    var cy=0;
    for (var i = 0; i<battlefieldXSize; i++)
    {
        for (var j = 0; j<battlefieldYSize; j++)
        { 
            if(battlefield[i][j].held)
            {
                if(battlefield[i][j].held.color=="red")
                    cr++
                else
                    cy++
            }
        }
    }
    if(cy>cr)
        return 0
    else if(cr>cy)
        return 1
    return 2
}
while(1){
mainLoop()
}
