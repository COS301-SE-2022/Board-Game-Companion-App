import { TestBed } from '@angular/core/testing';
import { SearchResult } from '../search-result';
describe('search result model test',()=>{
    let model: SearchResult;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [SearchResult],
        }).compileComponents();

      });

      it('should create ',()=>{
        model = new SearchResult("Tom","imh.jpg","23","frd","5","10","4","7","mind","12345");
        expect(model).toBeDefined();
        expect(model.getName()).toBe("Tom");
        expect(model.getimgUrl()).toBe("imh.jpg");
        expect(model.getAge()).toBe("23");
        expect(model.getCategory()).toBe("mind");
        expect(model.getDesigner()).toBe("frd");
        expect(model.getID()).toBe("12345");
        expect(model.getMaxPlayTime()).toBe("7");
        expect(model.getMinPlayTime()).toBe("4");
        expect(model.getMaxPlayers()).toBe("10");
        expect(model.getMinPlayers()).toBe("5");
      });
});