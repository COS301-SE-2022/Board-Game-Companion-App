import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { CreateScriptComponent } from './create-scripts.component';
// import { script } from '../../shared/models/scripts/script';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

/******************************************* Integration Tests ***********************/
describe('CreateScriptComponent',()=>{
  let component: CreateScriptComponent;
  let searchService: BggSearchService;
  let serviceScript: ScriptService;

  beforeEach(async ()=> {
    await TestBed.configureTestingModule({
      declarations: [CreateScriptComponent],
      providers: [ScriptService,BggSearchService],
      imports: [HttpClientModule]
    }).compileComponents();
  });

  it('should create component',()=>{
    searchService = TestBed.inject(BggSearchService);
    serviceScript = TestBed.inject(ScriptService);
    expect(searchService).toBeDefined();
    expect(serviceScript).toBeDefined();
    component = new CreateScriptComponent(searchService,serviceScript);
    expect(component).toBeDefined();
  });

  it('should validate And Save', ()=>{
    searchService = TestBed.inject(BggSearchService);
    serviceScript = TestBed.inject(ScriptService);
    component = new CreateScriptComponent(searchService,serviceScript);

    component.validateAndSave();
    component.scriptname = 'decider';
    component.validateAndSave();
    component.boardgame = 'monopoly';
    component.validateAndSave();
    component.description = 'basic description';
    component.validateAndSave();
  });

  it('should validateAndSave last branch',(done)=>{
    searchService = TestBed.inject(BggSearchService);
    serviceScript = TestBed.inject(ScriptService);
    component = new CreateScriptComponent(searchService,serviceScript);

    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za');
    component.scriptname = 'decider';
    component.boardgame = 'monopoly';
    component.description = 'basic description';
    component.validateAndSave();
    setTimeout(()=>{
      done();
    },5000)
    
  });

  it('should save given id', (done)=>{

    const fixture = TestBed.createComponent(CreateScriptComponent);
    const component = fixture.debugElement.componentInstance;
    
    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za');
    component.scriptname = 'decider';
    component.boardgame = 'monopoly';
    component.description = 'basic description';

    jest.spyOn(component.newScript,'emit');
    // fixture.detectChanges();

    component.save('1406');
    setTimeout(()=>{
      expect(component.newScript.emit).toHaveBeenCalled();
    },3000)
    done();
  });

  it(' load Seggestions', (done)=>{
    searchService = TestBed.inject(BggSearchService);
    serviceScript = TestBed.inject(ScriptService);
    component = new CreateScriptComponent(searchService,serviceScript);
    component.boardgame = 'chess';
    setTimeout(()=>{
      expect(component.boardgames.length).toBeGreaterThan(0);
    },5000);
    done();
  });

});