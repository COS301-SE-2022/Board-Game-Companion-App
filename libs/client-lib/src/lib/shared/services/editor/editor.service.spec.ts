import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EditorService } from './editor.service';
import { HttpClient } from '@angular/common/http';


/*************************************************unit test**********************************************/
const expectedUrl = "http://localhost:3333/api/";
//this.api = "https://board-game-companion-app-api.herokuapp.com/api/"
describe('Test service',()=>{

  let service: EditorService;
  let controller :HttpTestingController;
  let client: HttpClient; 

  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[EditorService]
    });
      service = TestBed.inject(EditorService);
      controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create a service',()=>{
    expect(service).toBeTruthy();
  });

  it('should return file data', ()=>{
    expect(HttpClientTestingModule).toBeDefined();
    expect(service.getFileData("string")).toBeTruthy();
  });

  it('should update the file', ()=>{
    expect(HttpClientTestingModule).toBeDefined();
    expect(service.updateFile("string", "content")).toBeTruthy()
  });

  it('should script model', ()=>{
    expect(HttpClientTestingModule).toBeDefined();
    expect(service.updateScriptModels("script", ["content1", "content2"])).toBeTruthy();
  });



});