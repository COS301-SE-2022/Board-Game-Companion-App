import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { user } from '../../models/general/user';
import { script } from '../../models/scripts/script';
import { Observable, of } from 'rxjs';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from '../../../../../../../apps/client/src/environments/environment';

@Injectable()
export class DownloadsService {
    private api = environment.baseUrl;
    constructor(private readonly httpClient:HttpClient){

    }

    getScriptById(id:string):Observable<script>{
        let param = new HttpParams();
        param = param.set("id",id);
        return this.httpClient.get<script>(this.api+"downloads/retrieve/id",{params:param});
    }

    getAllScripts(owner:user):Observable<script[]>{
        let param = new HttpParams();
        param = param.set("ownerName",owner.name);
        param = param.set("ownerEmail",owner.email);
        return this.httpClient.get<script[]>(this.api + "downloads/retrieve/downloadedByMe/",{params:param});
    }

    removeById(id:string):Observable<any>{
        let param = new HttpParams();
        param = param.set("id",id);
        return this.httpClient.delete<void>(this.api+"downloads/remove/",{params:param});
    }

    storeScript(formData:FormData):Observable<any>{

        return this.httpClient.post<script>(this.api+"downloads/store-script",formData);
    }
}