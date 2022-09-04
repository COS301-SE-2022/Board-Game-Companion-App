import { Controller, Body, Put } from '@nestjs/common';
import { EditorService } from '../../services/editor/editor.service';
import { MyScript } from '../../schemas/my-script.schema';

@Controller('editor')
export class ApiEditorController {
    constructor(private readonly editorService:EditorService){}
 
    @Put('update-models')
    async updateModels(@Body('script')script:string,@Body('networks')networks:string[]):Promise<MyScript>{
        return await this.editorService.updateModels(script,networks);
    }

    @Put("update-file")
    async updateFile(@Body('id')id:string,@Body('content')content:string):Promise<any>{
        return this.editorService.updateFile(id,content);
    }
}
