import { ScriptService } from '../../shared/services/scripts/script.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ScriptExecutorComponent} from './script-executor.component';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ScriptExecutorComponent',()=>{
  let component: ScriptExecutorComponent;
  let service: ScriptService;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScriptExecutorComponent],
      providers: [ScriptService],
      imports: [HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();
  });

  it('should create a component',()=>{
    service = TestBed.inject(ScriptService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    expect(service).toBeTruthy();
    expect(route).toBeTruthy();
    expect(router).toBeTruthy();
    component = new ScriptExecutorComponent(route, service, router);
    expect(component).toBeTruthy();
  });

  it('should have global variables',()=>{
    service = TestBed.inject(ScriptService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    component = new ScriptExecutorComponent(route, service, router);
    expect(component.min).toBe("min");
    expect(component.m).toBe(0);
    expect(component.s).toBe(0);
    expect(component.sec).toBe("sec");
    expect(component.hours).toBe("hours");
    expect(component.file).toBe("test");
    expect(component.scriptID).toBe("");
  });

  it('should define functions',()=>{
    service = TestBed.inject(ScriptService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    component = new ScriptExecutorComponent(route, service, router);
    expect(component.back).toBeDefined();
  });
});
