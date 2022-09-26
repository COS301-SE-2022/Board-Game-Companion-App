
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model,Query } from 'mongoose';
import { user } from '../../models/general/user';
import { Rating} from '../../schemas/rating.schema';
import { Report, ReportDocument } from '../../schemas/report.schema';
import { createMock } from '@golevelup/ts-jest';
import { ReportService } from './report.service';
import { any } from '@tensorflow/tfjs';

/********************************************************Unit Test***************************************/
describe('ReportService', () => {
   let service: ReportService;
    let model :  Model<ReportDocument>;

    const user1 : user ={
        name: "user1",
        email: "user1@gmail.com",
    };
    const user2: user ={
        name: "user2",
        email: "user2@gmail.com",
    }

   beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [ReportService,
            {
                provide: getModelToken(Report.name),
                useValue :
                {
                    constructor: jest.fn(dto =>{
                        return{
                            ...dto
                        }
                    }), 
                    find: jest.fn(),
                    fineById: jest.fn(),
                    findByIdAndDelete: jest.fn(),
                    countDocuments: jest.fn(),
                    distinct: jest.fn(),
                    exec: jest.fn(),
                    save:jest.fn()
                },
            }
        ]
    }).compile();
    service = module.get<ReportService>(ReportService);
    model = module.get<Model<ReportDocument>>(getModelToken(Report.name));

   });

   it('should be defined', () => {
        expect(service).toBeDefined();
        expect(model).toBeDefined();
    });

    it('should return all reports', async()=>{
        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce([{
                user: user1, 
                script: "script1", 
                message:"user1 message",
                dateIssued: new Date("12-02-18")
            },
            {
             user: user2, 
            script: "script2", 
            message:"user2 message",
            dateIssued: new Date("12-03-19")
            }]),
        }as any);
        const result = await service.getAll();
        expect(model).toBeTruthy();
        expect(result).toEqual([{
            user: user1, 
            script: "script1", 
            message:"user1 message",
            dateIssued: new Date("12-02-18")
        },
        {   
            user: user2, 
            script: "script2", 
            message:"user2 message",
            dateIssued: new Date("12-03-19")
        }])
    });

    it('should return a script with a specific id', async()=>{

       const result =  service.getByScript("someID");
       
       expect(result).toBeDefined();
       //expect(await model.find({"script":"someID"})).toContain(result)
    });

    it('should return if user is already assigned', async()=>{
        const result = jest.spyOn(service,'getAll');
        if(result === undefined){
            expect(service.alreadyIssued).toBeFalsy();
        }
    });

    it('should return counted scripts', async()=>{
        const result = model.distinct('field');
        expect(result).toHaveLength;
    }); 

});
