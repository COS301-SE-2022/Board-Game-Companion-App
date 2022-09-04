import { Component, Input} from "@angular/core";

@Component({
    selector: 'board-game-companion-app-player-template',
    styleUrls:['./editor-body-visual.component.scss'],
    template: `
        <div id = "player" class = "boardContainers">
            <details open>
                <summary class = "list-none flex flex-wrap items-center cursor-pointer">
                    <h3 class = "title text-2xl font-bold ml-4 mt-2 mb-4">
                        Player <input> 
                    </h3>
                </summary>
                <div class = "ActionConditionPairs" *ngFor = "item of Actions let i = index">
                    <div id = "action" class = "playerContainers">
                        <div class = "title text-xl font-bold ml-4 mt-2">
                            Action <input> <input>
                        </div>
                        <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Actions[i]" [dest] = "Actions[i]" [dests] = "PlayerLoops" [methods] = "methods"></board-game-companion-app-element-template>
                    </div>
                    <div id = "condition" class = "playerContainers">
                        <div class = "title text-xl font-bold ml-4 mt-2">
                            Condition <input>
                        </div>
                        <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Conditions[i]" [dest] = "Conditions[i]" [dests] = "PlayerLoops" [methods] = "methods"></board-game-companion-app-element-template>
                    </div>
                </div>
                <div id = "turn" class = "playerContainers">
                    <div class = "title text-xl font-bold ml-4 mt-2">
                        Turn
                    </div>
                    <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Turn" [dest] = "Turn" [dests] = "PlayerLoops" [methods] = "methods"></board-game-companion-app-element-template>
                </div>
            </details>
        </div>
    `
})

export class PlayerTemplateComponent{
    @Input() Actions = [[{title: '', class: '' , id: '', pos: 0}]] 
    @Input() Conditions = [[{title: '', class: '' , id: '', pos: 0}]]
    @Input() Turn = [{title: '', class: '' , id: '', pos: 0}]  
    @Input() PlayerLoops = [this.Actions[0]]
    @Input() methods = [
        {name: 'addToBoard', arguments: 1},
        {name: 'addPieceToTile', arguments: 2},
        {name: 'addToArr', arguments: 2}
      ]
    
}