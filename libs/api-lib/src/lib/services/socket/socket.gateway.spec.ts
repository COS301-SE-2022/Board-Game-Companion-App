import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server } from 'http';
import { SocketGateway } from './socket.gateway';
import { Test, TestingModule } from '@nestjs/testing';
import { any } from '@tensorflow/tfjs';


/********************************************************Unit Test***************************************/

describe('SocketGateway', () => {
    let service: SocketGateway;

    beforeEach(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            {
                provide: Server,
                useValue:{
                    emit: jest.fn(()=>{
                        return true;
                    })
                }
            }, SocketGateway],
        
        }).compile();
        service = module.get<SocketGateway>(SocketGateway)

    });

    it('should be defined', () => {
        expect(service).toBeDefined()
    });

    describe('handleConnection', ()=>{
        it('should handle connection',  ()=>{
            const result = service.handleConnection()
            
            expect(result).toBeDefined()
            
        });
    });

    //handleDisconnect
    describe('handleDisconnect', ()=>{
        it('should handle connection', async ()=>{
            expect(service.handleDisconnect()).toBeDefined()
        });
    });

    //send
    describe('send', ()=>{
        it('should send connection', ()=>{
            const result =  service.send("www.link", "data");
            if (result === null || result === undefined){
                expect(result).resolves.toBeFalsy();
            }else{
                expect(result).toBeDefined(); 
                expect(typeof(result)).toEqual(typeof({}))
            }
        });
    });


    describe('getUsers', ()=>{
        it('should get users', ()=>{
            expect(typeof(service.getUsers())).toEqual(typeof(2))
        })
    })

   

      describe('getLoggedInUsers', ()=>{
        it('should get logged in users', ()=>{
            expect(typeof(service.getLoggedInUsers())).toEqual(typeof(2))
        })
        })


   
});