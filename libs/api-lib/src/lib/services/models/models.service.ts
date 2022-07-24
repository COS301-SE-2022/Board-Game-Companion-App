import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelsService {


    normalize(value:number,minimum:number,maximum:number){
        if(minimum === undefined || maximum === undefined)
            return value;

        return (value - minimum) / (maximum - minimum);
    }
}
