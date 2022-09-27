import { TestBed } from '@angular/core/testing';
import { HttpClientModule} from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { ModelsService } from './models.service';
import 'fake-indexeddb/auto';
import * as tf from '@tensorflow/tfjs';
import { layer } from '../../models/neuralnetwork/layer';
import { optimizerArgs } from '../../models/neuralnetwork/optimizerArgs';
// import createContext from 'gl';

/******************************************* Integration Tests ***************************************/
describe('Test script service',()=>{

  let service: ModelsService;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientModule],providers:[ModelsService,StorageService]});
    service = TestBed.inject(ModelsService);
  });

  it('should create',()=>{
    expect(service).toBeTruthy();
  });

  it('GET a model',(done)=>{
    window.sessionStorage.setItem('name','The Wot');
    window.sessionStorage.setItem('email','kylehaarhoff101@gmail.com');

    service.getModel('632b07aa11900247cfbbc05e').subscribe((response)=>{
      expect(response).resolves;
      done();
    });
  });

  it('GET all models',(done)=>{
    service.getAll().subscribe((response)=>{
      expect(response).resolves;
      done();
    });
  });

  it('GET models when passed list of ids',(done)=>{
    window.sessionStorage.setItem('name','The Wot');
    window.sessionStorage.setItem('email','kylehaarhoff101@gmail.com');

    service.getModels(['632b07aa11900247cfbbc05e']).subscribe((response)=>{
      expect(response).resolves;
      done();
    });
  });

  it('GET Models by Id Only',(done)=>{
    service.getModelsByIdOnly(['632b07aa11900247cfbbc05e']).subscribe((response)=>{
      expect(response).resolves;
      done();
    });
  });

  // it('Let the function set Layer from tensorflow',()=>{
  //   let Layer:any;

  //   //start with elu
  //   Layer = service.setLayer(3,'elu');
  //   expect(Layer.activation).toBe('elu');
  //   //hardSigmoid
  //   Layer = service.setLayer(4,'hardSigmoid');
  //   expect(Layer.activation).toBe('hardSigmoid');
  //   //linear
  //   Layer = service.setLayer(2,'linear');
  //   expect(Layer.activation).toBe('linear');
  //   //relu
  //   Layer = service.setLayer(7,'relu');
  //   expect(Layer.activation).toBe('relu');
  //   //relu6
  //   Layer = service.setLayer(3,'relu6');
  //   expect(Layer.activation).toBe('relu6');
  //   //selu
  //   Layer = service.setLayer(8,'selu');
  //   expect(Layer.activation).toBe('selu');
  //   //sigmoid
  //   Layer = service.setLayer(5,'sigmoid');
  //   expect(Layer.activation).toBe('sigmoid');
  //   //softmax
  //   Layer = service.setLayer(6,'softmax');
  //   expect(Layer.activation).toBe('softmax');
  //   //softplus
  //   Layer = service.setLayer(1,'softplus');
  //   expect(Layer.activation).toBe('softplus');
  //   //tanh
  //   Layer = service.setLayer(9,'tanh');
  //   expect(Layer.activation).toBe('tanh');
  //   //
  // });

  it('create a Model',()=>{

    const Layer: layer[] = [];

    Layer.push({
      index: 1,
      activation: 'softmax',
      nodes: 2,
  });
    Layer.push({
      index: 2,
      activation: 'tanh',
      nodes: 3
  });
    const modell = service.createModel(2,2,Layer);
    expect(modell).toBeDefined();
  });

  it('Optimize the model',()=>{

    const values:optimizerArgs={
      learningRate:0.3,
      rho:0.4,
      initialAccumulatorValue:0.1,
      beta1:-0.5,
      beta2:0.9,
      epsilon:0.2,
      decay:-0.3,
      momentum:0.7,
      useNesterov:false,
      centered:true
    }
    let opt: any;
    //opt=1
    opt = service.getOptimizationFunction(1,values);
    expect(opt).toBeDefined();
    //opt=2
    opt = service.getOptimizationFunction(2,values);
    expect(opt).toBeDefined();
    //opt=3
    opt = service.getOptimizationFunction(3,values);
    expect(opt).toBeDefined();
    //opt=4
    opt = service.getOptimizationFunction(4,values);
    expect(opt).toBeDefined();
    //opt=5
    opt = service.getOptimizationFunction(5,values);
    expect(opt).toBeDefined();
  });
});

  