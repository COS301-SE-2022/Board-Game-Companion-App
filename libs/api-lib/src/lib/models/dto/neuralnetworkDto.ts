import { file } from '../general/files';
import { user } from '../general/user';
import { NeuralNetworkDiscriminator } from '../general/modelDiscriminator';

export interface neuralnetworkDto{
    creator: user;
    name: string;
    created: Date;
    labels: string[];
    min: number[];
    max: number[];
    loss: number;
    accuracy: number;
    model: file;
    weights: file;
    discriminator: NeuralNetworkDiscriminator
}