import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisualHelpComponent } from './visual-help.component';
/**************************************Unit Testing*********************************************************/
describe('VisualHelpComponent', () => {
  let component: VisualHelpComponent;
  let fixture: ComponentFixture<VisualHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualHelpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test all functions run',()=>{
    component.creation();
    expect(component.isShown.create).toBe(true);

    component.setting();
    expect(component.isShown.setting).toBe(true);
    
    component.showif();
    expect(component.isShown.visualIf).toBeTruthy();

    component.showFor();
    expect(component.isShown.visualfor).toBe(true);

    component.showWhile();
    expect(component.isShown.visualwhile).toBe(true);

    component.uInput();
    expect(component.isShown.uiInn).toBe(true);

    component.uOutput();
    expect(component.isShown.uiOut).toBe(true);

    component.func();
    expect(component.isShown.math).toBe(true);

    component.preDefined();
    expect(component.isShown.predefined).toBe(true);

    component.return();
    expect(component.isShown.return).toBe(true);

    component.tile();
    expect(component.isShown.tile).toBe(true);

    component.player();
    expect(component.isShown.player).toBe(true);

    component.board();
    expect(component.isShown.board).toBe(true);

    component.neuralNetwork();
    expect(component.isShown.nNetwork).toBe(true);

    component.endgame();
    expect(component.isShown.endgame).toBe(true);

    component.showConditions();
    expect(component.isShown.cond).toBe(true);

    component.showActions();
    expect(component.isShown.actions).toBe(true);

    component.showTurn();
    expect(component.isShown.turn).toBe(true);
  });
});
