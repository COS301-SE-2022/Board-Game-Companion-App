import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';

import { ScriptExecutorComponent } from './script-executor.component';

describe('ScriptExecutorComponent', () => {
  let component: ScriptExecutorComponent;
  let fixture: ComponentFixture<ScriptExecutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScriptExecutorComponent],
      providers: [ScriptService],
      imports: [RouterTestingModule,HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptExecutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
