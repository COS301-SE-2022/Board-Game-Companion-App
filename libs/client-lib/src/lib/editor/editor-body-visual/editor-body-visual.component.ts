import { Component, OnInit, Input } from '@angular/core';
import { EditorComponent } from '../editor/editor.component';
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { InvokeFunctionExpr } from '@angular/compiler';


@Component({
  selector: 'board-game-companion-app-editor-body-visual',
  templateUrl: './editor-body-visual.component.html',
  styleUrls: ['./editor-body-visual.component.scss'],
})
export class EditorBodyVisualComponent implements OnInit {
  dragula = new Subscription()
  dest = [
    {title: '', class: '' , pos: 0}
  ]

  ngOnInit(): void 
  {
    console.log(this.dest)
    /* this.dragula.add(this.dragulaService.drop('COPYABLE')
    .subscribe(({name, el, target, source, sibling}) => {
        console.log(name)
        console.log(el)
        console.log(target)
        console.log(source)
        console.log(sibling)
      })
    ); */
  }
}
