import { Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'board-game-companion-app-loop-template',
    styleUrls:['./editor-body-visual.component.scss'],
    template: `
        <div id = "doArea" dragula="COPYABLE" [(dragulaModel)]="dests[item.pos]" *ngIf = "item.title === 'doWhile'">
            <board-game-companion-app-loop-template  style = "display: flex; align-items: center;" class = "listItems" *ngFor = "let item of dests[item.pos] let i = index" [item] = "item" [dest] = "dest" [dests] = "dests" [methods] = "methods" [Variables]="Variables"></board-game-companion-app-loop-template>
        </div>
        <div [class] = "item.class" [id] = "item.id">
            <div id = "whileBackground">
                <div id = "content">
                      <!--For Loop-->
                      <div *ngIf = "item.title === 'For'" id = "line">
                        <div class = "pb-1 pt-8 pl-4 text-left">
                            <label>
                                Start
                            </label>
                            <input class = "fInput ml-3" [value]="item.inputs[0]">
                            </div>
                            <div class = "py-1 pl-4 text-left">
                            <label *ngIf = "item.title === 'For'">
                                End 
                            </label>
                            <input class = "fInput ml-5" [value]="item.inputs[1]">
                            </div>
                            <div class = "py-1 pl-4 text-left">
                            <label>
                                By
                            </label>
                            <input class = "fInput ml-7" [value]="item.inputs[2]">
                        </div>
                    </div>
                    <!--Return-->
                    <input id = "return" *ngIf = "item.title === 'Return'" [value]="item.inputs[0]">
                    <!--Title displayed for certain visuals-->
                    <div id = "title" class = "mb-1" *ngIf = "item.title === 'Create' || item.title === 'Set' || item.title === 'Input' || item.title === 'Output'">{{item.title}}</div>
                    <!--Variable declaration name-->
                    <input *ngIf = "item.title === 'Create'" [value]="item.inputs[0]">
                    <!--List of variables create-->
                    <select *ngIf = "item.title === 'Set'">
                        <option>
                            {{item.inputs[0]}}
                        </option>
                        <option *ngFor="let vars of Variables">
                            {{vars.name}}
                        </option>
                    </select>
                    <div class = "my-1" *ngIf = "item.title === 'Create' || item.title === 'Set'">
                        To
                    </div>
                    <input *ngIf = "item.title === 'Create' || item.title === 'Set'" [value]="item.inputs[1]">
                   <!--List of pre-made methods-->
                   <select (change)="methodInputs($event)" *ngIf = "item.title === 'Call'" class = "mb-1">
                        <option>
                            {{item.inputs[0]}}
                        </option>
                        <option *ngFor="let method of methods">
                          {{method.name}}
                        </option>
                    </select>
                    <!--Method Inputs-->
                    <div *ngIf = "item.title === 'Call'">
                        <input class = "mt-1" *ngFor="let argument of this.arguments.constructor(+item.inputs[1]) let i = index" [value]="item.inputs[i + 2]">
                    </div>
                    <!--Output and Input-->
                    <textarea *ngIf = "item.title === 'Input' || item.title === 'Output'" [value]="item.inputs[0]"></textarea>
                    <!--While/do While Loop-->
                    <div *ngIf = "item.title === 'While' || item.title === 'doWhile'">
                        <div class = "conditions" *ngFor="let con of [].constructor(+item.inputs[0]) let i = index">
                            <input id = "whileInput1" [value]="item.inputs[i * 4 + 1 ]">
                            <div>
                                <input id = "whileCompare" [value]="item.inputs[i * 4 + 2]">
                            </div>
                            <input id = "whileInput2" [value]="item.inputs[i * 4 + 3]">
                            <div>
                                <input *ngIf="+item.inputs[0] > 1 && i !== +item.inputs[0] - 1" class = "AndOr" [value]="item.inputs[i * 4 + 4]">
                            </div>  
                        </div>
                    </div>
                    <!--If Statement-->
                    <div *ngIf = "item.title === 'If'">
                        <div class = "conditions" *ngFor="let con of [].constructor(+item.inputs[0]) let i = index">
                            <input id = "ifInput1" [value]="item.inputs[i * 4 + 1 ]">
                            <div>
                                <input id = "ifCompare"  [value]="item.inputs[i * 4 + 2]">
                            </div>
                            <input id = "ifInput2" [value]="item.inputs[i * 4 + 3]">
                            <div>
                                <input *ngIf="+item.inputs[0] > 1 && i !== +item.inputs[0] - 1" class = "AndOr" [value]="item.inputs[i * 4 + 4]">
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container"  id = "loopCodeArea" dragula="COPYABLE" [(dragulaModel)]="dests[item.pos]" *ngIf = "item.title === 'For' || item.title === 'While'">
            <board-game-companion-app-loop-template  style = "display: flex; align-items: center;" class = "listItems" *ngFor = "let item of dests[item.pos] let i = index" [item] = "item" [dest] = "dest" [dests] = "dests" [methods] = "methods" [Variables]="Variables"></board-game-companion-app-loop-template>
        </div>
        <div class = "tfSection" *ngIf = "item.title === 'If'">
            <div class="container" id = "trueSection" dragula="COPYABLE" [(dragulaModel)]="dests[item.true]">
                <board-game-companion-app-loop-template  style = "display: flex; align-items: center;" class = "listItems" *ngFor = "let item of dests[item.true] let i = index" [item] = "item" [dest] = "dest" [dests] = "dests" [methods] = "methods" [Variables]="Variables"></board-game-companion-app-loop-template>
            </div>
            <div *ngIf="dests[item.false][0].inputs.length === 8" class="container" id = "falseSection" dragula="COPYABLE" [(dragulaModel)]="dests[item.false]">
                <board-game-companion-app-loop-template  style = "display: flex; align-items: center;"class = "listItems" *ngFor = "let item of dests[item.false] let i = index" [item] = "item" [dest] = "dest" [dests] = "dests" [methods] = "methods" [Variables]="Variables"></board-game-companion-app-loop-template>
            </div>
        </div>
    `
})

export class LoopTemplateComponent{
    @Input() index = 0
    @Input() dest = [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}] 
    @Input() item = {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}
    @Input() dests = [this.dest]
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
    
    arguments = []
    @Output() updateMethod = new EventEmitter<string>()

    conditions(con: number)
    {
        return new Array(con)
    }
    methodInputs(event: any)
    {
        const m = this.methods.find(obj => obj.name === event.target.value)
        if(m != null)
        {
            this.updateMethod.emit(event.target.value + " " + m?.arguments)
            this.arguments.length = m.arguments
        }
    }
}