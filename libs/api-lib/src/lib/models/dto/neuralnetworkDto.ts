import { user } from '../general/user';


export interface neuralnetworkDto{
    user: user;
    name: string;
    created: Date;
    accuracy: number;
    loss: number;
    type: string;
    labels: string[];
    min: number[];
    max: number[];
}