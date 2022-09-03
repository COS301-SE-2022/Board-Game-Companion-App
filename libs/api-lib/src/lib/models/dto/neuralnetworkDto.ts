import { file } from '../general/files';
import { user } from '../general/user';


export interface neuralnetworkDto{
    creator: user;
    name: string;
    created: Date;
    accuracy: number;
    loss: number;
    type: string;
    labels: string[];
    min: number[];
    max: number[];
    model: file;
    weights: file;
    discriminator: NeuralNetworkDiscriminator
}