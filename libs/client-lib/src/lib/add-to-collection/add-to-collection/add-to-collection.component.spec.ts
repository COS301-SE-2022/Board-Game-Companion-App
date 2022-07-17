import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddToCollectionComponent } from './add-to-collection.component';

describe('AddToCollectionComponent', () => {
  let component: AddToCollectionComponent;
  let fixture: ComponentFixture<AddToCollectionComponent>;

  beforeEach(async ()=> {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AddToCollectionComponent]
    }).compileComponents();
  });

  beforeEach(()=> {
    // fixture = TestBed.createComponent(AddToCollectionComponent);
    // component =  fixture.componentInstance;
    // fixture.detectChanges();

    let store: any = {};

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
});
