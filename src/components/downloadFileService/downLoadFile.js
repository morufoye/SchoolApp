import React, { Component } from 'react';
import { FileService } from './FileService';
import { saveAs } from 'file-saver';

export class DownloadFile extends Component {
    constructor() {
        super();
        this.fileService = new FileService();
        this.state={downloading:false};
    }

    extractFileName = (contentDispositionValue) => {
        var filename = "";
        if (contentDispositionValue && contentDispositionValue.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(contentDispositionValue);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }
        return filename;
    }

    downloadFile = () => {
        this.setState({ downloading: true });
        let self = this;
        this.fileService.getFileFromServer(this.props.fileUrl).then((response) => {
            console.log("Response", response);
            this.setState({ downloading: false});
            //extract file name from Content-Disposition header
            var filename=this.extractFileName(response.headers['content-disposition']);
            console.log("File name",filename);
            //invoke 'Save As' dialog
            saveAs(response.data, filename);
        }).catch(function (error) {
            console.log(error);
            self.setState({ downloading: false });
            if (error.response) {
                console.log('Error', error.response.status);
            } else {
                console.log('Error', error.message);
            }
        });
        this.props.updateDownLoadStatus();
    };

    render() {
        console.log("state",this.state);
        return (
            <div>
                <button onClick={this.downloadFile}> Download</button>
                <label>{this.state.downloading ? 'Downloading in progress' : ''}</label>
            </div>
        )
    };
}
