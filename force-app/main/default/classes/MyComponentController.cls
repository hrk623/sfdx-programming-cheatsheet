public with sharing class MyComponentController {
    /*
     * AuraEnabled メソッド
     * LWC から Lightning Data Service 経由で呼び出し可能なメソッド
     */
    @AuraEnabled(cacheable=false)
    public static Account createAccount(String name) {
        Account a = new Account(Name=name);
        insert a;
        return a;
    }

    /*
     * キャッシュ可能な AuraEnabled メソッド
     * LWC から Lightning Data Service の Wire Service 経由でデータの呼び出しなどを行う読み取り専用のメソッド
     */
    @AuraEnabled(cacheable=true)
    public static List<Account> findAccountsByName(String name) {
        return [SELECT Id, Name FROM Account WHERE Name = :name];
    }

    /*
    * 複雑な引数の処理
    */
    @TestVisible
    class MyWrapper {
        @AuraEnabled public Integer minNumberOfEmployees { get; set; }
        @AuraEnabled public String name { get; set; }
    }
    @AuraEnabled(cacheable=true)
    public static List<Account> findAccountByCondition(MyWrapper myWrapper) {
        return [SELECT Id, Name
                FROM Account
                WHERE Name = :myWrapper.name
                AND NumberOfEmployees >= :myWrapper.minNumberOfEmployees];
    }
}