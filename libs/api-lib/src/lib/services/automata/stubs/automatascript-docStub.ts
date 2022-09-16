

import { AutomataScriptDocument } from "../../../schemas/automata-script.schema"
import { baseScriptStub } from "./baseStud"

export const AutomataScriptDocumentStub = (): AutomataScriptDocument =>{
   return {
      ...baseScriptStub,
    previous: [],
    link: "www.thisIsALink.com",
    dateReleased: new Date("23-10-18"),
    downloads: 4,
    lastDownload: new Date("23-10-19"),
    export: true ,
    comments: ["This is a comment", "This is another comment"],
    source: {name:"",key:"",location:""},
    build: {name:}
   }
   
   
}