import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
    
  ]
})

export class ScriptExecutorModule {
  static GameState = ["0","0","0","0","0","0","0","0","0"];
  static char = "x";
  static play() {
    const el = document.getElementById("ReturnedMove");
    const button = document.getElementById("action");
    
    if(el!=null)
    {
      el.innerHTML = "Will you go first or second";
    }
    if(button!=null)
    {
      button.addEventListener("click", handlePlayerChoice)
    }
    
  } 

   
 



  static PlayerMove():void 
  {
    const input = document.getElementById("EnterMove") as HTMLInputElement;
    const button = document.getElementById("action") ;
    input.value = "";
    if(button!= null)
    {
      button.addEventListener("click", handlePlayerMove)
    }
  }





static AiMove():void
{
  //get valid move
  
  let rand = 0;
  
  let choices:number[] = [];
  for(let i = 0;i<this.GameState.length;i++)
  {
    if(this.GameState[i] =="0")
    {
      choices.push(i);
    }
  }
  rand = Math.floor(Math.random() * (choices.length));
  rand = choices[rand];  
  
  //update gamestate
  let char = "o";
  if(this.char == "o")
    char = "x"
    
 
  this.updateState(char, rand);
  //check if game ends
  if(this.hasEnded(char))
  {
    //we won
    const el = document.getElementById("ReturnedMove");
    const instruction = document.getElementById("instruction");
    if(el!=null)
    {
      el.innerHTML = "The AI wins!";
    }
    if(instruction!=null)
    {
      instruction.innerHTML = "The AI wins!";
    }
    return;
  }
  else if(this.isDraw())
  {
    //draw
    const el = document.getElementById("ReturnedMove");
    const instruction = document.getElementById("instruction");
    if(el!=null)
    {
      el.innerHTML = "The game is a draw";
    }
    if(instruction!=null)
    {
      instruction.innerHTML = "The game is a draw";
    }
    return;
  }
  else
    {
      //if game continues, update move returned
      const el = document.getElementById("ReturnedMove");
      if(el!=null)
      {
        if(this.char == "x")
          el.innerHTML = "The Ai placed a naught in square "+(rand+1);
        else
          el.innerHTML = "The Ai placed a cross in square "+(rand+1);
      }
      //pass to the user if game continues
      
      this.PlayerMove();
      
    }
  

  
}

static updateState(c: string,position: number):boolean
{
  var s = new ScriptExecutorModule();
  //update the state 
  this.GameState[position] = c;



  return this.hasEnded(c);
}

static hasEnded(c:string):boolean
  {
    //check rows
    if(this.GameState[0] == c && this.GameState[1] == c && this.GameState[2] == c)
    {
      return true;
    }
    if(this.GameState[3] == c && this.GameState[4] == c && this.GameState[5] == c)
    {
      return true;
    }
    if(this.GameState[6] == c && this.GameState[7] == c && this.GameState[8] == c)
    {
      return true;
    }


    //check columns
    if(this.GameState[0] == c && this.GameState[3] == c && this.GameState[6] == c)
    {
      return true;
    }
    if(this.GameState[1] == c && this.GameState[4] == c && this.GameState[7] == c)
    {
      return true;
    }
    if(this.GameState[2] == c && this.GameState[5] == c && this.GameState[8] == c)
    {
      return true;
    }

    //diagnols
    if(this.GameState[0] == c && this.GameState[4] == c && this.GameState[8] == c)
    {
      return true;
    }
    if(this.GameState[2] == c && this.GameState[4] == c && this.GameState[6] == c)
    {
      return true;
    }

    return false;
  }
  static isDraw():boolean
  {
    for(let i = 0; i<this.GameState.length;i++)
    {
      if(this.GameState[i] == "0")
        return false;
    }
    return true;
  }

}



function handlePlayerChoice(e:MouseEvent)
 {
   
    const el = document.getElementById("ReturnedMove");
    const button = document.getElementById("action");

    if(button!=null)
      button.removeEventListener("click", handlePlayerChoice);

    let input = document.getElementById("EnterMove") as HTMLInputElement;
    if(input.value.includes("first")||input.value.includes("First")||input.value.includes("1")) 
    {
      const instruction = document.getElementById("instruction");
      if(instruction!=null)
      {
        instruction.innerHTML = "In which square will you place a cross?";
        if(el!=null)
          el.innerHTML = "waiting for your move..."
      }

      //player moves first
      ScriptExecutorModule.char = "x";
      ScriptExecutorModule.PlayerMove();
    }
    else
    {
      const instruction = document.getElementById("instruction");
      if(instruction!=null)
      {
        instruction.innerHTML = "In which square will you place a naught?";
      }
      ScriptExecutorModule.char = "o";
      //ai moves first
      ScriptExecutorModule.AiMove();
    }
  }



  
  function handlePlayerMove(e:MouseEvent)
{
  const input = document.getElementById("EnterMove") as HTMLInputElement;
  const button = document.getElementById("action") ;
  if(button!= null)
    button.removeEventListener("click", handlePlayerMove);
  //get input
  //input will be 1-9 for block num
  let i = +input.value;
  
  //if valid, update state and check if game ends
  ScriptExecutorModule.updateState(ScriptExecutorModule.char, i-1);
  
  if(ScriptExecutorModule.hasEnded(ScriptExecutorModule.char))
  {
    //we won
    const el = document.getElementById("ReturnedMove");
    const instruction = document.getElementById("instruction");
    if(el!=null)
    {
      el.innerHTML = "you win!";
    }
    if(instruction!=null)
    {
      instruction.innerHTML = "you win!";
    }
    return;
  }
  else if(ScriptExecutorModule.isDraw())
  {
    //draw
    const el = document.getElementById("ReturnedMove");
    const instruction = document.getElementById("instruction");
    if(el!=null)
    {
      el.innerHTML = "The game is a draw";
    }
    if(instruction!=null)
    {
      instruction.innerHTML = "The game is a draw";
    }
    return;
  }
  else
  {
    //if game continues, pass to AI

    
    ScriptExecutorModule.AiMove();
    
  }


}
  


