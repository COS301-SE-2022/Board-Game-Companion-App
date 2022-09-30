class cards
{
    name = "";
    State = null
    constructor(n)
    {
        this.name = n;
    }
    async getOutOfJail(parameters){await output( 'get out of jail card used') 
p . jailCounter = 0 
}
async goToClifton(parameters){await output( p . name + ' has been moved to clifton') 
let clifton = await this.State.getTileByID('40')
movePiece ( this . p , clifton ) 
}
async taxes(parameters){p . money = p . money - 1000 
await output( p . p . name + ' has been hit by taxes and lost R1000') 
}
//cardEffect
    
    async getOutOfJail(parameters){let ans = false 
if ( p . Tile . type == '"jail"') { 
ans = true 
} 
}
async goToClifton(parameters){return true }
async taxes(parameters){return true }
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
            case "getOutOfJail":
 awaitgetOutOfJail(parameters)
case "goToClifton":
 awaitgoToClifton(parameters)
case "taxes":
 awaittaxes(parameters)
//cardActivation
        }
    }
    async canUse(parameters)
    {
        switch(this.name)
        {
            case "getOutOfJail":
 awaitgetOutOfJail(parameters)
case "goToClifton":
 awaitgoToClifton(parameters)
case "taxes":
 awaittaxes(parameters)
//cardUsable
        }
        return false;
    }

    async getPlayer(s)
    {
        let i = await indexOfPlayer(s)
        return this.State.players[i]
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
 
    Price = 0 
rent = 0 
owner = null 
houseprice = 0 
housemodifier = [ ] 
housecost = 0 
numhouses = 0 
//tile properties
    async removePiece(p)
    {
        const index = this.pieces.indexOf(p);
        if (index > -1) 
        { 
            this.pieces.splice(index, 1); 
        }
    }
}
class piece
{
    Id; //unique id for a piece 0 by default
    Type; //grouping information for the piece “” by default
    Player; //the player this piece belongs to
    Tile; //the tile this piece is on
    
}

async function movePiece(p, t)
{
    await p.Tile.removePiece(p)
    p.Tile = t
    t.pieces.push(p)
}


