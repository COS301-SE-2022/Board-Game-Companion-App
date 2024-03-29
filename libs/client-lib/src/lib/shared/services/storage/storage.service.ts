import { Injectable } from '@angular/core';
import { objectStore } from '../../models/general/objectStore';

@Injectable()
export class StorageService{
  private supported  = true;
  private openFailure = false;
  private openSuccess = false;
  private waitTime = 2000;
  private database = "board-game-companion-database";
  private db!:IDBDatabase;
  private stores:objectStore[] = [{
    name: "editor-networks",
    indices: ["name"]
  },{
    name: "download-networks",
    indices: ["_id"]
  },{
    name: "download-scripts",
    indices: ["_id"]
  },{
    name: "collections",
    indices: ["name"]
  }]

  constructor(){
    const codeIndexedDB = new Function("return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB");

    if(!codeIndexedDB()){
      this.supported = false
    }

    const request = indexedDB.open(this.database,2);

    request.onerror = (ev:any) => {
      this.openFailure = true;
    }

    request.onsuccess = (ev:any) => {
      this.openSuccess = true;
      this.db = ev.target.result;
    }

    request.onupgradeneeded = (ev:any) => {

      this.db = ev.target.result;

      this.stores.forEach((value:objectStore) => {
        const temp:IDBObjectStore =  this.db.createObjectStore(value.name,{
          autoIncrement: true
        });

        value.indices.forEach((index:string) => {
          temp.createIndex(index,index,{
            unique: true
          })
        })
      })
    }
  }

  getSupported(): boolean{
    return this.supported;
  }

  getOpenFailure(): boolean{
    return this.openFailure;
  }

  getOpenSuccess(): boolean{
    return this.openSuccess;
  }

  getDatabaseName(): string{
    return this.database;
  }

  getDatabase(): IDBDatabase{
    return this.db;
  }

  clearModels(): Promise<string>{
    return new Promise((resolve,reject) => {
      const request = indexedDB.open("tensorflowjs",1);

      request.onerror = (ev:any) => {
        this.openFailure = true;
        alert("1")
        reject(`Failed to clear models. Error: ${ev.target.errorCode}`);
      }

      request.onsuccess = (ev:any) => {
        this.openSuccess = true;
        const db:IDBDatabase = ev.target.result;
      
        
        const transaction = db.transaction("model_info_store",'readwrite');
        const store = transaction.objectStore("model_info_store");
        const query = store.clear();
        query.onerror = (ev:any) => {
          alert("2")
          reject(`Failed to clear models. Error: ${ev.target.errorCode}`);
        }

        query.onsuccess = (ev:any) => {
          const transaction = db.transaction("models_store",'readwrite');
          const store = transaction.objectStore("models_store");
          const second_query = store.clear();
          
          second_query.onerror = (ev:any) => {
            alert("3")
            reject(`Failed to clear models. Error: ${ev.target.errorCode}`);
          }

          second_query.onsuccess = (ev:any) => {
            resolve("Okay");
          }
        }
      }
    })

    
  }

  clear(storeName:string): Promise<string>{
    const functionality = (resolve:any,reject:any)=>{
      let found = false;

      for(let count = 0; count < this.stores.length && !found; count++){
        if(this.stores[count].name === storeName)
          found = true;
      }

      if(!found){
        reject(`${storeName} does not exists.`);
      }else{
        const transaction = this.db.transaction(storeName,'readwrite');
        const store = transaction.objectStore(storeName);
        const query = store.clear();
        query.onerror = (ev:any) => {
          reject(`Failed to clear ${storeName}. Error: ${ev.target.errorCode}`);
        }

        query.onsuccess = (ev:any) => {
          resolve("Okay");
        }
      }
    }
    
    return new Promise((resolve,reject) => {
      if(this.openFailure){
        reject('Failed to open database.');
      }else if(!this.openSuccess){
        window.setTimeout(()=>{
          if(this.openSuccess)
            functionality(resolve,reject);
          else
            reject('Failed to open database.');
        },this.waitTime)
      }else{
        functionality(resolve,reject);
      }
    })    
  }

  insert(storeName:string,record:any): Promise<string>{
    const functionality = (resolve:any,reject:any)=>{
      let found = false;

      for(let count = 0; count < this.stores.length && !found; count++){
        if(this.stores[count].name === storeName)
          found = true;
      }

      if(!found){
        reject(`${storeName} does not exists.`);
      }else{
        const transaction = this.db.transaction(storeName,'readwrite');
        const store = transaction.objectStore(storeName);
        const query = store.add(record);
        query.onerror = (ev:any) => {
          reject(`Failed to insert object. Error: ${ev.target.errorCode}`);
        }

        query.onsuccess = (ev:any) => {
          resolve("Okay");
        }
      }
    }
    
    return new Promise((resolve,reject) => {
      if(this.openFailure){
        reject('Failed to open database.');
      }else if(!this.openSuccess){
        window.setTimeout(()=>{
          if(this.openSuccess)
            functionality(resolve,reject);
          else
            reject('Failed to open database.');
        },this.waitTime)
      }else{
        functionality(resolve,reject);
      }
    })
  }

