class cards
{
    parameters;
    activate()
    {
        //
    }
    canUse()
    {
        return true;
    }
}
//cards

class tile
{
    Name;//name for the tile identifier as string by default
    Id; //unique identifier for the tile 0 by default
    Type; //allows grouping of tyles by a type “” by default
    pieces = []; //array of pieces on this tile [] by default
    Adjacencies = []; //array of tiles adjacent to this tile [] by default
 
    //possibly functions to make the scripters life easier like:
    
}
class piece
{
    Id; //unique id for a piece 0 by default
    Type; //grouping information for the piece “” by default
    Player; //the player this piece belongs to
    Tile; //the tile this piece is on
    
}
class game_state
{
    board = []
    constructor()
    {
        
let t1 = new tile()

t1 . Id = 1 
let t2 = new tile()

t2 . Id = 2 
let t3 = new tile()

t3 . Id = 3 
let t4 = new tile()

t4 . Id = 4 
let t5 = new tile()

t5 . Id = 5 
let t6 = new tile()

t6 . Id = 6 
let t7 = new tile()

t7 . Id = 7 
let t8 = new tile()

t8 . Id = 8 
let t9 = new tile()

t9 . Id = 9 
//State


        
        this.board.push(t1)
this.board.push(t2)
this.board.push(t3)
this.board.push(t4)
this.board.push(t5)
this.board.push(t6)
this.board.push(t7)
this.board.push(t8)
this.board.push(t9)
//tiles

        
    }
//state accessors
    getTileByID(id)
    {
        for(let i = 0; i<this.board.length;i++)
        {
            if(this.board[i].Id == id)
                return this.board[i]
        }
        return null
    }

    getTilesByType(type)
    {
        results = []
        for(let i = 0; i<this.board.length;i++)
        {
            if(this.board[i].Type == type)
                results.push(this.board[i])
        }
        return results
    }
}






class player
{
    State = new game_state();
    chooseAction()
    {
        //
    }
    turn()
    {
        //redefined in subclasses
    }
}
class p1 extends player { 
    Actions = [
        0,0,//actionnums
    ]

    placeCross ( undefined ( t ) { ans = false if ( t . pieces < 1 ) { ans = true } return ans } 
placeNaughtCond( t ) { ans = false if ( t . pieces < 1 ) { ans = true } return ans } //actioncond
    params = []
    chooseAction(choice, p)
    {
        switch(choice)
        {
            case 0:
placeCross(p)
break
case 0:
placeNaught(p)
break
//action cases
        }
        
        
    }
    isActionLegal(choice, p)
    {
        switch(choice)
        {
            case 0:
return placeCrossCond(p)
break
case 0:
return placeNaughtCond(p)
break
//condition cases
            
        }
        
        return false;
    }

    considerations(choice)
    {
        switch(choice)
        {
            case 0:
this.State.board
break
case 0:
this.State.board
break
//considerations cases
        }
        
        return [];
    }
    generateChoices()
    {
        this.params = []
        choices =[]
        for(let i = 0;i<this.Actions;i++)
        {
            if(considerations(i) == [])
            {
                if(this.isActionLegal(i, []))
                {
                    choices.push(i)

                }
                else
                {
                    for(let j = 0;j<considerations(i);j++)
                    {
                        if(this.isActionLegal(i, considerations(i)[j]))
                        {
                            choices.push(i)

                        }
                    }
                }
            }
            else
            {

            }
        }
        
        
    }x = new piece() ;turn ( ){ c = generateChoices ( ) 
console.log ( c ) 
}} class p2 extends player { 
    Actions = [
        //actionnums
    ]

    placeNaught ( undefined //actioncond
    params = []
    chooseAction(choice, p)
    {
        switch(choice)
        {
            case 0:
            placeCross(p)
            break
            case 0:
            placeNaught(p//action cases
        }
        
        
    }
    isActionLegal(choice, p)
    {
        switch(choice)
        {
            case 0:
return placeCrossCond(p)
break
case 0:
return placeNaughtCond(p//condition cases
            
        }
        
        return false;
    }

    considerations(choice)
    {
        switch(choice)
        {
            case 0:
this.State.board
break
//considerations cases
        }
        
        return [];
    }
    generateChoices()
    {
        this.params = []
        choices =[]
        for(let i = 0;i<this.Actions;i++)
        {
            if(considerations(i) == [])
            {
                if(this.isActionLegal(i, []))
                {
                    choices.push(i)

                }
                else
                {
                    for(let j = 0;j<considerations(i);j++)
                    {
                        if(this.isActionLegal(i, considerations(i)[j]))
                        {
                            choices.push(i)

                        }
                    }
                }
            }
            else
            {

            }
        }
        
        
    }x = new piece() ;turn ( ){ c = generateChoices ( ) 
console.log ( c ) 
}} class p2 extends player { 
    Actions = [
        //actionnums
    ]

    placeNaught ( ) { p = new piece() 
p . Id = -1 
t.pieces.push(p)
p.Tile=undefined

} //actions

    //actioncond
    params = []
    chooseAction(choice, p)
    {
        switch(choice)
        {
            //action cases
        }
        
        
    }
    isActionLegal(choice, p)
    {
        switch(choice)
        {
            //condition cases
            
        }
        
        return false;
    }

    considerations(choice)
    {
        switch(choice)
        {
            //considerations cases
        }
        
        return [];
    }
    generateChoices()
    {
        this.params = []
        choices =[]
        for(let i = 0;i<this.Actions;i++)
        {
            if(considerations(i) == [])
            {
                if(this.isActionLegal(i, []))
                {
                    choices.push(i)

                }
                else
                {
                    for(let j = 0;j<considerations(i);j++)
                    {
                        if(this.isActionLegal(i, considerations(i)[j]))
                        {
                            choices.push(i)

                        }
                    }
                }
            }
            else
            {

            }
        }
        
        
    };turn ( ){ console.log ( 2 ) 
}} //players


//functions
function endgame()
{
    //end_game


}

function console_Input(message)
{
    
    input = prompt(message);
    return input;
}

//
class script
{
    game = new game_state();
    players = [
        new p1(),new p2(),//add players
    ];
    
    

    play()
    {

        
        console.log("script-execution begins");
        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].State = this.game
        }

        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].turn();
        }



    }
}

(new script()).play()) { p = new piece() 
p . Id = -1 
t.pieces.push(p)
p.Tile=undefined

} ;