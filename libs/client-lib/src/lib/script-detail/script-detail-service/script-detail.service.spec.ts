import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { HttpClient } from '@angular/common/http';
import { ScriptDetailService } from './script-detail.service';
import { async, TestBed } from '@angular/core/testing';
import { script } from './script-detail.service';
import { of } from 'rxjs';

const mockData: script = {
    _id: "12345",
    name: "chess",
    author: "Li",
    boardgame: "board",
    published: new Date("12-05-22"),
    downloads: 22,
    lastdownlod: new Date("10-10-22"),
    public: true,
    size: 15,
    Rating: 4,
};
const emptyMock: script = {
    _id: "",
    name: "",
    author: "",
    boardgame: "",
    published: new Date("12-05-22"),
    downloads: 0,
    lastdownlod: new Date("10-10-22"),
    public: true,
    size: 0,
    Rating: 0,
};
describe('ScriptDetailService', () => {
    let service: ScriptDetailService;
  
    beforeEach(() => {
      TestBed.configureTestingModule({imports: [HttpClientTestingModule],
      providers: [ScriptDetailService]});
      service = TestBed.inject(ScriptDetailService);
    });
    
    jest.mock('./script-detail.service');
    ScriptDetailService.prototype.getScriptById = function(id){
        if(mockData._id==id)
            return of(mockData);
        else
            return of(emptyMock);
    }

    ScriptDetailService.prototype.getScriptByName = function(name){
        if(mockData.name==name)
            return of(mockData);
        else
            return of(emptyMock);
    }

    it('should create a valid service',() =>{
        expect(service).toBeTruthy();
    });
    it('should have defined functions',() =>{
        expect(service.getScriptById).toBeDefined();
        expect(service.getScriptByName).toBeDefined();
    });
    it('should return defined data', async () => {
        const data = await service.getScriptById("12345").toPromise();
        expect(data).toBeDefined();
        const result = await service.getScriptByName("chess").toPromise();
        expect(result).toBeDefined();
    });

    it('should return empty script if does exist in api', async () =>{
        const data = await service.getScriptById("1213").toPromise();
        expect(data).toBe(emptyMock);
        const result = await service.getScriptByName("cwwhess").toPromise();
        expect(result).toBe(emptyMock);
    });

    it('should test getScriptById() ', async () =>{
        const data = await service.getScriptById("12345").toPromise();
        expect(data).toBe(mockData);
        expect(data?.name).toBe(mockData.name);
        expect(data?.Rating).toBe(mockData.Rating);
        expect(data?.author).toBe(mockData.author);
        expect(data?.downloads).toBe(mockData.downloads);
    });

    it('should test getScriptByName() ', async () =>{
        const data = await service.getScriptByName("chess").toPromise();
        expect(data).toBe(mockData);
        expect(data?.name).toBe(mockData.name);
        expect(data?.Rating).toBe(mockData.Rating);
        expect(data?.author).toBe(mockData.author);
        expect(data?.downloads).toBe(mockData.downloads);
    });
  });