class game_state
{
    board = []
    players = [
        
    ]
    constructor()
    {
        
for(let i=1;i<=40 ;i++){
this.Board[i-1]=new tile()
this.Board[i-1].Id =i+''
}

b = getBoard ( ) 
b [ 0 ] . name = 'Go'
b [ 0 ] . type = 'start'
b [ 1 ] . name = 'westville'
b [ 1 ] . type = 'unowned'
b [ 1 ] . Price = 6000 
b [ 1 ] . rent = 200 
b [ 1 ] . housemodifier = [ 1000 , 3000 , 9000 , 25000 ] 
b [ 1 ] . housecost = 5000 
b [ 2 ] . name = 'community chest'
b [ 2 ] . type = 'chest'
b [ 3 ] . name = 'Amanzimtoti'
b [ 3 ] . type = 'unowned'
b [ 3 ] . Price = 6000 
b [ 3 ] . rent = 400 
b [ 3 ] . housemodifier = [ 2000 , 6000 , 18000 , 32000 ] 
b [ 3 ] . housecost = 5000 
b [ 4 ] . name = 'income tax'
b [ 4 ] . type = 'tax'
b [ 4 ] . Price = 20000 
b [ 5 ] . name = 'Durban Airport'
b [ 5 ] . type = 'airport'
b [ 5 ] . Price = 20000 
b [ 5 ] . rent = 2500 
b [ 5 ] . housecost = 5000 
b [ 6 ] . name = 'Umhlanga Rocks'
b [ 6 ] . type = 'unowned'
b [ 6 ] . Price = 10000 
b [ 6 ] . rent = 600 
b [ 6 ] . housemodifier = [ 3000 , 9000 , 27000 , 40000 ] 
b [ 6 ] . housecost = 5000 
b [ 7 ] . name = 'Chance'
b [ 7 ] . type = 'chance'
b [ 8 ] . name = 'Ballito Bay'
b [ 8 ] . type = 'unowned'
b [ 8 ] . Price = 10000 
b [ 8 ] . rent = 600 
b [ 8 ] . housemodifier = [ 3000 , 9000 , 27000 , 40000 ] 
b [ 8 ] . housecost = 5000 
b [ 9 ] . name = 'La Lucia'
b [ 9 ] . type = 'unowned'
b [ 9 ] . Price = 12000 
b [ 9 ] . rent = 800 
b [ 9 ] . housemodifier = [ 4000 , 10000 , 30000 , 45000 ] 
b [ 9 ] . housecost = 6000 
b [ 10 ] . name = 'Jail'
b [ 10 ] . type = 'jail'
b [ 11 ] . name = 'Port Elizabeth'
b [ 11 ] . type = 'unowned'
b [ 11 ] . Price = 14000 
b [ 11 ] . rent = 1000 
b [ 11 ] . housemodifier = [ 5000 , 15000 , 45000 , 62500 ] 
b [ 11 ] . housecost = 7000 
b [ 12 ] . name = 'Electricity'
b [ 12 ] . type = 'utility'
b [ 12 ] . Price = 15000 
b [ 12 ] . rent = 100 
b [ 13 ] . name = 'Menlyn Park'
b [ 13 ] . type = 'unowned'
b [ 13 ] . Price = 14000 
b [ 13 ] . rent = 1000 
b [ 13 ] . housemodifier = [ 5000 , 15000 , 45000 , 62500 ] 
b [ 13 ] . housecost = 7000 
b [ 14 ] . name = 'Waterkloof'
b [ 14 ] . type = 'unowned'
b [ 14 ] . Price = 16000 
b [ 14 ] . rent = 1200 
b [ 14 ] . housemodifier = [ 6000 , 18000 , 50000 , 70000 ] 
b [ 14 ] . housecost = 8000 
b [ 15 ] . name = 'Bloemfontein Airport'
b [ 15 ] . type = 'airport'
b [ 15 ] . Price = 20000 
b [ 15 ] . rent = 2500 
b [ 16 ] . name = 'Wilderness'
b [ 16 ] . type = 'unowned'
b [ 16 ] . Price = 18000 
b [ 16 ] . rent = 1400 
b [ 16 ] . housemodifier = [ 7000 , 20000 , 55000 , 75000 ] 
b [ 16 ] . housecost = 9000 
b [ 17 ] . name = 'community chest'
b [ 17 ] . type = 'chest'
b [ 18 ] . name = 'Knysna'
b [ 18 ] . type = 'unowned'
b [ 18 ] . Price = 18000 
b [ 18 ] . rent = 1400 
b [ 18 ] . housemodifier = [ 7000 , 20000 , 55000 , 75000 ] 
b [ 18 ] . housecost = 9000 
b [ 19 ] . name = 'PlettenBerg Bay'
b [ 19 ] . type = 'unowned'
b [ 19 ] . Price = 20000 
b [ 19 ] . rent = 1600 
b [ 19 ] . housemodifier = [ 8000 , 22000 , 60000 , 80000 ] 
b [ 19 ] . housecost = 10000 
b [ 20 ] . name = 'Free Parking'
b [ 20 ] . type = 'nothing'
b [ 21 ] . name = 'Hillbrow'
b [ 21 ] . type = 'unowned'
b [ 21 ] . Price = 22000 
b [ 21 ] . rent = 1800 
b [ 21 ] . housemodifier = [ 9000 , 25000 , 70000 , 87500 ] 
b [ 21 ] . housecost = 11000 
b [ 22 ] . name = 'Chance'
b [ 22 ] . type = 'chance'
b [ 23 ] . name = 'Soweto'
b [ 23 ] . type = 'unowned'
b [ 23 ] . Price = 22000 
b [ 23 ] . rent = 1800 
b [ 23 ] . housemodifier = [ 9000 , 25000 , 70000 , 87500 ] 
b [ 23 ] . housecost = 11000 
b [ 24 ] . name = 'Boksburg'
b [ 24 ] . type = 'unowned'
b [ 24 ] . Price = 24000 
b [ 24 ] . rent = 2000 
b [ 24 ] . housemodifier = [ 10000 , 30000 , 75000 , 92500 ] 
b [ 24 ] . housecost = 12000 
b [ 25 ] . name = 'Johannesburg Airport'
b [ 25 ] . type = 'airport'
b [ 25 ] . Price = 20000 
b [ 25 ] . rent = 2500 
b [ 26 ] . name = 'Randburg'
b [ 26 ] . type = 'unowned'
b [ 26 ] . Price = 26000 
b [ 26 ] . rent = 2200 
b [ 26 ] . housemodifier = [ 11000 , 33000 , 80000 , 97500 ] 
b [ 26 ] . housecost = 13000 
b [ 27 ] . name = 'Sandton'
b [ 27 ] . type = 'unowned'
b [ 27 ] . Price = 26000 
b [ 27 ] . rent = 2200 
b [ 27 ] . housemodifier = [ 11000 , 33000 , 80000 , 97500 ] 
b [ 27 ] . housecost = 13000 
b [ 28 ] . name = 'Water Board'
b [ 28 ] . type = 'utility'
b [ 28 ] . Price = 15000 
b [ 28 ] . rent = 100 
b [ 29 ] . name = 'Hyde Park'
b [ 29 ] . type = 'unowned'
b [ 29 ] . Price = 28000 
b [ 29 ] . rent = 2400 
b [ 29 ] . housemodifier = [ 12000 , 36000 , 85000 , 102500 ] 
b [ 29 ] . housecost = 15000 
b [ 30 ] . name = 'To Jail'
b [ 30 ] . type = 'to jail'
b [ 31 ] . name = 'Mitchell plains'
b [ 31 ] . type = 'unowned'
b [ 31 ] . Price = 30000 
b [ 31 ] . rent = 2600 
b [ 31 ] . housemodifier = [ 13000 , 39000 , 90000 , 110000 ] 
b [ 31 ] . housecost = 20000 
b [ 32 ] . name = 'Tygervallei'
b [ 32 ] . type = 'unowned'
b [ 32 ] . Price = 30000 
b [ 32 ] . rent = 2600 
b [ 32 ] . housemodifier = [ 13000 , 39000 , 90000 , 110000 ] 
b [ 32 ] . housecost = 20000 
b [ 33 ] . name = 'community chest'
b [ 33 ] . type = 'chest'
b [ 34 ] . name = 'Blouberg Strand'
b [ 34 ] . type = 'unowned'
b [ 34 ] . Price = 32000 
b [ 34 ] . rent = 2800 
b [ 34 ] . housemodifier = [ 15000 , 45000 , 100000 , 120000 ] 
b [ 34 ] . housecost = 20000 
b [ 35 ] . name = 'Cape Town Airport'
b [ 35 ] . type = 'airport'
b [ 35 ] . Price = 20000 
b [ 35 ] . rent = 2500 
b [ 36 ] . name = 'Chance'
b [ 36 ] . type = 'chance'
b [ 37 ] . name = 'Franchhoek'
b [ 37 ] . type = 'unowned'
b [ 37 ] . Price = 35000 
b [ 37 ] . rent = 3500 
b [ 37 ] . housemodifier = [ 17500 , 50000 , 130000 , 150000 ] 
b [ 37 ] . housecost = 20000 
b [ 38 ] . name = 'income tax'
b [ 38 ] . type = 'tax'
b [ 38 ] . Price = 20000 
b [ 39 ] . name = 'Clifton'
b [ 39 ] . type = 'unowned'
b [ 39 ] . Price = 40000 
b [ 39 ] . rent = 5000 
b [ 39 ] . housemodifier = [ 20000 , 60000 , 140000 , 170000 ] 
b [ 39 ] . housecost = 20000 
//State
        

        
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
class AI extends player { 
    Actions = [
        "buy","buyHouse",
    ]

     async buy ( t ) { if ( t . Type != 'utility'&& t . type != 'airport') { 
t . Type = '"owned"'
} 
t . owner = this 
this . money = this . money - t . price 
}  async buyHouse ( t ) { this . money = this . money - t . housecost 
t . numhouses = t . numhouses + 1 
} 

    
async buyCond( t ) { ans = false 
if ( t . owner == null && this . money >= t . price ) { 
ans = true 
} 
return ans } 
async buyHouseCond( t ) { ans = false 
if ( t . Type == '"owned"'&& this . money >= t . houseprice && t . owner == this ) { 
ans = true 
} 
return ans } 


    params = []
    async chooseAction(choice, p)
    {
        switch(choice)
        {
            case "buy":
await this.buy(p)
break
case "buyHouse":
await this.buyHouse(p)
break

        }
        
        
    }
    async isActionLegal(choice, p)
    {
        switch(choice)
        {
            case "buy":
return await this.buyCond(p)
break
case "buyHouse":
return await this.buyHouseCond(p)
break

            
        }
        
        return false;
    }

    async considerations(choice)
    {
        
        switch(choice)
        {
            case 0:
 return []
break
case 1:
 return []
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
            let gcCond = await this.considerations(i);

            if( gcCond.length == 0)
            {
                if(await this.isActionLegal(this.Actions[i], []))
                {
                    choices.push(this.Actions[i])
                    this.params.push([])
                }
            }
            else
            {
                
                for(let j = 0;j<gcCond.length;j++)
                {
                    
                    let isLegal = await this.isActionLegal(this.Actions[i], gcCond[j]);
                    if(isLegal)
                    {
                        choices.push(this.Actions[i])
                        this.params.push(gcCond[j])

                    }
                }
            }
        }
        
        return choices
    }started = false 
money = 200000 
p = new piece() 
cards = [ ] 
jailCounter = 0 
;async turn ( ) { 
let b = this.State.board
if ( ! ( this . started ) ) { 
b.pieces.push(this.p)
this.p.Tile=b

this . started = true 
} 
jailCounter = jailCounter - 1 
if ( jailCounter > 0 ) { 
await output( 'you are still in jail') 
if ( this . cards != [ ] ) { 
await output( 'you have a get out of jail card ') 
let choice = await input( 'do you wish to use it', 'text') 
if ( choice == 'yes') { 
 await cards [ 0 ] .activate(this )

 this.cards.splice(0 , 1) 

} 
} 
} 
if ( jailCounter == 0 ) { 
let move = await input( 'enter the AIs dice roll', 'text') 
move = +( move ) 
let newPosition = +( b . Tile . Id ) 
newPosition = newPosition + move 
if ( newPosition > 40 ) { 
newPosition = newPosition - 40 
} 
newPosition = newPosition - 1 
movePiece ( this . p , b [ newPosition ] ) 
let t = b [ newPosition ] 
if ( t . Type == '"owned"') { 
if ( t . owner == this ) { 
let buy = await model( 'ShouldBuyHouse', data ) 
let ans = await this.isActionLegal ( 'buyHouse' , t ) 
if ( buy == 1 && ans ) { 
await this.chooseAction ( 'buyHouse' , t ) 
} 
} else { 
this . money = this . money - t . housemodifier [ t . numhouses ] 
t . owner . money = t . owner . money + t . housemodifier [ t . numhouses ] 
} 
} 
if ( t . Type == '"unowned"') { 
let buy = await model( 'ShouldBuy', data ) 
let ans = await this.isActionLegal ( 'buy' , t ) 
if ( buy == 1 && ans ) { 
await this.chooseAction ( 'buy' , t ) 
} 
} 
if ( t . Type == '"utility"') { 
if ( t . owner == null ) { 
let buy = await model( 'ShouldBuy', data ) 
let ans = await this.isActionLegal ( 'buy' , t ) 
if ( buy == 1 && ans ) { 
await this.chooseAction ( 'buy' , t ) 
} 
} else { 
let r = t . rent 
if ( b [ 12 ] . owner == b [ 28 ] . owner ) { 
r = r * 2 
} 
r = r * move 
this . money = this . money - r 
t . owner . money = t . owner . money + r 
} 
} 
if ( t . Type == '"airport"') { 
if ( t . owner == null ) { 
let buy = await model( 'ShouldBuy', data ) 
let ans = await this.isActionLegal ( 'buy' , t ) 
if ( buy == 1 && ans ) { 
await this.chooseAction ( 'buy' , t ) 
} 
} else { 
let r = t . rent * 0.5 
if ( b [ 5 ] . owner == t . owner ) { 
r = r * 2 
} 
if ( b [ 15 ] . owner == t . owner ) { 
r = r * 2 
} 
if ( b [ 25 ] . owner == t . owner ) { 
r = r * 2 
} 
if ( b [ 35 ] . owner == t . owner ) { 
r = r * 2 
} 
this . money = this . money - r 
t . owner . money = t . owner . money + r 
} 
} 
if ( t . Type == '"jail"') { 
movePiece ( this . p , b [ 30 ] ) 
} 
if ( t . Type == '"chance"'|| t . Type == 'chest') { 
await output( 'the ai needs to draw a card') 
let choice = await input( 'what card was drawn', 'text') 
let c = null 
if ( c == 1 ) { 
c = new cards('getOutOfJail')

c.push(cards)

} else if ( c == 2 ) { 
c = new cards('goToClifton')

 await c .activate(this )

} else { 
c = new cards('taxes')

 await c .activate(this )

} 
} 
} 
} } class human extends player { 
    Actions = [
        "buy","buyHouse",
    ]

     async buy ( t ) { if ( t . Type != 'utility'&& t . type != 'airport') { 
t . Type = '"owned"'
} 
t . owner = this 
this . money = this . money - t . price 
}  async buyHouse ( t ) { this . money = this . money - t . housecost 
t . numhouses = t . numhouses + 1 
} 

    
async buyCond( t ) { ans = false 
if ( t . owner == null && this . money >= t . price ) { 
ans = true 
} 
return ans } 
async buyHouseCond( t ) { ans = false 
if ( t . Type == '"owned"'&& this . money >= t . houseprice && t . owner == this ) { 
ans = true 
} 
return ans } 


    params = []
    async chooseAction(choice, p)
    {
        switch(choice)
        {
            case "buy":
await this.buy(p)
break
case "buyHouse":
await this.buyHouse(p)
break

        }
        
        
    }
    async isActionLegal(choice, p)
    {
        switch(choice)
        {
            case "buy":
return await this.buyCond(p)
break
case "buyHouse":
return await this.buyHouseCond(p)
break

            
        }
        
        return false;
    }

    async considerations(choice)
    {
        
        switch(choice)
        {
            case 0:
 return []
break
case 1:
 return []
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
            let gcCond = await this.considerations(i);

            if( gcCond.length == 0)
            {
                if(await this.isActionLegal(this.Actions[i], []))
                {
                    choices.push(this.Actions[i])
                    this.params.push([])
                }
            }
            else
            {
                
                for(let j = 0;j<gcCond.length;j++)
                {
                    
                    let isLegal = await this.isActionLegal(this.Actions[i], gcCond[j]);
                    if(isLegal)
                    {
                        choices.push(this.Actions[i])
                        this.params.push(gcCond[j])

                    }
                }
            }
        }
        
        return choices
    }started = false 
money = 200000 
p = new piece() 
cards = [ ] 
jailCounter = 0 
;async turn ( ) { 
let b = this.State.board
if ( ! ( this . started ) ) { 
b.pieces.push(this.p)
this.p.Tile=b

this . started = true 
} 
jailCounter = jailCounter - 1 
if ( jailCounter > 0 ) { 
await output( 'you are still in jail') 
if ( this . cards != [ ] ) { 
await output( 'you have a get out of jail card ') 
let choice = await input( 'do you wish to use it', 'text') 
if ( choice == 'yes') { 
 await cards [ 0 ] .activate(this )

 this.cards.splice(0 , 1) 

} 
} 
} 
if ( jailCounter == 0 ) { 
let move = await input( 'enter the your dice roll', 'text') 
move = +( move ) 
let newPosition = +( b . Tile . Id ) 
newPosition = newPosition + move 
if ( newPosition > 40 ) { 
newPosition = newPosition - 40 
} 
newPosition = newPosition - 1 
movePiece ( this . p , b [ newPosition ] ) 
let t = b [ newPosition ] 
if ( t . Type == '"owned"') { 
if ( t . owner == this ) { 
let buy = await input( 'text', 'will you buy this property') 
if ( buy == 'yes'&& ans ) { 
await this.chooseAction ( 'buyHouse' , t ) 
} 
} else { 
this . money = this . money - t . housemodifier [ t . numhouses ] 
t . owner . money = t . owner . money + t . housemodifier [ t . numhouses ] 
} 
} 
if ( t . Type == '"unowned"') { 
let buy = await input( 'text', 'will you buy a house') 
let ans = await this.isActionLegal ( 'buy' , t ) 
if ( buy == 'yes'&& ans ) { 
await this.chooseAction ( 'buy' , t ) 
} 
} 
if ( t . Type == '"utility"') { 
if ( t . owner == null ) { 
let buy = await input( 'text', 'will you buy this property') 
let ans = await this.isActionLegal ( 'buy' , t ) 
if ( buy == 'yes'&& ans ) { 
await this.chooseAction ( 'buy' , t ) 
} 
} else { 
let r = t . rent 
if ( b [ 12 ] . owner == b [ 28 ] . owner ) { 
r = r * 2 
} 
r = r * move 
this . money = this . money - r 
t . owner . money = t . owner . money + r 
} 
} 
if ( t . Type == '"airport"') { 
if ( t . owner == null ) { 
let buy = await input( 'text', 'will you buy this property') 
let ans = await this.isActionLegal ( 'buy' , t ) 
if ( buy == 'yes'&& ans ) { 
await this.chooseAction ( 'buy' , t ) 
} 
} else { 
let r = t . rent * 0.5 
if ( b [ 5 ] . owner == t . owner ) { 
r = r * 2 
} 
if ( b [ 15 ] . owner == t . owner ) { 
r = r * 2 
} 
if ( b [ 25 ] . owner == t . owner ) { 
r = r * 2 
} 
if ( b [ 35 ] . owner == t . owner ) { 
r = r * 2 
} 
this . money = this . money - r 
t . owner . money = t . owner . money + r 
} 
} 
if ( t . Type == '"jail"') { 
movePiece ( this . p , b [ 30 ] ) 
} 
if ( t . Type == '"chance"'|| t . Type == 'chest') { 
await output( 'you need to draw a card') 
let choice = await input( 'what card was drawn', 'text') 
let c = null 
if ( c == 1 ) { 
c = new cards('getOutOfJail')

c.push(cards)

} else if ( c == 2 ) { 
c = new cards('goToClifton')

 await c .activate(this )

} else { 
c = new cards('taxes')

 await c .activate(this )

} 
} 
} 
} } //players

async function indexOfPlayer(s)
{
    switch(s)
    {
        case "AI": 
 return 0
break
case "human": 
 return 1
break
//playerIndexes
    }
    return 0
}

//
class script
{
    State = new game_state();
    players = [
        new AI(),new human(),//add players
    ]
    
    async getPlayer(s)
    {
        let i = indexOfPlayer(s)
        return this.State.players[i]
    }

    async play()
    {
        this.State.players = players
        
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
        let h = await this.getPlayer( '"human"') 
let ai = await this.getPlayer( '"AI"') 
if ( h . money < 0 ) { 
await output( '"you have lost"') 
return true } 
if ( ai . money < 0 ) { 
await output( '"you have won"') 
return true } 
return false 
//end_game
        
    
        return true
    }
    


}

(new script()).play();