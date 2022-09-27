import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CollectionService } from './collection.service';
import { response } from 'express';

/***************************************Integration Tests*******************************************/
describe('Test collection service',()=>{

  let service: CollectionService;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientModule],providers:[CollectionService]});
    service = TestBed.inject(CollectionService);
  });

  it('Collection service',()=>{
    expect(service).toBeTruthy();
  });

  it('POST a new Collection as User',(done)=>{
    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za');

    service.createCollection('favourites').subscribe(response=>{
      expect(response.owner.email).toBe('u19062665@tuks.co.za');
      done();
    });
  });

  it('PUT Game to the collection',(done)=>{
    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za');

    service.addGameToCollection('favourites','342942').subscribe((response)=>{
      expect(response).toBeTruthy();
      done();
    });
  });

  it('GET collection which exists already',(done)=>{
    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za');

    service.alreadyExists('favourites').subscribe((response)=>{
      expect(response).toBeTruthy();
      done();
    });
  });

  it('GET collections For User',(done)=>{
    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za');

    service.getCollectionsForUser().subscribe((response)=>{
      expect(response[0].owner.email).toBe('u19062665@tuks.co.za');
      done();
    });
  });
/*
    THE FUNCTION THROWS AN EXCEPTION WHEN IT RECEIVES AN INVALID 'Id'
    NEEDS TO BE TAKEN CARE OF.
*/
  // it('GET scripts based on id',(done)=>{
  //   try{
  //     service.getScripts('1234567890').subscribe((response)=>{
  //       expect(response.length).toEqual(0);
  //     });
  //   }
  //   catch(e){
  //     console.log(e);
  //   }
  // });

  it('DELETE a Board Game',(done)=>{
    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za');

    service.removeBoardGame('favourites','monopoly').subscribe((response)=>{
      expect(response).toEqual(0);
      done();
    });
  });

  it('DELETE a Collection', (done)=>{
    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za');

    service.removeCollection('favourites').subscribe((response)=>{
      expect(response).toBe(1);
      done();
    });
  });
/*
    THE FUNCTION THROWS AN EXCEPTION WHEN IT RECEIVES AN INVALID 'Id'
    NEEDS TO BE TAKEN CARE OF.
*/
  // it('DELETE a collection by Id',(done)=>{
  //   try{
  //   service.removeCollectionById('1234567890').subscribe((response)=>{
  //     expect(response).toBe(0);
  //     done();
  //   });
  // }
  // catch(e){
  //   console.log(e);
  //   done();
  // }

  // });
});