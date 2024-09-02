
public without sharing class AttendanceController {
    
    @AuraEnabled
    public static void saveAttendance(Employee_Date_Time__c logTime) {
        Employee_Date_Time__c ET = new Employee_Date_Time__c();
        ET.Login_Time__c = logTime.Login_Time__c;
        ET.Logout_Time__c = logTime.Logout_Time__c;
        
        System.debug('logTime: ' + logTime);
        insert ET;
        System.debug('logTime: ' + ET);
        
    }
    
}