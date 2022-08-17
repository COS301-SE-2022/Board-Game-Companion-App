import { user } from '../general/user';


export interface neuralnetworkDto{
    user: user;
    name: string;
    created: Date;
    accuracy: number;
    loss: number;
    type: string;
    labels: number[];
    min: number[];
    max: number[];
}