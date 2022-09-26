import { Component, Input} from "@angular/core";

@Component({
    selector: 'board-game-companion-app-card-template',
    styleUrls:['./editor-body-visual.component.scss'],
    template: `
        <div id = "card" class = "boardContainers">
            <details open>
                <summary class = "list-none flex flex-wrap items-center cursor-pointer">
                    <div class = "title text-2xl font-bold ml-4 mt-2 mb-4">
                        Card <input [value]="Name"><input [value]="Parameter"> 
                    </div>
                    <button (click)="removeCard()" id = "removeCard"><i class="fa-solid fa-circle-xmark"></i></button>
                </summary>
                <div id = "effect" class = "cardContainers">
                    <details open>
                        <summary class = "list-none flex flex-wrap items-center cursor-pointer">
                            <div class = "title text-xl font-bold ml-4 mt-2">
                                Effect
                            </div>
                        </summary>
                        <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Cards[Index].effect" [dest] = "Cards[Index].effect" [dests] = "CardsLoops" [methods] = "methods" [variables]="Variables"></board-game-companion-app-element-template>
                    </details>
                </div>
                <div id = "condition" class = "cardContainers">
                    <details open>
                        <summary class = "list-none flex flex-wrap items-center cursor-pointer">
                            <div class = "title text-xl font-bold ml-4 mt-2">
                                Condition
                            </div>
                        </summary>
                        <board-game-companion-app-element-template class="wrapper" dragula="COPYABLE" [(dragulaModel)]="Cards[Index].condition" [dest] = "Cards[Index].condition" [dests] = "CardsLoops" [methods] = "methods" [variables]="Variables"></board-game-companion-app-element-template>
                    </details>
                </div>
            </details>
        </div>
    `
})

export class CardTemplateComponent{
    @Input() Name = ""
    @Input() Parameter = ""
    @Input() Cards = [{name: "", parameter: "", effect: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}], condition: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]}]
    @Input() CardsLoops = [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]]
    @Input() Effect = [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]
    @Input() Condition = [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]
    @Input() Index = 0
    @Input() Variables = [{name: "", value: ""}]
    @Input() methods = [
        {name: 'addToBoard', arguments: 1},
        {name: 'addPieceToTile', arguments: 2},
        {name: 'addToArr', arguments: 2},
        {name: 'movePiece', arguments: 2},
        {name: 'activate', arguments: 2},
        {name: 'removeFromArr', arguments: 2},
        {name: 'chooseAction', arguments: 2},
      ]

    removeCard()
    {
        this.Cards.splice(this.Index,1)
    }
    
}