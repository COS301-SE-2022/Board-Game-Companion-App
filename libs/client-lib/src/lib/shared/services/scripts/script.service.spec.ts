import { TestBed } from '@angular/core/testing';
import { script } from '../../models/script';
import { rating } from '../../models/rating';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ScriptService } from './script.service';
import { HttpParams } from '@angular/common/http';

describe('Test script service',()=>{

  let service: ScriptService;
  let httpTestingController: HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[ScriptService]});
    service = TestBed.inject(ScriptService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('testing testing',()=>{
    expect(service).toBeTruthy();
  });

  it('should return api URL',()=>{
    const url = service.getApiUrl();
    expect(url).toBe('http://localhost:3333/api/');
  });

  it('should return Bbg URL',()=>{
    const url = service.getBbgUrl();
    expect(url).toBe('https://api.geekdo.com/xmlapi2/');
  });
  const text = '<items total="1" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">'
  +'<item type="boardgame" id="171">'
  +'<name type="primary" value="Chess"/>'
  +'<yearpublished value="1475"/>'
  +'</item>'
  +'</items>';

  it('should get BoardGame by name', ()=>{
    service.getBoardGameByName('chess',true).subscribe((data)=>{
      expect(data).toEqual(text);
    });
    const req = httpTestingController.expectOne('https://api.geekdo.com/xmlapi2/search?query=chess&type=boardgame&exact=1');
    expect(req.request.method).toBe('GET');
    req.flush(text);
  });

  const exScript: script = {
    _id: '171',
    name: 'chess',
    author: {name:'MasJay',email:'ZTS@gmail.com'},
    owner:{name:'PRo',email:'pro@gmail.com'},
    boardgame: '',
    description: '',
    created: new Date(0),
    release: new Date(0),
    downloads: 1232,
    lastdownload: new Date(0),
    lastupdate: new Date(0),
    public: true,
    export: true,
    status: {value:2,message:'The script is currently running'},
    size: 0,
    comments: [],
    source: {name:'',location:'',awsKey:''},
    build: {name:'',location:'',awsKey:''},
    icon: {name:'',location:'',awsKey:''},
    __v: 0,
  };

  it('should get script by id', ()=>{
    service.getScriptById('171').subscribe((data)=>{
      expect(data).toEqual(exScript);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/retrieve/byid?id=171');
    expect(req.request.method).toBe('GET');
    req.flush(exScript);
  });

  it('should save the script and return it.', ()=>{
    service.saveScript(new FormData()).subscribe((data)=>{
      expect(data).toEqual(exScript);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/create-script');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(new FormData());
    req.flush(exScript);
  });

  it('should add a comment', ()=>{
    service.addComment('171','12345');

    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/add-comment');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({scriptId:'171',commentId:'12345'});
  });

  it('should remove a script', ()=>{
    service.removeScript('171').subscribe();

    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/remove/171');
    expect(req.request.method).toBe('DELETE');
  });

  it('should update script information',()=>{
    service.updateScriptInfo({
      id:'171',
      name:'chess',
      downloads: 2321,
      lastupdate: new Date(0)
    }).subscribe((data)=>{
      expect(data).toEqual(exScript);
    });

    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/update');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      id:'171',
      name:'chess',
      downloads: 2321,
      lastupdate: new Date(0)
    });

    req.flush(exScript);
  });

  it('should return a list of scripts',()=>{
    service.retrieveAllScript().subscribe((data)=>{
      expect(data.length).toEqual(1);
      expect(data).toEqual([exScript]);
    });

    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/retrieve/all');
    expect(req.request.method).toBe('GET');
    // expect(req.request.body).toBe({});

    req.flush([exScript]);
  });

  it('should return a file data given a url',()=>{
    service.getFileData('http://localhost:3333/api/scripts/file').subscribe((data)=>{
      expect(data).toEqual({ 
        name: 'chess',
        awsKey: '',
        location: 'https://aws.'});
    });

    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/file');
    expect(req.request.method).toBe('GET');
    expect(req.flush({ 
      name: 'chess',
      awsKey: '',
      location: 'https://aws.'}));
  });

  it('should update file and return message in an object',()=>{
    service.updateFile('12345','chess chess chess').subscribe((data)=>{
      expect(data).toBe({message:'update was successful'});
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/update-file');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toStrictEqual({id:'12345',name:name,content:'chess chess chess'});

    req.flush({message:'update was successful'});
  });
  const exRating: rating ={
    _id: '25',
    user: {name:'NN',email: 'NN@zak.uk.co'},
    script: 'chessMaster',
    value: 4
  };

  it('should rate the script and return the rating',()=>{
    service.rate({name:'NN',email: 'NN@zak.uk.co'},'chessMaster',4).subscribe((data)=>{
      expect(data).toBe(exRating);
    });

    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/rate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toStrictEqual({
      user:{name:'NN',email: 'NN@zak.uk.co'},
      script:'chessMaster',
      value:4
    });
    req.flush(exRating);
  });

  it('should get script rating and return it',()=>{
    service.getRating({name:'NN',email: 'NN@zak.uk.co'},'chessMaster').subscribe((data)=>{
      expect(data).toBe(exRating);
    });

    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/retrieve-rating?userName=NN&userEmail=NN@zak.uk.co&script=chessMaster');
    expect(req.request.method).toBe('GET');
    let param = new HttpParams();
    param = param.set('userName','NN');
    param = param.set('userEmail','NN@zak.uk.co');
    param = param.set('script','chessMaster');

    // expect(req.request.params).toBe({params:param});
    req.flush(exRating);
  });

  it('should get count Rating',()=>{
    service.countRating('chessRating').subscribe((data)=>{
      expect(data).toBe(1);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/count-rating?script=chessRating');
    expect(req.request.method).toBe('GET');
    let param = new HttpParams();
    param = param.set('script','chessMaster');
    // expect(req.request.params).toEqual({params:param});

    req.flush(1);
  });

  it('should average rating of the script',()=>{
    service.averageRating('chessMaster').subscribe((data)=>{
      expect(data).toBe(4);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/average-rating?script=chessMaster');
    expect(req.request.method).toBe('GET');
    let param = new HttpParams();
    param = param.set('script','chessMaster');
    // expect(req.request.params).toEqual({params:param});

    req.flush(4);
  });

});
