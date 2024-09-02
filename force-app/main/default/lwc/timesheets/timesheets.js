import { LightningElement, track, wire } from 'lwc';
import saveTimesheet from '@salesforce/apex/TimesheetController.saveTimesheet';
import getTimesheets from '@salesforce/apex/TimesheetController.getTimesheets';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class TimesheetModal extends LightningElement {
    @track timesheetDate = '';
    @track timesheetHours = '';
    @track timesheetProject = '';
    @track timesheetTask = '';
    @track timesheetDescription = '';
    @track timesheets = []; 
    @track isModalOpen = false; 
    @track totalHours = 0;
    @track showDes = true; 

    wiredTimesheetResult; 

    @wire(getTimesheets)
    wiredTimesheets(result) {
        this.wiredTimesheetResult = result; 
        const { data, error } = result;
        if (data) {
            this.timesheets = data;
            this.calculateTotalHours(); 
        } else if (error) {
            console.error('Error fetching timesheets:', error);
        }
    }

    connectedCallback() {
        this.checkScreenSize();
        window.addEventListener('resize', this.handleResize.bind(this)); // Add resize event listener
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize.bind(this)); // Clean up the event listener
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    saveTimesheet() {
        const newTimesheet = {
            Name: 'timesheet',
            Date__c: this.timesheetDate,
            Hours__c: this.timesheetHours,
            Project__c: this.timesheetProject,
            Task__c: this.timesheetTask,
            Description__c: this.timesheetDescription
        };

        saveTimesheet({ timesheet: newTimesheet })
            .then(() => {
                this.showToast('Success', 'Timesheet saved successfully!', 'success');

                this.timesheetDate = '';
                this.timesheetHours = '';
                this.timesheetProject = '';
                this.timesheetTask = '';
                this.timesheetDescription = '';

                this.closeModal();

                return refreshApex(this.wiredTimesheetResult);
            })
            .catch(error => {
                this.showToast('Error', 'Error saving timesheet', 'error');
                console.error('Error saving timesheet:', error);
            });
    }

    calculateTotalHours() {
        this.totalHours = 0; 
        this.timesheets.forEach(time => {
            this.totalHours += parseFloat(time.Hours__c || 0); 
        });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }

    checkScreenSize() {
        const threshold = 600; 
        const width = window.innerWidth;

        this.showDes = width >= threshold;
    }

    handleResize() {
        this.checkScreenSize(); // Re-check screen size on resize
    }

    showModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }
}
