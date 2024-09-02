public with sharing class ProfileDataHandler {

    @AuraEnabled(cacheable=true)
    public static User getUserData() {
        return [SELECT Id, Name, Email, Title FROM User WHERE Id = :UserInfo.getUserId()];
    }

    @AuraEnabled
    public static void updateFileName(Id fileId, String newName) {
        ContentVersion file = [SELECT Id, Title, VersionData FROM ContentVersion WHERE Id = :fileId LIMIT 1];
        file.Title = newName; 
        update file;
    }
}
