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
  static play() {
    const el = document.getElementById("ReturnedMove");
    if(el!=null)
    {
      el.innerHTML = "working";
    }
  } 

  

}