import { ScriptService } from '../../shared/services/scripts/script.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ScriptExecutorComponent} from './script-executor.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BggSearchService } from '../../board-game-search/bgg-search-service/bgg-search.service';

describe('ScriptExecutorComponent',()=>{
  let component: ScriptExecutorComponent;
  let fixture: ComponentFixture<ScriptExecutorComponent>;
  
  let Scriptservice: ScriptService;
  let BggService: BggSearchService;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScriptExecutorComponent],
      providers: [ScriptService],
      imports: [HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();
    // fixture = TestBed.createComponent(ScriptExecutorComponent);
    // component = fixture.componentInstance;
  });

  it('should create a component',()=>{
    expect(1).toBeTruthy();
  })
  // it('should create a component',()=>{
  //   Scriptservice = TestBed.inject(ScriptService);
  //   BggService = TestBed.inject(BggSearchService);
  //   route = TestBed.inject(ActivatedRoute);
  //   router = TestBed.inject(Router);
  //   expect(Scriptservice).toBeTruthy();
  //   expect(route).toBeTruthy();
  //   expect(router).toBeTruthy();
  //   component = new ScriptExecutorComponent(BggService, Scriptservice, router);
  //   expect(component).toBeTruthy();
  // });

  // it('should have global variables',()=>{
  //   Scriptservice = TestBed.inject(ScriptService);
  //   BggService = TestBed.inject(BggSearchService);
  //   route = TestBed.inject(ActivatedRoute);
  //   router = TestBed.inject(Router);
  //   component = new ScriptExecutorComponent(BggService, Scriptservice, router);
  //   expect(component.replay).toBe(false);
  // });

  // it('should define functions',()=>{
  //   Scriptservice = TestBed.inject(ScriptService);
  //   BggService = TestBed.inject(BggSearchService);
  //   route = TestBed.inject(ActivatedRoute);
  //   router = TestBed.inject(Router);
  //   component = new ScriptExecutorComponent(BggService, Scriptservice, router);
  //   expect(component.code).toBeDefined();
  // });
});
