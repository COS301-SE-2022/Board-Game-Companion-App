import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'board-game-companion-app-script-executor',
  templateUrl: './script-executor.component.html',
  styleUrls: ['./script-executor.component.scss'],
})
export class ScriptExecutorComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  scriptID = "1010";

  ngOnInit(): void {

    //get id
    this.scriptID = this.route.snapshot.paramMap.get('my_object')||"";

  }
}
