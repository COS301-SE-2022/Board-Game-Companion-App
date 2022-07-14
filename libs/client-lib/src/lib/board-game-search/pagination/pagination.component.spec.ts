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
    component.ngOnInit;
    expect(component.boardsPerPage).toEqual(10);
  });

});