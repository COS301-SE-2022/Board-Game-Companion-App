import { Component, Input} from "@angular/core";

@Component({
    selector: 'board-game-companion-app-card-template',
    styleUrls:['./editor-body-visual.component.scss'],
    template: `
        <div id = "card" class = "boardContainers">
            <details open>
                <summary class = "list-none flex flex-wrap items-center cursor-pointer">
                    <div class = "title text-2xl font-bold ml-4 mt-2 mb-4">
                        Card <input><input> 
                    </div>
                </summary>
                <div id = "effect" class = "cardContainers">
                    <details open>
                        <summary class = "list-none flex flex-wrap items-center cursor-pointer">
                            <div class = "title text-xl font-bold ml-4 mt-2">
                                Effect
                            </div>
                        </summary>
                        <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Effect" [dest] = "Effect" [dests] = "CardsLoops" [methods] = "methods"></board-game-companion-app-element-template>
                    </details>
                </div>
                <div id = "condition" class = "cardContainers">
                    <details open>
                        <summary class = "list-none flex flex-wrap items-center cursor-pointer">
                            <div class = "title text-xl font-bold ml-4 mt-2">
                                Condition <input>
                            </div>
                        </summary>
                        <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Condition" [dest] = "Condition" [dests] = "CardsLoops" [methods] = "methods"></board-game-companion-app-element-template>
                    </details>
                </div>
            </details>
        </div>
    `
})

export class CardTemplateComponent{
    @Input() Cards = [{effect: [{title: '', class: '' , id: '', pos: 0}], condition: [{title: '', class: '' , id: '', pos: 0}]}]
    @Input() CardsLoops = [[{title: '', class: '' , id: '', pos: 0}]]
    @Input() Effect = [{title: '', class: '' , id: '', pos: 0}]
    @Input() Condition = [{title: '', class: '' , id: '', pos: 0}]
    @Input() Index = 0
    @Input() methods = [
        {name: 'addToBoard', arguments: 1},
        {name: 'addPieceToTile', arguments: 2},
        {name: 'addToArr', arguments: 2}
      ]
    
}