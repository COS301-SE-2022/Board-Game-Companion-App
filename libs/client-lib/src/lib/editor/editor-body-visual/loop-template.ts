import { Component, Input,ViewContainerRef} from "@angular/core";

@Component({
    selector: 'board-game-companion-app-loop-template',
    styleUrls:['./editor-body-visual.component.scss'],
    template: `
        <div [class] = "item.class">
            <div id = "whileBackground">
                <div id = "content">
                    <!--For Loop-->
                    <div *ngIf = "item.title === 'For'" id = "line">
                        <div class = "pb-1 pt-8 pl-4 text-left">
                        <label>
                            Start
                        </label>
                        <input class = "fInput ml-3">
                        </div>
                        <div class = "py-1 pl-4 text-left">
                        <label *ngIf = "item.title === 'For'">
                            End 
                        </label>
                        <input class = "fInput ml-5">
                        </div>
                        <div class = "py-1 pl-4 text-left">
                        <label>
                            By
                        </label>
                        <input class = "fInput ml-7">
                        </div>
                    </div>
                    <!--Return-->
                    <input id = "return" *ngIf = "item.title === 'Return'">
                    <!--Title displayed for certain visuals-->
                    <div id = "title" class = "mb-1" *ngIf = "item.title === 'Create' || item.title === 'Set' || item.title === 'Input' || item.title === 'Output'">{{item.title}}</div>
                    <!--Variable declaration name-->
                    <input *ngIf = "item.title === 'Create'">
                    <!--List of variables create-->
                    <select *ngIf = "item.title === 'Set'">
                        <option>
                        </option>
                    </select>
                    <div class = "my-1" *ngIf = "item.title === 'Create' || item.title === 'Set'">
                        To
                    </div>
                    <input *ngIf = "item.title === 'Create' || item.title === 'Set'">
                    <!--List of pre-made methods-->
                    <select *ngIf = "item.title === 'Call'">
                        <option>
                        </option>
                        <option *ngFor="let method of methods">
                          {{method.name}}
                        </option>
                    </select>
                    <!--Output and Input-->
                    <textarea *ngIf = "item.title === 'Input' || item.title === 'Output'"></textarea>
                    <!--While/do While Loop-->
                    <input id = "whileInput1" *ngIf = "item.title === 'While' || item.title === 'doWhile'">
                    <div>
                        <input id = "whileCompare" *ngIf = "item.title === 'While' || item.title === 'doWhile'">
                    </div>
                    <input id = "whileInput2" *ngIf = "item.title === 'While' || item.title === 'doWhile'">
                    <!--If Statement-->
                    <input id = "ifInput1" *ngIf = "item.title === 'If'">
                    <div>
                        <input id = "ifCompare" *ngIf = "item.title === 'If'">
                    </div>
                    <input id = "ifInput2" *ngIf = "item.title === 'If'">
                </div>
            </div>
        </div>
        <div class="container"  id = "codeArea" dragula="COPYABLE" *ngIf = "item.title === 'For' || item.title === 'While'">
        </div>
    `
})

export class LoopTemplateComponent{
    @Input() dest = [{title: '', class: '' , pos: 0}] 
    @Input() item = {title: '', class: '' , pos: 0}
    @Input() dests = [this.dest]
    @Input() methods = [
        {name: 'addToBoard', arguments: 1},
        {name: 'addPieceToTile', arguments: 2},
        {name: 'addToArr', arguments: 2}
      ]

}