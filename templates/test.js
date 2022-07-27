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
class pieces
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

//State


        
        //tiles

        
    }
//state accessors
    getTileByID(id)
    {
        for(let i = 0; i<board.length;i++)
        {
            if(board[i].Id == id)
                return board[i]
        }
        return null
    }

    getTilesByType(type)
    {
        results = []
        for(let i = 0; i<board.length;i++)
        {
            if(board[i].Type == type)
                results.push(board[i])
        }
        return results
    }
}






class player
{
    State = new game_state();

    Actions = [
        //actionnums
    ]
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
                        if(this.isActionLegal(i, [j]))
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
        
        
    }


    turn()
    {
        //redefined in subclasses
    }
}
class p1 extends player { x = 1 ;turn ( ){ let message =  'enternum' 
this . x = console_Input( message ) 
console.log ( this . x ) 
let y = this.State.getTileByID(1)
console.log ( y . Id ) 
}} class p2 extends player { ;turn ( ){ console.log ( 2 ) 
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
        //
        State = new game_state()
        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].State = State
        }

        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].turn();
        }



    }
}

(new script()).play();