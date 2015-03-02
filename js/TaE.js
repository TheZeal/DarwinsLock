var SIZEOFBOARD = 840

var c=document.getElementById("board");
var ctx=c.getContext("2d");

var battlefieldXSize = 21;
var battlefieldYSize = 21;
var unitSelected = -1;
document.onkeydown = checkKey;

var started = 0
var testmode = 0
var tick = 0;
var random = 0

function drawSquare(x,y,size,color)
{
    ctx.beginPath();
    ctx.rect(x*40+(40-size)/2,y*40+(40-size)/2,size,size);
    ctx.fillStyle=color;
    ctx.fill();
}

var cursor =
{
    coords :
    {
        x:15,
        y:5
    },
}
var battlefield = createBattlefield(21,21)
var fooBattlefield = createBattlefield(21,21)

var defs = 
{
    slug : function(x,y)
    {
        fooBattlefield[x][y].held = {
            drawingMethod : function()
            {
                drawSquare(x,y,28,"green")
            },
            action : function()
            {
                if(battlefield[x][y].held.tick===0)
                {
                    fooBattlefield[x][y].held = 0
                    defs.slug((x+Math.floor(Math.random()*3-1)+21)%21,(y+Math.floor(Math.random()*3-1)+21)%21)
                    if(Math.random()<0.1)
                        defs.slug(x,y)
                }
                else
                    fooBattlefield[x][y].held.tick--
            },
            tick : 4
        }
    },
    salt : function(x,y)
    {
        fooBattlefield[x][y].held = {
            drawingMethod : function()
            {
                drawSquare(x,y,28,"red")
            },
            action : function()
            {
                if(battlefield[x][y].held.tick===0)
                {
                    fooBattlefield[x][y].held = 0
                    defs.salt((x+Math.floor(Math.random()*3-1)+21)%21,(y+Math.floor(Math.random()*3-1)+21)%21)
                    if(Math.random()<0.05)
                        defs.salt(x,y)
                }
                else
                    fooBattlefield[x][y].held.tick--
            },
            tick : 2
        }
    },
    turtle : function(x,y)
    {
        fooBattlefield[x][y].held = {
            drawingMethod : function()
            {
                drawSquare(x,y,40,"blue")
            },
            action : function()
            {
                if(battlefield[x][y].held.tick===0)
                {
                    fooBattlefield[x][y].held = 0
                    defs.turtle((x+Math.floor(Math.random()*3-1)+21)%21,(y+Math.floor(Math.random()*3-1)+21)%21)
                    defs.turtle(x,y)
                }
                else
                    fooBattlefield[x][y].held.tick--
            },
            tick : 1
        }
    },
    whale : function(x,y)
    {
        fooBattlefield[x][y].held = {
            drawingMethod : function()
            {
                drawSquare(x,y,40,"yellow")
            },
            action : function()
            {
                if(battlefield[x][y].held.tick===1)
                {
                    switch(battlefield[x][y].held.turn)
                    {
                        case 1:
                        {
                            fooBattlefield[x][y].held = 0
                            defs.whale((x+23)%21,y)
                            //defs.whale((x+42)%21,y)
                            fooBattlefield[(x+23)%21][y].held.turn = 2
                            break;
                        }
                        case 2:
                        {
                            fooBattlefield[x][y].held = 0
                            defs.whale(x,(y+22)%21)
                            defs.whale(x,y)
                            break;
                        }
                    }
                }
                else //Try removing that
                fooBattlefield[x][y].held.tick--
            },  
            turn : 1,
            tick : 5,
        }
    },
}

// HERE IS HOW YOU SHOULD DO THIS
// FIRST PUT ARRAYS WITH INSTRUCTIONS SUCH AS :
// MOVE FORWARD | DESTROY FORWARD (PUT 1 VOID COIN IN A CASE) | TURN LEFT/RIGHT
// PUT DNA IN ARRAYS OF INSTRUCTIONS
// EACH REPRESENTANTS OF ANY SPECIE WILL BE PUT IN AN ARRAY WITH BASIC STATE :
// POS AND INSTRUCTION NUMBER. (REP CAPPED TO 100 ON A CASE.)
// EACH ACTION IS SIMULTANEOUS
// RESOLUTION IS BRUTAL (YEAH...?)

// RULES : 
// MOVING TO A PREVIOUSLY OCCUPED CASE BY AN ENEMY DESTROYS YOU.
// SPAWN A DESCENDANT AND IT WILL HATCH 2 TURNS AFTER
// ORIENTATION IS CONSERVED THROUGH DESCENDANT SPAWN
// DESTROYING A CASE REMOVES 1 OF EACH OPPONENTS, THE ONE WITH THE HIGHER TURN NUMBER
// SHOULD BE ALL

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
        if(fx<0 || fx>20 || fy<0 || fy>20)
        {
            fx = x
            fy = y
        }
        else if(battlefield[fx][fy].held)
        {
            fx = x
            fy = y
        }
        else if(fooBattlefield[fx][fy].held)
        {
            fooBattlefield[fx][fy].held=0
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
        if(!fooBattlefield[x][y].egg)
        {
            fooBattlefield[x][y].egg = 
            {
                orientation : battlefield[x][y].held.orientation,
                elements : battlefield[x][y].held.elements,
                phase : 2,
                color : battlefield[x][y].held.color
            }
        }
        else
        {
            fooBattlefield[x][y].egg = 0
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
            fooBattlefield[fx][fy].destroyToken = 
            {
                color : battlefield[x][y].held.color
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
tab=[["lay","advance","destroy","turnLeft"],["lay","advance","destroy","turnLeft"]]
pool = ["advance","destroy","lay","turnLeft"]
battlefield[2][2].held = {orientation:"down",elements:tab[0],phase : 0,color:"yellow"}
battlefield[18][18].held = {orientation:"up",elements:tab[1],phase : 0,color:"red"}
best=[[["lay","advance","destroy","turnLeft"]],[["lay","advance","destroy","turnLeft"]]]

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
            drawSquare(i,j,38,"white")
            //console.log(i,j)
            if(battlefield[i][j].held)
            {
                drawSquare(i,j,38,battlefield[i][j].held.color)
            }
        }
    }

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
                    }
                }
            }
        }
        replaceFoo()
        tick++
    }
}
var oldTime
var tick = 0;
var animated = 1
var time = new Date()
var wayToGo = 1

function mainLoop()
{
    requestID = window.requestAnimationFrame(mainLoop);
    renderEvolution()
    affBattlefield();
    if(tick===250)
    {
        path = Math.floor(Math.random()*3)
        winner = giveWinner()
        for(var i=0;i!=2;i++)
        {
            if(winner!=i)
            {
                pos = Math.floor(Math.random()*(tab[i].length+1))
                extracted = Math.floor(Math.random()*(pool.length))
                tab[i].splice(pos,i,pool[extracted])
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
        battlefield = createBattlefield(21,21)
    }
}

requestID = window.requestAnimationFrame(mainLoop);

