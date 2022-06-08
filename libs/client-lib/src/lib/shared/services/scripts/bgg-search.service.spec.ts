import { TestBed } from '@angular/core/testing';
import { ScriptService } from './script.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import exp = require('constants');

describe('search service testing',()=>{
    let service:ScriptService;

    beforeEach(() => {
        TestBed.configureTestingModule({imports: [RouterTestingModule,HttpClientTestingModule],providers:[ScriptService]});
        service = TestBed.inject(ScriptService);
    })
})