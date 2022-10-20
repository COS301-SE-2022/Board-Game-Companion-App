import { Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'board-game-companion-app-element-template',
    styleUrls:['./editor-body-visual.component.scss'],
    template: `
    <div  style = "display: flex; align-items: center;" class = "listItems" *ngFor = "let item of dest let j = index">
        <div id = "doArea" dragula="COPYABLE" [(dragulaModel)]="dests[item.pos]" *ngIf = "item.title === 'doWhile'">
            <board-game-companion-app-loop-template (updateElement)="updateElementsLoop($event)"  style = "display: flex; align-items: center;" class = "listItems" *ngFor = "let item of dests[item.pos] let i = index" [item] = "item" [dest] = "dest" [dests] = "dests" [methods] = "methods"></board-game-companion-app-loop-template>
        </div>
        <div class = "block text-xl" *ngIf = "item.title === 'If'">
            <div class = "mb-4">
                <i (click)="addOperator(item)" class="fa-sharp fa-solid fa-plus cursor-pointer"></i>
            </div>
            <div class = "mb-4">
                <i (click)="removeOperator(item)" class="fa-sharp fa-solid fa-minus cursor-pointer"></i>
            </div>  
        </div>
        <div [class] = "item.class" [id] = "item.id" [attr.item-line]="item.lineNumber">
            <div class = "inline-flex text-xl h-0" *ngIf = "item.title === 'While' || item.title === 'doWhile'">
                <div class = "mr-6">
                    <i (click)="addOperator(item)" class="fa-sharp fa-solid fa-plus cursor-pointer"></i>
                </div>
                <div class = "ml-6">
                    <i (click)="removeOperator(item)" class="fa-sharp fa-solid fa-minus cursor-pointer"></i>
                </div>  
            </div>
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
                    <input (change)="updateElements($event, item, 'rvalue')" id = "return" *ngIf = "item.title === 'Return'" [value]="item.inputs[0]">
                    <!--Title displayed for certain visuals-->
                    <div id = "title" class = "mb-1" *ngIf = "item.title === 'Create' || item.title === 'Set' || item.title === 'Input' || item.title === 'Output'">{{item.title}}</div>
                    <!--Variable declaration name-->
                    <input (change)="updateElements($event, item, 'name')" *ngIf = "item.title === 'Create'" [value]="item.inputs[0]">
                    <!--List of variables created-->
                    <input (change)="updateElements($event, item, 'sname')" *ngIf = "item.title === 'Set'" list = "vars" [value]="item.inputs[0]">
                    <datalist id = "vars">
                        <option>
                            {{item.inputs[0]}}
                        </option>
                        <option *ngFor="let vars of variables">
                            {{vars.name}}
                        </option>
                    </datalist>
                    <div class = "my-1" *ngIf = "item.title === 'Create' || item.title === 'Set'">
                        To
                    </div>
                    <!--Create and Set values-->
                    <input (change)="updateElements($event, item, 'csvalue')" *ngIf = "item.title === 'Create' || item.title === 'Set'" [value]="item.inputs[1]">
                    <!--List of pre-made methods-->
                    <select (change)="updateElements($event, item, 'method')" *ngIf = "item.title === 'Call'" class = "mb-1">
                        <option>
                            {{item.inputs[0]}}
                        </option>
                        <option *ngFor="let method of methods">
                          {{method.name}}
                        </option>
                    </select>
                    <!--Method Inputs-->
                    <div *ngIf = "item.title === 'Call'">
                        <input (change)="updateElements($event, item, 'mvalues' + i)" class = "mt-1" *ngFor="let argument of this.arguments.constructor(+item.inputs[1]) let i = index" [value]="item.inputs[i + 2]">
                    </div>
                    <!--Output and Input-->
                    <textarea (change)="updateElements($event, item, 'iovalue')" *ngIf = "item.title === 'Input' || item.title === 'Output'" [value]="item.inputs[0]"></textarea>
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
                            <input (change)="updateElements($event, item, 'ifInput' + i + 1)" id = "ifInput1" [value]="item.inputs[i * 4 + 1 ]">
                            <div>
                                <input (change)="updateElements($event, item, 'ifCompare' + i + 1)" id = "ifCompare"  [value]="item.inputs[i * 4 + 2]">
                            </div>
                            <input (change)="updateElements($event, item, 'ifInput'  + i + 2)" id = "ifInput2" [value]="item.inputs[i * 4 + 3]">
                            <div>
                                <input (change)="updateElements($event, item, 'ifCompare'  + i + 2)" *ngIf="+item.inputs[0] > 1 && i !== +item.inputs[0] - 1" class = "AndOr" [value]="item.inputs[i * 4 + 4]">
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container"  id = "codeArea" dragula="COPYABLE" [(dragulaModel)]="dests[item.pos]" *ngIf = "item.title === 'For' || item.title === 'While'">
            <board-game-companion-app-loop-template (updateElement)="updateElementsLoop($event)"  style = "display: flex; align-items: center;" class = "listItems" *ngFor = "let item of dests[item.pos] let i = index" [item] = "item" [dest] = "dest" [dests] = "dests" [methods] = "methods"></board-game-companion-app-loop-template>
        </div>
        <div class = "tfSection" *ngIf = "item.title === 'If'">
            <div class="container" id = "trueSection" dragula="COPYABLE" [(dragulaModel)]="dests[item.true]">
                <board-game-companion-app-loop-template (updateElement)="updateElementsLoop($event)"  style = "display: flex; align-items: center;" class = "listItems" *ngFor = "let item of dests[item.true] let i = index" [item] = "item" [dest] = "dest" [dests] = "dests" [methods] = "methods"></board-game-companion-app-loop-template>
            </div>
            <div *ngIf="dests[item.false][0].inputs.length !== 8" class = "ml-8 text-2xl">
                <i (click)="addFalse(item)" class="fa-sharp fa-solid fa-plus cursor-pointer"></i>
            </div>
            <div *ngIf="dests[item.false][0].inputs.length === 8" class = "ml-8 text-2xl">
                <i (click)="removeFalse(item)" class="fa-sharp fa-solid fa-circle-xmark cursor-pointer"></i>
            </div>
            <div *ngIf="dests[item.false][0].inputs.length === 8" class="container" id = "falseSection" dragula="COPYABLE" [(dragulaModel)]="dests[item.false]">
                <board-game-companion-app-loop-template (updateElement)="updateElementsLoop($event)"  style = "display: flex; align-items: center;" class = "listItems" *ngFor = "let item of dests[item.false] let i = index" [item] = "item" [dest] = "dest" [dests] = "dests" [methods] = "methods"></board-game-companion-app-loop-template>
            </div>
        </div>
    </div>
    
    `
})

