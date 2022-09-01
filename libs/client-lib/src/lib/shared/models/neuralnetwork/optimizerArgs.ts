export interface optimizerArgs{
    learningRate?:number;
    rho?:number;
    initialAccumulatorValue?:number;
    beta1?:number;
    beta2?:number;
    epsilon?:number;
    decay?:number;
    momentum?:number;
    useNesterov?:boolean;
    centered?:boolean;
}