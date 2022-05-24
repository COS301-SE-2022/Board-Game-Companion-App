import { Injectable, NotFoundException, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Metadata } from '../models/Metadata';


@Injectable()
export class ScriptEditorService {
    @UseInterceptors(FileInterceptor('script'))
    async saveFile(metadata: Metadata, @UploadedFile() script) : Promise<string>{
        console.log(script); // Testing if the file is received
        console.log(metadata); // As well metadata to be saved to the database/file system
        return "The file is saved successfully to the database.";
    }
    async FileUpdate(author: string) : Promise<StreamableFile>{
        if(author==""){
            throw new NotFoundException("NO AUTHOR PROVIDED");
        }
        const file = createReadStream(join(process.cwd(), "libs/shared/project.json"));
        return new StreamableFile(file);
    }
}
