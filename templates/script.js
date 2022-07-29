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
        //State


        
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
//players

function output(message)
{
    let el = document.getElementById("TextOutput");
    if(el)
    {
        el.innerHTML+= '<div>'+message+'</div>'
    }
    else
    {
        console.log(message)
    }
    
}

function input(message)
{
    
    output(message)
	hiddenValue = false;

    let inputElement = document.getElementById("inputBox");
    let button = document.getElementById("EnterButton");

    if(inputElement)
    {
        
        
        return hiddenInputValue

    }
    else
    {
        return console_Input(message)
    }
    
}
function console_Input(message)
{
    
    i = prompt(message);
    return i;
}

//
class script
{
    State = new game_state();
    players = [
        //add players
    ];
    
    

    play()
    {

        
        console.log("script-execution begins");
        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].State = this.State
        }
        //get player turn order
        let order = []
        let inputElement = document.getElementById("TextOutput");
        
        for(let i =0;i< this.players.length;i++)
        {
            if(inputElement)
            {
                //ask using input and output methods
            }
            else
            {
                //use default order
                order.push(i)
            }
        }
        //re order 
        for(let i =0;i< this.players.length;i++)
        {
            for(let j =1;j< this.players.length;j++)
            {
                if(order[i]> order[j])
                {
                    let temp = order[i]
                    let tempP = players[i]

                    order[i] = order[j]
                    players[i] = players[j]

                    order[j] = temp
                    order[j] = tempP
                }
            }
        }
        do
        {
            for(let i =0;i< this.players.length && !this.endgame();i++)
            {
                this.players[i].turn();
            }
        }
        while(!this.endgame())


    }

    endgame()
    {
        //end_game
    
    
        return false
    }
    


}

(new script()).play();