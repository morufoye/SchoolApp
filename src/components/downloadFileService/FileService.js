import service from './Service';

export class FileService {
    getFileFromServer(fileName){
        //returns Promise object
        return service.getRestClient().get(`/files/${fileName}`,{ responseType:"blob" });
    }
}