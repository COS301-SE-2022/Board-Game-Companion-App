import { TestBed } from '@angular/core/testing';
import {BggSearchService, MostActive} from './bgg-search.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import exp = require('constants');

describe('search service testing',()=>{
    let service:BggSearchService;
    
    beforeEach(() => {
        TestBed.configureTestingModule({imports: [RouterTestingModule,HttpClientTestingModule],providers:[BggSearchService]});
        service = TestBed.inject(BggSearchService);
    })

    it('check parseboardgamebyname',()=>{
        const input = "<items><item id = '0'><name value='root'></name></item><item id='1'><name value='root'></name></item><item id='2'></item><name value='root'></name></items>";
        const temp = service.parseGetBoardGameByName(input);
        expect(temp.length).toBe(3);
        expect(temp[0].id).toBe("0");
        expect(temp[1].id).toBe("1");
        expect(temp[2].id).toBe("2");
    })

    it('check parseboardgamebyid',()=>{
        const input = "<items><item id='2'><thumbnail value='#1'></thumbnail><name value='root'></name></item></items>";
        const temp = service.parseGetBoardGameById(input);
    
        expect(temp.id).toBe("2");
        expect(temp.name).toBe("root");
    })
})