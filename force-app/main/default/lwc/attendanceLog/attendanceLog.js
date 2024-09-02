import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import logImage from '@salesforce/resourceUrl/LogInOut';
import saveAttendance from '@salesforce/apex/AttendanceController.saveAttendance';

export default class AttendanceLog extends LightningElement {
    @track isLoggedIn = false;
    @track currentTime = '';
    @track logInTime = '';
    @track logOutTime = '';

    in = 'Log In';
    out = 'Log Out';

    loginImage = logImage + '/login.svg';
    logoutImage = logImage + '/logout.svg';

    handleClick() {
        this.isLoggedIn = !this.isLoggedIn;
        this.saveTime();
    }

    get currentImage() {
        return this.isLoggedIn ? this.logoutImage : this.loginImage;
    }

    get currentText() {
        return this.isLoggedIn ? this.out : this.in;
    }

    get buttonClass() {
        return this.isLoggedIn ? 'loginButton logged-in' : 'loginButton logged-out';
    }

    connectedCallback() {
        this.updateTime();
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
        const d = new Date();
        const s = d.getSeconds();
        const m = d.getMinutes();
        const h = d.getHours();
        this.currentTime = `${("0" + h).substr(-2)}:${("0" + m).substr(-2)}:${("0" + s).substr(-2)}`;
    }

    saveTime() {
        // Format time in hh:mm:ss for Time field
        const formatTimeForApex = (timeString) => {
            const [hour, minute, second] = timeString.split(':');
            return `${hour}:${minute}:${second}.000Z`;
        };

        if (this.isLoggedIn) {
            this.logInTime = this.currentTime;
        } else {
            this.logOutTime = this.currentTime;
            
            // Ensure both times have valid data
            if (!this.logInTime || !this.logOutTime) {
                this.showToast('Error', 'Login or Logout time is missing', 'error');
                return;
            }

            const newTimeRecord = {
                Login_Time__c: formatTimeForApex(this.logInTime),
                Logout_Time__c: formatTimeForApex(this.logOutTime)
            };

            saveAttendance({ logTime: newTimeRecord })
                .then(() => {
                    this.showToast('Success', 'Attendance saved successfully');
                })
                .catch(error => {
                    this.showToast('Error', 'Error saving timesheet', 'error');
                    console.error('Error saving timesheet:', error);
                });
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant || 'success'
        });
        this.dispatchEvent(event);
    }
}
