import { LightningElement } from 'lwc';
import imageResource from '@salesforce/resourceUrl/iconsForEMWeb';
import { NavigationMixin } from 'lightning/navigation';



export default class Dashboard extends NavigationMixin(LightningElement) {

    attendanceImg = imageResource+'/icons/attendance.png';
    timesheetImg = imageResource+'/icons/timesheet.png';
    leaveImg = imageResource+'/icons/leave.png';


    handleClick(){
        let selectedCard = event.currentTarget.dataset.id;
        // console.log("Selected Card:", selectedCard);
        if(selectedCard == 1){
            this.navigateToPage('attendance__c');
        }
        else if(selectedCard == 2){
            this.navigateToPage('timesheet__c');
        }
        else{
            this.navigateToPage('Leave__c');
        }
    }

    navigateToPage(pageApiName){

        this[NavigationMixin.Navigate]({
            type:'comm__namedPage',
            attributes:{
                name:pageApiName
            }
        })
    }
}