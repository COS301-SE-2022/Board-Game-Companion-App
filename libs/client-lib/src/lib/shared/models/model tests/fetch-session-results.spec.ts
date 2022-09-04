import { TestBed } from '@angular/core/testing';
import { fetchSessionResults } from '../sessions/fetch-session-results';
describe('search result model test',()=>{
    let model: fetchSessionResults;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [fetchSessionResults],
        }).compileComponents();

      });

      it('should create ',()=>{
        model = new fetchSessionResults("game","file","7","28-09-22","1","23-11","lose","12345");
        expect(model).toBeDefined();
        expect(model.getBoardGame()).toBe("game");
        expect(model.getScript()).toBe("file");
        expect(model.getTimePlayed()).toBe("7");
        expect(model.getDate()).toBe("28-09-22");
        expect(model.getScore()).toBe("23-11");
        expect(model.getID()).toBe("12345");
        expect(model.getResult()).toBe("lose");
        expect(model.getNumOpponents()).toBe("1");
      });
});