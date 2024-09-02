public with sharing class TimesheetController {

    @AuraEnabled
    public static void saveTimesheet(Timesheet__c timesheet) {
        insert timesheet;
    }


    @AuraEnabled(cacheable=true)
    public static List<Timesheet__c> getTimesheets() {
        Id currentUserId = UserInfo.getUserId();
        return [SELECT Id, Date__c, Hours__c, Project__c, Task__c, Description__c
                FROM Timesheet__c
                ORDER BY Date__c DESC];
    }
    

}
