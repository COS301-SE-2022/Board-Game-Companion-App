
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model,Query } from 'mongoose';
import { user } from '../../models/general/user';
import { Rating} from '../../schemas/rating.schema';
import { Report, ReportDocument } from '../../schemas/report.schema';
import { createMock } from '@golevelup/ts-jest';
import { ReportService } from './report.service';
import { any } from '@tensorflow/tfjs';
import { MyScript } from '../../schemas/my-script.schema';
import { AutomataScript } from '../../schemas/automata-script.schema';
import { DownloadScript } from '../../schemas/download-script.schema';
import { OldScript } from '../../schemas/old-script.schema';
import { Comment, CommentDocument } from '../../schemas/comment.schema';
import { AlertService } from '../alert/alert.service';
import { Alert } from '../../schemas/alert.schema';
import { SocketGateway } from '../socket/socket.gateway';

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
    const myReport: Report ={
        user: user1,
        script: true,
        link: "www.link.com",
        message: "This is a message",
        dateIssued: new Date("11-04-19")
    }

   beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [ReportService, AlertService,SocketGateway,
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
            }, {
                provide: getModelToken(MyScript.name), useValue:{}
            }, {
                provide: getModelToken(AutomataScript.name), useValue:{}
            }, 
            {
                provide: getModelToken(DownloadScript.name), useValue:{}
            }, 
            {
                provide: getModelToken(Comment.name), useValue:{}
            },
            {
                provide: getModelToken(OldScript.name), useValue:{}
            },
            {
                provide: getModelToken(Alert.name), useValue:{}
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

    describe('report', ()=>{
        it('should create a report', async()=>{
            expect(service.report(user1,true,"ww.link.com","This is a message")).resolves.toEqual(myReport)
        })
    });

    describe('getAll', ()=>{
        it('should get all report', async()=>{
            expect(service.getAll()).resolves.toEqual([myReport])
        })
    });

    describe('remove', ()=>{
        it('should remove script', async()=>{
            expect(service.remove("some ID")).resolves.toEqual(myReport)
        })
    }); 

    describe('getAll', ()=>{
        it('should get all reports', async()=>{
            expect(service.getAll()).resolves.toEqual([myReport])
        });
    });

    describe('remove', ()=>{
        it('should remove all reports', async()=>{
            expect(service.remove("some ID")).resolves.toEqual(myReport)
        });
    });

    describe('getByScript', ()=>{
        it('should remove report by ID', async()=>{
            expect(service.getByScript("some ID")).resolves.toEqual([myReport])
        });
    });

    describe('alreadyIssued', ()=>{
        it('should check if report already exits', async()=>{
            expect(service.alreadyIssued(user1, "www.link.com")).resolves.toEqual(true)
        });
    });

    describe('countReportedScripts', ()=>{
        it('should check if report already exits', async()=>{
            expect(service.countReportedScripts()).resolves.toEqual(3)
        });
    });

    describe('flag', ()=>{
        it('should flag the reported script', async()=>{
            expect(await service.flag("some ID")).toBeDefined()
        });
    });


});