export class ElementTemplateComponent{
    @Input() dest = [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}] 
    @Input() dests = [this.dest]
    @Input() variables = [{name: "", value: ""}]
    @Input() methods = [
        {name: 'addToBoard', arguments: 1},
        {name: 'addPieceToTile', arguments: 2},
        {name: 'addToArr', arguments: 2},
        {name: 'movePiece', arguments: 2},
        {name: 'activate', arguments: 2},
        {name: 'removeFromArr', arguments: 2},
        {name: 'chooseAction', arguments: 2},
        {name: 'consider:', arguments: 1}
      ]
    arguments = []
    @Output() updateElement = new EventEmitter<string>()

    addFalse(item: any)
    {
        this.updateElement.emit("add" + "+" + "else" + "+" + item.lineNumber)
    }

    removeFalse(item : any)
    {
        this.updateElement.emit("remove" + "+" + "else" + "+" + item.lineNumber)
    }

    removeOperator(item : any)
    {
        this.updateElement.emit("remove" + "+" + "ifOperator" + "+" + item.lineNumber)
    }

    addOperator(item : any)
    {
        this.updateElement.emit("add" + "+" + "ifOperator" + "+" + item.lineNumber)
    }

    conditions(con: number)
    {
        return new Array(con)
    }

    updateElementsLoop(event : any)
    {
        this.updateElement.emit(event)
    }

    updateElements(event : any, item : any, type : string)
    {
        if(event.target.value != "")
        {
            this.updateElement.emit(event.target.value + "+" + type + "+" + item.lineNumber)
        }
    
    }

}