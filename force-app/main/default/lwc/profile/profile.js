import { LightningElement, api, track, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import getUserData from '@salesforce/apex/ProfileDataHandler.getUserData';
import updateFileName from '@salesforce/apex/ProfileDataHandler.updateFileName';

export default class Profile extends LightningElement {
    userId = Id;
    @track userName;
    @track userEmail;
    @track userDes;
    @track profileImageUrl;
    @api myRecordId;
   

    @wire(getUserData)
    getUserData({ error, data }) {
        if (data) {
            this.userName = data.Name;
            this.userEmail = data.Email;
            this.userDes = data.Title;
        } else if (error) {
            console.error('Error fetching user details', error);
        }
    }

 //IMAGE UPLOAD AND USE
    get acceptedFormats() {
        return ['.jpg', '.jpeg', '.png', '.gif'];
    }


    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        if (uploadedFiles.length > 0) {
            const fileId = uploadedFiles[0].documentId;
      
            updateFileName({ fileId: fileId, newName: this.userId })
                .then(() => {
                    alert('File uploaded and renamed successfully.');
                   
                    this.profileImageUrl = `/sfc/servlet.shepherd/version/download/${fileId}`;
                })
                .catch(error => {
                    console.error('Error renaming file:', error);
                });
        }
    }
}
