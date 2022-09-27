import { entity } from './entity';

export interface transpilationResponse{
    status: string;
    message: string;
    errors: string[];
    structure?: entity
}