import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../client-lib-routing.module';
import { AddToCollectionComponent } from './add-to-collection.component';

let store: any = {};
describe('AddToCollectionComponent', () => {
  let component: AddToCollectionComponent;
  let fixture: ComponentFixture<AddToCollectionComponent>;

  beforeEach(async ()=> {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [{provide: ActivatedRoute, useValue:
        { snapshot: { paramMap: convertToParamMap( { 'id': '998877' } ) } } }],
      declarations: [AddToCollectionComponent]
    }).compileComponents();
  });

  beforeEach(()=> {
    // fixture = TestBed.createComponent(AddToCollectionComponent);
    // component =  fixture.componentInstance;
    // fixture.detectChanges();

    const mockLocalStorage = {
      getItem: (key: string): string => {
      return key in store ? store[key] : null },

      setItem: (key: string, value: string) => {
      store[key] = `${value}`;},

      removeItem: (key: string) => {
      delete store[key];},

      clear: () => {
        store = {};
      }
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    })

  });

  it('should create', ()=>{
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('options should have empty array', ()=>{
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    expect(component.options).toEqual([]);
  });

  it('should initialize id with ""', ()=>{
        fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    expect(component.id).toBe("1010");
  });

  it('should add new Collection', ()=>{
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    component.newCollection();
  });

  it('should add new Collection if exist collections', ()=>{
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    component.newCollection();
  });

  it('should add new Collection if exist collections', ()=>{
    store = {collections:JSON.stringify(['favs'])};
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    component.newCollection();
  });
  it('should add a Collection', ()=>{

    store = {games:JSON.stringify(['other','favs'])};
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    component.named = 'games';
    component.addtoCollection();
  });
  it('should ngOnInit()', ()=>{
    store = {collections:JSON.stringify(['favs'])};
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    component.ngOnInit();
  });
});
