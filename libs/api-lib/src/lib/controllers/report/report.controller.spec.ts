import { Test, TestingModule } from "@nestjs/testing"
import { user } from '../../models/general/user';
import { ReportService } from '../../services/reports/report.service';
import { ApiReportsController} from '../../controllers/report/report.controller';
import { Report } from "../../schemas/report.schema";


jest.mock('../../services/reports/report.service');

/***************************************************Unit Test***********************************************/
describe('ApiMyScriptController',()=>{
  let service : ReportService;
  let controller: ApiReportsController;

  const newUser : user = {
    name: "user1",
    email:"user1@gmail.com"
  };

  const mockReport : Report ={
    user: newUser,
    script: true,
    link: "thislink.com",
    message: "This is a message",
    dateIssued: new Date("23-08-20"),
  }

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ApiReportsController], 
      providers: [ 
        {provide: ReportService, useValue: {}},
      ]
    }).compile();

    controller = moduleRef.get<ApiReportsController>(ApiReportsController);
    service = moduleRef.get<ReportService>(ReportService);
    
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  // describe('getAll', ()=>{
  //   it('should get all reports', ()=>{
  //     expect(controller.getAll()).resolves.toEqual([mockReport]);
  //   });
  // });

  // describe('report', ()=>{
  //   it('should create a new report', ()=>{
  //     expect(controller.report("user2","user2@gmail.com",true,"www.link2.com", "This is user2 message")).resolves.toEqual({
  //       user: {name:"user2", email:"user2@gmail.com"},
  //       script: true, 
  //       link: "www.link2.com",
  //       message: "This is user2 message",
  //       dateIssued: new Date("23-08-20"),
  //     })
  //   });
  // });


  // describe('remove', ()=>{
  //   it('should remove a script', ()=>{
  //     expect(controller.remove("some ID")).resolves.toEqual({
  //       mockReport
  //     })
  //   });
  // });

  // describe('retrieve-by-id', ()=>{
  //   it('should get a specific report', ()=>{
  //     expect(controller.getByScript("some ID")).resolves.toEqual([mockReport])
  //   });
  // });
  
  // describe('already-issued', ()=>{
  //   it('should display whenever a report already exists',()=>{
  //     expect(controller.alreadyIssued("user1", "user1@gmail.com","thislink.com")).resolves.toEqual(true);
  //   });
  // });

  // describe('count-reported', ()=>{
  //   it('should count the number of reports', ()=>{
  //     expect(controller.countReportedScripts()).resolves.toEqual(1);
  //   });
  // });

  // describe('flag', ()=>{
  //   it('should flag a milicious report', ()=>{
  //     expect(controller.flag("some ID")).toBeDefined();
  //   });
  // });

});
