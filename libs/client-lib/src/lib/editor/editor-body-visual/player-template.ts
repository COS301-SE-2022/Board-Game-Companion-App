import { Component, Input} from "@angular/core";
import { ElementTemplateComponent } from "./element-template";

@Component({
    selector: 'board-game-companion-app-player-template',
    styleUrls:['./editor-body-visual.component.scss'],
    template: `
        <div id = "player" class = "boardContainers">
            <div class = "title text-2xl font-bold ml-4 mt-2 mb-4">
                Player <input>
            </div>
            <div id = "action" class = "playerContainers">
                <div class = "title text-xl font-bold ml-4 mt-2">
                    Action <input> <input>
                </div>
                <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Action" [dest] = "Action" [dests] = "PlayerLoops" [methods] = "methods"></board-game-companion-app-element-template>
            </div>
            <div id = "condition" class = "playerContainers">
                <div class = "title text-xl font-bold ml-4 mt-2">
                    Condition <input>
                </div>
                <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Condition" [dest] = "Condition" [dests] = "PlayerLoops" [methods] = "methods"></board-game-companion-app-element-template>
            </div>
            <div id = "turn" class = "playerContainers">
                <div class = "title text-xl font-bold ml-4 mt-2">
                    Turn
                </div>
                <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Turn" [dest] = "Turn" [dests] = "PlayerLoops" [methods] = "methods"></board-game-companion-app-element-template>
            </div>
        </div>
    `
})

export class PlayerTemplateComponent{
    @Input() Action = [{title: '', class: '' , id: '', pos: 0}] 
    @Input() Condition = [{title: '', class: '' , id: '', pos: 0}]
    @Input() Turn = [{title: '', class: '' , id: '', pos: 0}]  
    @Input() PlayerLoops = [this.Action]
    @Input() methods = [
        {name: 'addToBoard', arguments: 1},
        {name: 'addPieceToTile', arguments: 2},
        {name: 'addToArr', arguments: 2}
      ]
}