  getByIndex(storeName:string,index:string,value:any):Promise<any>{
    const functionality = (resolve:any,reject:any) => {
      let found = false;

      this.stores.forEach((value:objectStore) => {
        if(value.name === storeName){
          found = true;
          
          if(!value.indices.includes(index))
            reject(`${storeName} does not have index ${index}`)
        }
      })

      if(!found){
        reject(`${storeName} does not exists.`)
      }else{
        const transaction = this.db.transaction(storeName,'readonly');
        const store = transaction.objectStore(storeName);
        const indexed = store.index(index);
        const query = indexed.get(value);
        query.onerror = (ev:any) => {
          reject('Could not find object');
        }

        query.onsuccess = (ev:any) => {
          resolve(query.result);
        }
      }
    }

    return new Promise((resolve,reject) => {
      if(this.openFailure){
        reject('Failed to open database.');
      }else if(!this.openSuccess){
        window.setTimeout(()=>{
          if(this.openSuccess)
            functionality(resolve,reject);
          else
            reject('Failed to open database.');
        },this.waitTime)
      }else{
        functionality(resolve,reject);
      }      
    })
  }

  getById(storeName:string,id:any):Promise<any>{
    const functionality = (resolve:any,reject:any) => {
      let found = false;

      this.stores.forEach((value:objectStore) => {
        if(value.name === storeName){
          found = true;
        }
      })

      if(!found){
        reject(`${storeName} does not exists.`)
      }else{
        const transaction = this.db.transaction(storeName,'readonly');
        const store = transaction.objectStore(storeName);
        const query = store.get(id);

        query.onerror = (ev:any) => {
          reject(`The object with ${id} not found`);
        }

        query.onsuccess = (ev:any) => {
          resolve(query.result);
        }
      }
    }
    
    return new Promise((resolve,reject) => {
      if(this.openFailure){
        reject('Failed to open database.');
      }else if(!this.openSuccess){
        window.setTimeout(()=>{
          if(this.openSuccess)
            functionality(resolve,reject);
          else
            reject('Failed to open database.');
        },this.waitTime)
      }else{
        functionality(resolve,reject);
      }         
    })
  }

  getAll(storeName:string): Promise<any>{
    const functionality = (resolve:any,reject:any) => {
      let found = false;

      this.stores.forEach((value:objectStore) => {
        if(value.name === storeName){
          found = true;
        }
      })

      if(!found){
        reject(`${storeName} does not exists.`)
      }else{
        const transaction = this.db.transaction(storeName,'readonly');
        const store = transaction.objectStore(storeName);
        const result:any = [];

        store.openCursor().onsuccess = (ev:any) => {
          const cursor:IDBCursor = ev.target.result;
            
          if(cursor){
            const temp:IDBCursorWithValue = cursor.request.result;
            result.push(temp.value);
            cursor.continue();
          }else
            resolve(result);
        }
      }
    }

    return new Promise((resolve,reject) => {
      if(this.openFailure){
        reject('Failed to open database.');
      }else if(!this.openSuccess){
        window.setTimeout(()=>{
          if(this.openSuccess)
            functionality(resolve,reject);
          else
            reject('Failed to open database.');
        },this.waitTime)
      }else{
        functionality(resolve,reject);
      }
    })  
  }

  update(storeName:string,record:any,key?:any): Promise<string>{
    const functionality = (resolve:any,reject:any) => {
      let found = false;

      for(let count = 0; count < this.stores.length && !found; count++){
        if(this.stores[count].name === storeName)
          found = true;
      }

      if(!found){
        reject(`${storeName} does not exists.`);
      }else{
        const transaction = this.db.transaction(storeName,'readwrite');
        const store = transaction.objectStore(storeName);
        const query = store.put(record,key);
        query.onerror = (ev:any) => {
          reject(`Failed to update object. Error: ${ev.target.errorCode}`);
        }

        query.onsuccess = (ev:any) => {
          resolve("Okay");
        }
      }
    }
    
    return new Promise((resolve,reject) => {
      if(this.openFailure){
        reject('Failed to open database.');
      }else if(!this.openSuccess){
        window.setTimeout(()=>{
          if(this.openSuccess)
            functionality(resolve,reject);
          else
            reject('Failed to open database.');
        },this.waitTime)
      }else{
        functionality(resolve,reject);
      }
    })
  }

  remove(storeName:string,index:string,value:any): Promise<string>{
    const functionality = (resolve:any,reject:any) => {
      let found = false;

      for(let count = 0; count < this.stores.length && !found; count++){
        if(this.stores[count].name === storeName)
          found = true;
      }

      if(!found){
        reject(`${storeName} does not exists.`);
      }else{
        const transaction = this.db.transaction(storeName,'readwrite');
        const store = transaction.objectStore(storeName);
        const indexed = store.index(index);
        const key = indexed.getKey(value);

        key.onsuccess = (() => {
          const query = store.delete(key.result as IDBValidKey);
          query.onerror = (ev:any) => {
            reject(`Failed to remove object. Error: ${ev.target.errorCode}`);
          }
  
          query.onsuccess = (ev:any) => {
            resolve("Okay");
          }
        });

        key.onerror = ((ev:any) => {
          reject(`Failed to remove object. Error: ${ev.target.errorCode}`);
        })


      }
    }

    return new Promise((resolve,reject) => {
      if(this.openFailure){
        reject('Failed to open database.');
      }else if(!this.openSuccess){
        window.setTimeout(()=>{
          if(this.openSuccess)
            functionality(resolve,reject);
          else
            reject('Failed to open database.');
        },this.waitTime)
      }else{
        functionality(resolve,reject);
      }
    })
  }

}
