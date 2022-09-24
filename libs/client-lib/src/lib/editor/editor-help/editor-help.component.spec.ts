import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorHelpComponent } from './editor-help.component';

describe('EditorHelpComponent', () => {
  let component: EditorHelpComponent;
  let fixture: ComponentFixture<EditorHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorHelpComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test all functions',()=>{
    component.showType();
    expect(component.isShown.dataType).toBeTruthy();

    component.showDecl();
    expect(component.isShown.declaration).toBeTruthy();

    component.showArithmetic();
    expect(component.isShown.arithmetic).toBeTruthy();

    component.showLogical();
    expect(component.isShown.logical).toBeTruthy();

    component.showCond();
    expect(component.isShown.cond).toBeTruthy();

    component.showRelation();
    expect(component.isShown.relation).toBeTruthy();

    component.showif();
    expect(component.isShown.ifState).toBeTruthy();

    component.showifelse();
    expect(component.isShown.ifelse).toBeTruthy();

    component.showFor();
    expect(component.isShown.for).toBeTruthy();

    component.showWhile();
    expect(component.isShown.while).toBeTruthy();

    component.showContinue();
    expect(component.isShown.continue).toBeTruthy();

    component.uInput();
    expect(component.isShown.uiInn).toBeTruthy();

    component.uOutput();
    expect(component.isShown.uiOut).toBeTruthy();

    component.endgame();
    expect(component.isShown.endgame).toBeTruthy();

    component.card();
    expect(component.isShown.card).toBeTruthy();

    component.tile();
    expect(component.isShown.tile).toBeTruthy();

    component.player();
    expect(component.isShown.player).toBeTruthy();

    component.state();
    expect(component.isShown.state).toBeTruthy();

    component.neuralNetwork();
    expect(component.isShown.nNetwork).toBeTruthy();

    component.DecisionTree();
    expect(component.isShown.DTree).toBeTruthy();

    component.minmaxAlgo();
    expect(component.isShown.minmax).toBeTruthy();

    component.showActions();
    expect(component.isShown.actions).toBeTruthy();

    component.showTurn();
    expect(component.isShown.turn).toBeTruthy();
  });
});
