public with sharing class MyComponentController {
    @AuraEnabled(cacheable=true)
    public static Sobject findRecord(String recordId) {
        return new Account(Id=recordId, Name='Ohana Inc.');
    }
}