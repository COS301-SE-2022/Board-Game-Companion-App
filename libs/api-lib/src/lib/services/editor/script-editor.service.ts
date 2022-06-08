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
        /*this.metadataModel.findOneAndUpdate({author: metadata.author,
            downloads: metadata.downloads,
            ratings: metadata.ratings,
            filename: metadata.filename,
            script: metadata.script
        });*/

        //if you find one, update it with two , upsert: if you find it great else create it 
        const saved = await this.metadataModel.findOneAndUpdate({author:metadata.author, filename:metadata.filename},{author: metadata.author,
            downloads: metadata.downloads,
            ratings: metadata.ratings,
            filename: metadata.filename,
            script: metadata.script
        },{upsert:true});
        console.log(metadata);
        /*const scriptEd = new this.metadataModel({
            author: metadata.author,
            downloads: metadata.downloads,
            ratings: metadata.ratings,
            filename: metadata.filename,
            script: metadata.script
        });
        const saved = await scriptEd.save();*/
        
        if(!saved)
            return "The file is saved successfully to the database.";
        else
            return "Not saved in the database"; 

    }
    async FileUpdate(author: string, filename: string ) : Promise<any>{

        if(author==""){
            throw new NotFoundException("NO AUTHOR PROVIDED");
        }
        if(filename==""){
            throw new NotFoundException("NO FILE NAME PROVIDED");
        }
        const found = await this.metadataModel.findOne({author:author, filename:filename});
        //const file = createReadStream(join(process.cwd(), "uploads/scripts/"+found[0].filename));
        //return new StreamableFile(file);
        return found;
    }
    async getFiles() : Promise<any>{
        return await this.metadataModel.find({});
    }

}
