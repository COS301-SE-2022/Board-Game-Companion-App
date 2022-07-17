import { BggSearchService, MostActive } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { CreateScriptComponent } from './create-scripts.component';
import { script } from '../../shared/models/script';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateScriptComponent',()=>{
  let component: CreateScriptComponent;
  let searchService: BggSearchService;
  let serviceScript: ScriptService;

  beforeEach(async ()=> {
    await TestBed.configureTestingModule({
      declarations: [CreateScriptComponent],
      providers: [ScriptService,BggSearchService],
      imports: [HttpClientTestingModule]
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

  it('test variables', ()=>{
    searchService = TestBed.inject(BggSearchService);
    serviceScript = TestBed.inject(ScriptService);
    component = new CreateScriptComponent(searchService,serviceScript);
    expect(component.maxfiles).toBe(3);
    expect(component.error).toBe(false);
    expect(component.warning).toBe(false);
    expect(component.boardgames).toStrictEqual([]);
    component.errorMessage = "does not exist!";
    expect(component.errorMessage).toBe("does not exist!");
  });

  it('test functions', ()=>{
    searchService = TestBed.inject(BggSearchService);
    serviceScript = TestBed.inject(ScriptService);
    component = new CreateScriptComponent(searchService,serviceScript);
    expect(component.validateAndSave).toBeDefined();
    expect(component.getboardGameId).toBeDefined();
    expect(component.getBoardGameSuggestions).toBeDefined();
    expect(component.save).toBeDefined();
    expect(component.loadBoardGameSuggestions).toBeDefined();
    expect(component.loadImage).toBeDefined();
  });

});