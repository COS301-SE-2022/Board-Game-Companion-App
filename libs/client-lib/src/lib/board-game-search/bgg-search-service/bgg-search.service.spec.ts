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
    //get local access of api, for instance a json file , mock database 
    const req = httpTestingController.expectOne('https://api.geekdo.com/xmlapi2/thing?id=154930');
    expect(req.request.method).toEqual('GET');
    req.flush(mockMostActive);
  });

  it('should return boardgame by name',()=>{
    service.getBoardGameByName('3rd Millennium Chess',true).subscribe((data)=>{
      const result = service.parseGetBoardGameByName(data);

      expect(result).not.toBe(null);
      expect(result[0].name).toBe('3rd Millennium Chess');
      expect(JSON.stringify(result[0])).toEqual(JSON.stringify(mockMostActive));
    });
    const req = httpTestingController.expectOne('https://api.geekdo.com/xmlapi2/search?query=3rd Millennium Chess&type=boardgame&exact=1');
    expect(req.request.method).toEqual('GET');
    req.flush([mockMostActive]);
  });

  
  it('should return comments',()=>{
    service.getComments('').subscribe((data)=>{
      expect(data).toBe({message:'this is a comment right?'});
    });

    const req = httpTestingController.expectOne('');
    expect(req.request.method).toStrictEqual('GET');
    req.flush({message:'this is a comment right?'});
  });

  const arrMostActive: MostActive[] = 
  [{
    id:'328479',
    name:'Living Forest',
    image:'https://cf.geekdo-images.com/fPhdfZX9UTLr4-SVgK0zoQ__thumb/img/v8irnVxaCdK29XPtqEbtlKkLY4c=/fit-in/200x150/filters:strip_icc()/pic5899025.jpg'
  },
  {
    id:'317985',
    name:'Beyond the Sun',
    image:'https://cf.geekdo-images.com/BfEHqHQAvZLbRX7y7e9TWg__thumb/img/6rZLxebQyTXasbAPddxpdE1LVls=/fit-in/200x150/filters:strip_icc()/pic5617866.jpg'
  },
  {
    id:'342942',
    name:'Ark Nova',
    image:'https://cf.geekdo-images.com/SoU8p28Sk1s8MSvoM4N8pQ__thumb/img/4KuHNTWSMPf8vTNDKSRMMI3oOv8=/fit-in/200x150/filters:strip_icc()/pic6293412.jpg'
  }];

  it('should get mostActive and return parsed mostActive',()=>{
    service.getMostActive().subscribe((data)=>{
     const result = service.parseMostActive(data);
     expect(result).toBe(arrMostActive);
     expect(result.length).toBe(arrMostActive.length);
    });
    const req = httpTestingController.expectOne('https://api.geekdo.com/xmlapi2/hot?type=boardgame');
    expect(req.request.method).toBe('GET');
    req.flush(arrMostActive);
  });
  
});