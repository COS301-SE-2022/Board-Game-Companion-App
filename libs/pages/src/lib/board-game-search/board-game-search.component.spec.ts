import { TestBed } from '@angular/core/testing';

import { BoardGameSearchComponent } from './board-game-search.component';

import {BggSearchService, MostActive} from '../bgg-search-service/bgg-search.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Test: ngOnInit',()=>{
  let component: BoardGameSearchComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [RouterTestingModule,HttpClientTestingModule],providers:[BggSearchService],declarations: [
      BoardGameSearchComponent
    ]});
    
    // const service = TestBed.inject(BggSearchService);
    // const router = TestBed.inject(Router);
    component = TestBed.createComponent(BoardGameSearchComponent).componentInstance;
  });

  it('generate most active games',()=>{
    component.ngOnInit();
    expect(component.contentType).toBe("Most Active");
  })

  it('checking sorting funcionality',()=>{
    const data:MostActive[] =[ 
      {id:"0",name:"root and forest",image:""},{id:"1",name:"roots",image:""},{id:"2",name:"shoots",image:""}
    ]

    component.mostActive = data;
    component.sort();
    expect(component.mostActive[0].id).toBe("1");
    expect(component.mostActive[1].id).toBe("2");
    expect(component.mostActive[2].id).toBe("0");
  })
})
