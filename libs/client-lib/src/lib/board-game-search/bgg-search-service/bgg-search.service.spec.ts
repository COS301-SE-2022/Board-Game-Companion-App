import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MostActive, BggSearchService } from './bgg-search.service';

export const mockMostActive : MostActive ={
  id:"154930",
  name:"3rd Millennium Chess",
  image:"https://cf.geekdo-images.com/LQa7DiMcfR6PPxbTaKjDXA__thumb/img/H1Vra1AuINeZKHKwh2b7nXyWrys=/fit-in/200x150/filters:strip_icc()/pic2518692.jpg",
};

describe('BggSearchService', ()=> {
  let httpTestingController: HttpTestingController;
  let service: BggSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(BggSearchService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() =>{
    httpTestingController.verify();
  });

  it('should be created',() =>{
    expect(service).toBeTruthy();
  });

  it('getBoardGameId should return MostActive object', () =>{
    service.getBoardGameById('154930').subscribe((data)=>{
      const result = service.parseGetBoardGameById(data);

      expect(result).not.toBe(null);
      expect(result.id).toBe('154930');
      expect(result.name).toBe('3rd Millennium Chess');
      expect(JSON.stringify(result)).toEqual(JSON.stringify(mockMostActive));
    });
    const req = httpTestingController.expectOne('https://api.geekdo.com/xmlapi2/thing?id=154930');
    expect(req.request.method).toEqual('GET');
    req.flush(mockMostActive);
  });

});