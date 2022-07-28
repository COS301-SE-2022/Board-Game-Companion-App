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
        0,
    ]

    placeCross ( t ) { let p = new piece() 
p . Id = -1 
t.pieces.push(p)
p.Tile=t

} 

    
placeCrossCond( t ) { let ans = false 
if ( t . pieces . length < 1 ) { 
ans = true 
} 
return ans } 


    params = []
    chooseAction(choice, p)
    {
        switch(choice)
        {
            case 0:
this.placeCross(p)
break

        }
        
        
    }
    isActionLegal(choice, p)
    {
        switch(choice)
        {
            case 0:
return this.placeCrossCond(p)
break

            
        }
        
        return false;
    }

    considerations(choice)
    {
        
        switch(choice)
        {
            case 0:
 return this.State.board
break

        }
        
        return [];
    }
    generateChoices()
    {
        this.params = []
        let choices =[]
        
        for(let i = 0;i<this.Actions.length;i++)
        {
            

            if(this.considerations(i) == [])
            {
                if(this.isActionLegal(i, []))
                {
                    choices.push(i)
                    this.params.push([])
                }
            }
            else
            {
                
                for(let j = 0;j<this.considerations(i).length;j++)
                {
                    
                    
                    if(this.isActionLegal(i, this.considerations(i)[j]))
                    {
                        choices.push(i)
                        this.params.push(this.considerations(i)[j])

                    }
                }
            }
        }
        
        return choices
    };turn ( ){ let x = new piece() 
let c = this.generateChoices ( ) 
console.log ( this . params [ 0 ] ) 
let p = this . params [ 0 ] 
this.chooseAction ( c [ 0 ] , p ) 
}} }//players



function console_Input(message)
{
    
    input = prompt(message);
    return input;
}

//
class script
{
    State = new game_state();
    players = [
        new p1(),//add players
    ];
    
    

    play()
    {

        
        console.log("script-execution begins");
        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].State = this.State
        }

        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].turn();
        }



    }


    


}
function endgame(State, players)
{
    let ans = true 
return ans //end_game


    
}
(new script()).play();