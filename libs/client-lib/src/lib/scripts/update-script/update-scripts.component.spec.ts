import { TestBed } from '@angular/core/testing';
import { script, empty } from '../../shared/models/script';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { UpdateScriptComponent } from './update-scripts.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
const mockScript:script = {
  _id: "2",
  name: "tictactoe",
  author: "Njabulo",
  boardgame: "",
  description: "",
  created: new Date("20-03-19"),
  release: new Date("15-08-19"),
  downloads: 500,
  lastdownload: new Date("05-07-22"),
  lastupdate: new Date("13-12-21"),
  public: true,
  export: false,
  size: 344,
  status: {value: 1, message: "Active and running"},
  comments: [],
  files: [],
  icon: "",
  __v: 0
}
describe('Test update script',()=>{

  let component: UpdateScriptComponent;
  let scriptService: ScriptService;
  let searchService: BggSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateScriptComponent],
      imports: [HttpClientTestingModule,RouterTestingModule],
      providers: [ScriptService,BggSearchService]});

      scriptService = TestBed.inject(ScriptService);
      searchService = TestBed.inject(BggSearchService);

      component = new UpdateScriptComponent(searchService,scriptService);
  });

  it('should create components and services',()=>{
    expect(component).toBeDefined();
    expect(scriptService).toBeDefined();
    expect(searchService).toBeDefined();
  });

  it('should have variables initialized',()=>{
    expect(component.current).toBe(empty);
    expect(component.updateScriptEvent).toBeDefined();
    expect(component.scriptFiles.length).toBe(1);
    expect(component.scriptfile).toBe("");
    expect(component.maxfiles).toBe(3);
    expect(component.errorMessage).toBe("");
    expect(component.warningMessage).toBe("");
    expect(component.error).toBe(false);
    expect(component.warning).toBe(false);
    expect(component.boardgame).toBe("");
    expect(component.scriptname).toBe("");
    expect(component.months.length).toEqual(12);
  });

  jest.mock('../../shared/services/scripts/script.service');
  ScriptService.prototype.updateScriptInfo = function(data){
    if(data.id!==""){
      empty._id = data.id;
      empty.name = data.name;
      empty.public = data.export;
      empty.status = data.status;      
    }

    return of(empty);
  }

  it('should ngOnInit() log',()=>{
    component.ngOnInit();
  });

  it('should display(:number)',()=>{
    expect(component.display).toBeDefined();
    component.display(200);
  });

  it('should setStatus(:number) to published',()=>{
    expect(component.setStatus).toBeDefined();
    component.setStatus(2);
    expect(component.current.status.value).toBe(2);
  });

  it('should formatDate(:Date) when passed',()=>{
    const date = component.formatDate(new Date("05-07-22"));
    expect(date).toBe("7 May 2022, 0:0:0");
  });

  it('should replaceBackSlash(:string)',()=>{
    expect(component.replaceBackSlash).toBeDefined();
    const result = component.replaceBackSlash("https:\\\\njabulo.com\\uy");
    expect(result).toBe("https://njabulo.com/uy");
  });

  it('should validateAndSave() script',()=>{
    expect(component.validateAndSave).toBeDefined();
    component.validateAndSave();
  });

  it('should save() and update script', ()=>{
    expect(component.save).toBeDefined();
    component.current = mockScript;
    // component.save();
    // expect(component.current.name).toBe(mockScript.name);
  });

  it('should warnOccurrence(message)',()=>{
    expect(component.warningOccured).toBeDefined();
    component.warningOccured("The script might be malicious");
    expect(component.warningMessage).toBe("The script might be malicious");
  });

});
