import { Test } from "@nestjs/testing"
import { AutomataService } from "../../services/automata/automata.service"
import { RatingService } from "../../services/ratings/rating.service"
import { ApiAutomataScriptController } from "../automata-scripts/automata-script.controller"

jest.mock('../../services/automata/automata.service');
describe('AutomataScriptController',()=>{
  beforeEach(async () =>{
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [ApiAutomataScriptController],
      providers: [AutomataService, RatingService]
    }).compile();
  })
})
