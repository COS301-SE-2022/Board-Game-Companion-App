import { DownloadScript } from "../../../schemas/download-script.schema"

export const downloadscriptStub = (): DownloadScript =>{
   return {
    owner: {name:"John", email:"JohnSmith@gmail.com"},
    link: "www.thisIsALink.com",
    dateDownloaded: new Date("23-10-19")
   }
   
}