import { Injectable } from '@nestjs/common';

@Injectable()
export class CompilerService {
    
    compile(input:string):string{
        return "compile " + input;
    }

    scan(input:string):string{
        return "scan " + input;
    }

    parse(input:string):string{
        return "parse " + input;
    }
}
