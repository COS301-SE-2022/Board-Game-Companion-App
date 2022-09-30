import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from './storage.service';
import 'fake-indexeddb/auto';

/***************************************** Unit * Testing ***********************************************/
describe('Test service',()=>{

  let service: StorageService;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[StorageService]});
    service = TestBed.inject(StorageService);
  });

  it('create service',()=>{
    expect(service).toBeTruthy();
  });
  it('constructor and one line functions',()=>{
    service = new StorageService();
    expect(service.getSupported()).toBeTruthy();
    expect(service.getOpenFailure()).toBeFalsy();
    expect(service.getOpenSuccess()).toBeFalsy();
    expect(service.getDatabaseName()).toBe('board-game-companion-database');
  });

  it('collections IndexedDB',async()=>{
    service = new StorageService();
    await expect(service.insert('collections',{name:'Root'})).resolves.toBe('Okay');
    await expect(service.insert('collection',{name:'favs',User:{name:'Njabulo',email:'njabulo@gmail.com'},game:'Root'})).rejects.toBe('collection does not exists.');

    await expect(service.update('collections',{name:'chess'})).resolves.toBe('Okay');
    await expect(service.update('collectionsss',{name:'favs',User:{name:'Njabulo',email:'njabulo@gmail.com'},game:'chess'})).rejects.toBe('collectionsss does not exists.');

    await expect(service.remove('collections','name','chess')).resolves.toBe('Okay');
    await expect(service.clear('download-networks')).resolves.toBe('Okay');
  });

  it('downloads-scripts IndexedDB',async()=>{
    await expect(service.insert('download-scripts',{_id:'09876543321'})).resolves.toBe('Okay');
    await expect(service.getByIndex('download-scripts','_id','09876543321')).resolves.toBeTruthy();
    await expect(service.getByIndex('downloads-scripts','_id','09876543321002')).rejects.toBe('downloads-scripts does not exists.');
    await expect(service.getByIndex('download-scripts','_id','09876543321002')).resolves.toBeUndefined();
    
    await expect(service.getById('download-scripts','09876543321002')).resolves.toBeUndefined();
  });

});
