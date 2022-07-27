import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize variables accordingly', () =>{
    expect(component.left).toBe(1);
    expect(component.middle).toEqual(2);
    expect(component.right).toEqual(3);
    expect(component.current).toBe(1);
  });

  it('should assign 10 to number of boards per page',() =>{
    component.ngOnInit();
    component.ngOnChange();
    expect(component.boardsPerPage).toEqual(10);
    expect(component.current).toEqual(1);
  });

  it('should change page number',() =>{
    component.changePage(2);
    expect(component.current).toEqual(2);
  });

  it('should move to left or right',()=>{
    component.left = 5;
    component.right = 3;
    component.middle = 2;
    component.movePagination(true);
    expect(component.left).toEqual(4);
    expect(component.right).toEqual(2);
    expect(component.middle).toEqual(1);
    component.movePagination(false);
    expect(component.left).toEqual(6);
    expect(component.right).toEqual(4);
    expect(component.middle).toEqual(3);
  });

});