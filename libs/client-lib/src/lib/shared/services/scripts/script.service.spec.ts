import { TestBed } from '@angular/core/testing';
import { script } from '../../models/scripts/script';
import { rating } from '../../models/scripts/rating';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { empty } from '../../models/editor/entity';
import { ScriptService } from './script.service';
import { HttpParams } from '@angular/common/http';
import { downloadScript } from '../../models/scripts/download-script';
import { automataScript } from '../../models/scripts/automata-script';
import { myScript } from '../../models/scripts/my-script';

/************************************************** Unit Tests ***********************************************/
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

  it('should create',()=>{
    expect(service).toBeTruthy();
  });

  it('should return api URL',()=>{
    const url = service.getApiUrl();
    expect(url).toBe('https://board-game-companion-app.herokuapp.com/api/');
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
    programStructure: {type:'root',name:'root',endLine:0,endPosition:0,startLine:0,startPosition:0,properties:[],children:[]},
    source: {name:'',location:'',key:''},
    build: {name:'',location:'',key:''},
    icon: {name:'',location:'',key:''},
    models: [],
    __v: 0,
  };

  it('should get script by id', ()=>{
    service.getScriptById('171').subscribe((data)=>{
      expect(data).toEqual(exScript);
    });
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/scripts/retrieve/byid?id=171');
    expect(req.request.method).toBe('GET');
    req.flush(exScript);
  });

  it('should save the script and return it.', ()=>{
    service.saveScript(new FormData()).subscribe((data)=>{
      expect(data).toEqual(exScript);
    });
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/my-scripts/create-script');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(new FormData());
    req.flush(exScript);
  });

  it('should add a comment', ()=>{
    service.addComment('171','12345');

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/automata-scripts/add-comment');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({scriptId:'171',commentId:'12345'});
  });

  it('should remove a script', ()=>{
    service.removeScript('171').subscribe();

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/scripts/remove/171');
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

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/scripts/update');
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

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/scripts/retrieve/all');
    expect(req.request.method).toBe('GET');
    // expect(req.request.body).toBe({});

    req.flush([exScript]);
  });

  it('should return a file data given a url',()=>{
    service.getFileData('https://board-game-companion-app.herokuapp.com/api/scripts/file').subscribe((data)=>{
      expect(data).toEqual({ 
        name: 'chess',
        awsKey: '',
        location: 'https://aws.'});
    });

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/scripts/file');
    expect(req.request.method).toBe('GET');
    expect(req.flush({ 
      name: 'chess',
      awsKey: '',
      location: 'https://aws.'}));
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

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/automata-scripts/rate');
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

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/automata-scripts/retrieve-rating?userName=NN&userEmail=NN@zak.uk.co&script=chessMaster');
    expect(req.request.method).toBe('GET');
    let param = new HttpParams();
    param = param.set('userName','NN');
    param = param.set('userEmail','NN@zak.uk.co');
    param = param.set('script','chessMaster');

    req.flush(exRating);
  });

  it('should get count Rating',()=>{
    service.countRating('chessRating').subscribe((data)=>{
      expect(data).toBe(1);
    });
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/automata-scripts/count-rating?script=chessRating');
    expect(req.request.method).toBe('GET');
    let param = new HttpParams();
    param = param.set('script','chessMaster');

    req.flush(1);
  });

  it('should average rating of the script',()=>{
    service.averageRating('chessMaster').subscribe((data)=>{
      expect(data).toBe(4);
    });
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/automata-scripts/average-rating?script=chessMaster');
    expect(req.request.method).toBe('GET');
    let param = new HttpParams();
    param = param.set('script','chessMaster');

    req.flush(4);
  });

  it('should update Script Model',()=>{
    service.updateScriptModels('6304be14c0a7933d955d3ecf',['6304be14c0a7933d955d3ecf']).subscribe((data)=>{
      expect(data).resolves;
    });

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/scripts/update-models');
    expect(req.request.method).toBe('PUT');
    req.flush(exScript);
  });

  it('should update status',()=>{
    service.updateStatus('6304be14c0a7933d955d3ecf',1,'It is faulty').subscribe((data)=>{
      expect(data).resolves;
    });

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/scripts/update/status');
    expect(req.request.method).toBe('PUT');
    req.flush(exScript);
  });

  const myDownloaded:downloadScript[]=[{
    _id: '6304be14c0a7933d955d3ecf',
    link:'',
    owner:{name:'Certe',email:'Ezee@gmail.com'},
    dateDownloaded: new Date(0),
    name:'popOff',
    author: {name:'Njabulo',email:'njabulo@gmail.com'},
    boardgame:'',
    description:'',
    version: {major:1,minor:1,patch:0},
    size:0,
    icon: {name:'',location:'',key:''},
    build: {name:'',location:'',key:''},
    models: [],}];

  it('should check the name',()=>{
    window.sessionStorage.setItem('name','James');
    window.sessionStorage.setItem('email','james@yahoo.com')
      service.checkName('board-chess').subscribe((data)=>{
      expect(data).toBeTruthy();
    });

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/my-scripts/check-name?name=board-chess&userEmail=james@yahoo.com&userName=James');
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should return true if already downloaded',()=>{
    window.sessionStorage.setItem('name','James');
    window.sessionStorage.setItem('email','james@yahoo.com')
    service.alreadyDownloaded({name:'Njabulo',email:'njabulo@gmail.com'},'board-chess',{major:1,minor:0,patch:2}).subscribe((data)=>{
    expect(data).toBeTruthy();
    });

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/download-scripts/already-downloaded?authorName=Njabulo&authorEmail=njabulo@gmail.com&ownerEmail=james@yahoo.com&ownerName=James&name=board-chess&vMajor=1&vMinor=0&vPatch=2');
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should return downloaded',()=>{
    service.getDownloadedScript('6304be14c0a7933d955d3ecf').subscribe((data)=>{
      expect(data).toBeDefined();
    });

      const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/download-scripts/retrieve-id?id=6304be14c0a7933d955d3ecf');
      expect(req.request.method).toBe('GET');
      req.flush(myDownloaded[0]);
  });

  const mockAutScripts:automataScript[]=[{
    _id:'6304be14c0a7933d955d3ecf',
    dateReleased:  new Date('14-07-2022'),
    downloads: 334,
    lastDownload: new Date('23-09-2022'),
    export: true,
    comments: ['Wow! Good!'],
    rating:0,
    source: { name: '', key: '', location: ''},
    previous: [],
    name: 'killer-type',
    author:{name:'John',email:'Smith@gmail.com'},
    boardgame:'',
    description: "",
    version:{major:1,minor:1,patch:1},
    size: 0,
    icon: {name:'',location:'',key:''},
    build: {name:'',location:'',key:''},
    models: [],
    link: "http://localhost:3333/api/"
  }];

  const mockMyScripts:myScript[]=[{
    _id: '',
    created:new Date(0),
    lastUpdate: new Date(0),
    status:{value:0,message:''},
    export: false,
    programStructure:empty,
    source:{ name: '', location: '', key: ''},
    name:'',
    author: {name:'',email:''},
    boardgame: '',
    description: '',
    version: {major:4,minor:0,patch:3},
    size: 0,
    icon: {name:'',location:'',key:''},
    build: {name:'',location:'',key:''},
    models: [],
  }];
  it('release a script',()=>{
    service.release('6304be14c0a7933d955d3ecf',{major:23,minor:1,patch:3}).subscribe((data)=>{
      expect(data.success).toBeTruthy();
    });

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/my-scripts/release?id=6304be14c0a7933d955d3ecf&vMajor=23&vMinor=1&vPatch=3');
    expect(req.request.method).toBe('GET');
    req.flush({sucess:true});
  });

  it('should get download script',()=>{
    window.sessionStorage.setItem('name','Njabulo');
    window.sessionStorage.setItem('email','Convo@forE.co.za');
    service.getDownloadScripts().subscribe((data)=>{
      expect(data).toBeTruthy();
    });

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/download-scripts/retrieve-all?ownerName=Njabulo&ownerEmail=Convo@forE.co.za');
    expect(req.request.method).toBe('GET');
    req.flush(mockAutScripts);
  });
  
  it('should remove download script',()=>{
    service.removeDownload('6304be14c0a7933d955d3ecf').subscribe((data)=>{
      expect(data).toBeTruthy();
    });

    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/download-scripts/remove?id=6304be14c0a7933d955d3ecf');
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  it('get other scripts',()=>{
    service.getOther({name:'njabulo',email:'skoS@gmial.com'}).subscribe(
      (data)=>{
        expect(data).resolves;
      }
    );
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/scripts/retrieve/other?ownerName=njabulo&ownerEmail=skoS@gmial.com');
    expect(req.request.method).toBe('GET');
    req.flush([exScript]);
  });
  it('get downloaded bY ME scripts',()=>{
    service.getScriptsDownloadedByMe({name:'njabulo',email:'skoS@gmial.com'}).subscribe(
      (data)=>{
        expect(data).resolves;
      }
    );
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/scripts/retrieve/downloadedByMe?ownerName=njabulo&ownerEmail=skoS@gmial.com');
    expect(req.request.method).toBe('GET');
    req.flush([exScript]);
  });
  it('import Automatascript',()=>{
    window.sessionStorage.setItem('name','James');
    window.sessionStorage.setItem('email','james@yahoo.com')
    service.importAutomata('42ehd433h41graew54').subscribe(
      (data)=>{
        expect(data).resolves;
      }
    );
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/my-scripts/import?id=42ehd433h41graew54&userEmail=james@yahoo.com&userName=James');
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('Update download script',()=>{
    service.updateDownloadedScript({oldId: '42ehd433h41graew54',newId: '6304be14c0a7933d955d3ecf'}).subscribe(
      (data)=>{
        expect(data).resolves;
      }
    );
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/download-scripts/update');
    expect(req.request.method).toBe('PUT');
    req.flush(myDownloaded[0]);
  });

  it('download script',()=>{
    window.sessionStorage.setItem('name','James');
    window.sessionStorage.setItem('email','james@yahoo.com')
    service.download('42ehd433h41graew54').subscribe(
      (data)=>{
        expect(data).resolves;
      }
    );
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/automata-scripts/download?id=42ehd433h41graew54&userEmail=james@yahoo.com&userName=James');
    expect(req.request.method).toBe('GET');
    req.flush(myDownloaded[0]);
  });

  it('created By ME script',()=>{
    window.sessionStorage.setItem('name','James');
    window.sessionStorage.setItem('email','james@yahoo.com')
    service.getScriptsCreatedByMe().subscribe(
      (data)=>{
        expect(data).resolves;
      }
    );
    const req = httpTestingController.expectOne('https://board-game-companion-app.herokuapp.com/api/my-scripts/all-my-script?userName=James&userEmail=james@yahoo.com');
    expect(req.request.method).toBe('GET');
    req.flush([mockMyScripts]);
  });
});
