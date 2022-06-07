import { Injectable, NotFoundException, StreamableFile, /*UploadedFile, UseInterceptors*/ } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Metadata } from '../../schemas/Metadata';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class ScriptEditorService {
    constructor(@InjectModel('Metadata')private metadataModel: Model<Metadata> ){}
    async saveFile(metadata: Metadata) : Promise<string>{

        const scriptEd = new this.metadataModel({
            author: metadata.author,
            downloads: metadata.downloads,
            ratings: metadata.ratings,
            filename: metadata.filename
        });
        const saved = await scriptEd.save();
        
        if(!saved)
            return "The file is saved successfully to the database.";
        else
            return "Not saved in the database"; 

    }
    async FileUpdate(author: string) : Promise<StreamableFile>{

        if(author==""){
            throw new NotFoundException("NO AUTHOR PROVIDED");
        }
        const found = await this.metadataModel.find({author:author});
        const file = createReadStream(join(process.cwd(), "uploads/scripts/"+found[0].filename));
        return new StreamableFile(file);
    }
}
