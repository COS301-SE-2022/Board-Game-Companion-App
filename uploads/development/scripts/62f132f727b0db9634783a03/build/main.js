class cards
{
    name;
    //cardEffect

    //cardCondition
    
    async activate()
    {
        activate("")
    }
    async canUse()
    {
        canUse("")
    }
    async activate(parameters)
    {
        switch(this.name)
        {
            //cardActivation
        }
    }
    async canUse(parameters)
    {
        switch(this.name)
        {
            //cardUsable
        }
        return false;
    }
}
//cards

class tile
{
    Name = "";//name for the tile identifier as string by default
    Id = 0; //unique identifier for the tile 0 by default
    Type = ""; //allows grouping of tyles by a type “” by default
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

t1 . Id = " '1'"
let t2 = new tile()

t2 . Id = " '2'"
let t3 = new tile()

t3 . Id = " '3'"
let t4 = new tile()

t4 . Id = " '4'"
let t5 = new tile()

t5 . Id = " '5'"
let t6 = new tile()

t6 . Id = " '6'"
let t7 = new tile()

t7 . Id = " '7'"
let t8 = new tile()

t8 . Id = " '8'"
let t9 = new tile()

t9 . Id = " '9'"
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
    async getTileByID(id)
    {
        for(let i = 0; i<this.board.length;i++)
        {
            if(this.board[i].Id == id)
                return this.board[i]
        }
        return null
    }

    async getTilesByType(type)
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
    async chooseAction()
    {
        //
    }
    async turn()
    {
        //redefined in subclasses
    }
}
class crossAI extends player { 
    Actions = [
        "placeCross",
    ]

     async placeCross ( t ) { let p = new piece() 
p . Type = 0 
let message =  'The ai places a cross in' + t . Id 
await output( message ) 
t.pieces.push(p)
p.Tile=t

} 

    
async placeCrossCond( t ) { let ans = true 
if ( t . pieces . length == 1 ) { 
ans = false 
} 
return ans } 


    params = []
    async chooseAction(choice, p)
    {
        switch(choice)
        {
            case "placeCross":
await this.placeCross(p)
break

        }
        
        
    }
    async isActionLegal(choice, p)
    {
        switch(choice)
        {
            case "placeCross":
return await this.placeCrossCond(p)
break

            
        }
        
        return false;
    }

    async considerations(choice)
    {
        
        switch(choice)
        {
            case 0:
 return 
break

        }
        
        return [];
    }
    async generateChoices()
    {
        this.params = []
        let choices =[]
        
        for(let i = 0;i<this.Actions.length;i++)
        {
            

            if(await this.considerations(i) == [])
            {
                if(await this.isActionLegal(Actions[i], []))
                {
                    choices.push(Actions[i])
                    this.params.push([])
                }
            }
            else
            {
                
                for(let j = 0;j<await this.considerations(i).length;j++)
                {
                    
                    
                    if(await this.isActionLegal(Actions[i], await this.considerations(i)[j]))
                    {
                        choices.push(Actions[i])
                        this.params.push(await this.considerations(i)[j])

                    }
                }
            }
        }
        
        return choices
    };async turn ( ) { 
let c = await this.generateChoices ( ) 
await this.chooseAction ( c [ 0 ] , this . params [ 0 ] ) 
} } class naught extends player { 
    Actions = [
        "placeNaught",
    ]

     async placeNaught ( t ) { let p = new piece() 
p . Type = 1 
t.pieces.push(p)
p.Tile=t

} 

    
async placeNaughtCond( t ) { let ans = true 
if ( t . pieces . length == 1 ) { 
ans = false 
} 
return ans } 


    params = []
    async chooseAction(choice, p)
    {
        switch(choice)
        {
            case "placeNaught":
await this.placeNaught(p)
break

        }
        
        
    }
    async isActionLegal(choice, p)
    {
        switch(choice)
        {
            case "placeNaught":
return await this.placeNaughtCond(p)
break

            
        }
        
        return false;
    }

    async considerations(choice)
    {
        
        switch(choice)
        {
            case 0:
 return 
break

        }
        
        return [];
    }
    async generateChoices()
    {
        this.params = []
        let choices =[]
        
        for(let i = 0;i<this.Actions.length;i++)
        {
            

            if(await this.considerations(i) == [])
            {
                if(await this.isActionLegal(Actions[i], []))
                {
                    choices.push(Actions[i])
                    this.params.push([])
                }
            }
            else
            {
                
                for(let j = 0;j<await this.considerations(i).length;j++)
                {
                    
                    
                    if(await this.isActionLegal(Actions[i], await this.considerations(i)[j]))
                    {
                        choices.push(Actions[i])
                        this.params.push(await this.considerations(i)[j])

                    }
                }
            }
        }
        
        return choices
    };async turn ( ) { 
let prompt =  'where will you place the naught' 
let ans = false 
do { 
let i = await input( prompt ,  'text' ) 
let t = await this.State.getTileByID(i)
ans = await this.isActionLegal ( 0 , t ) 
} while ( ! ( ans ) ) 
} } //players



//
class script
{
    State = new game_state();
    players = [
        new crossAI(),new naught(),//add players
    ];
    


    async play()
    {

        
        //console.log("script-execution begins");
            
        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].State = this.State
        }
        //get player turn order
        let order = []
        //let inputElement = document.getElementById("TextOutput");
        
        for(let i =0;i< this.players.length;i++)
        {
            //if(inputElement)
            //{
                //ask using input and output methods
                order.push(await input("when will player "+this.players[i].constructor.name + " move"), "text")
            //}
            //else
            //{
                //use default order
                //order.push(i)
            //}
        }
        //re order 
        for(let i =0;i< this.players.length;i++)
        {
            for(let j =1;j< this.players.length;j++)
            {
                if(order[i]> order[j])
                {
                    let temp = order[i]
                    let tempP = this.players[i]

                    order[i] = order[j]
                    this.players[i] = this.players[j]

                    order[j] = temp
                    this.players[j] = tempP
                }
            }
        }
        do
        {
            for(let i =0;i< this.players.length && !await this.endgame();i++)
            {
                await this.players[i].turn();
            }
        }
        while(!await this.endgame())

        
    }
    
    async endgame()
    {
        let ans = false 
let t1 = await this.State.getTileByID(1)
let t2 = await this.State.getTileByID(2)
let t3 = await this.State.getTileByID(3)
let t3 = await this.State.getTileByID(4)
let t3 = await this.State.getTileByID(5)
let t3 = await this.State.getTileByID(6)
let t3 = await this.State.getTileByID(7)
let t3 = await this.State.getTileByID(8)
let t3 = await this.State.getTileByID(9)
return ans 
//end_game
    
    
        return false
    }
    


}

(new script()).play();