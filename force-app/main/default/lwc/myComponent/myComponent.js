import { LightningElement, api, track, wire } from "lwc";

// 静的リソースから読み込むにはリソースとローダーを読み込み、renderedCallback 以降でロードする場合
import MY_STATIC_RESOURCE from "@salesforce/resourceUrl/MyStaticResource";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";

// カスタムラベルを利用する場合
// import GREETING from '@salesforce/label/c.greeting';
// import SALESFORCE_LOGO_DESCRIPTION from '@salesforce/label/c.salesforceLogoDescription';

// SObject の情報にアクセスする場合
import ACCOUNT_OBJECT from "@salesforce/schema/Account"; // => {objectApiName: 'Account'}
import ACCOUNT_INDUSTRY_FIELD from "@salesforce/schema/Account.Industry"; // => {fieldApiName: "Industry", objectApiName: "Account"}
import ACCOUNT_OWNER_NAME_FIELD from "@salesforce/schema/Account.Owner.Name"; // => {fieldApiName: "Owner.Name", objectApiName: "Account"}
import {
  getObjectInfo,
  getPicklistValues,
  getPicklistValuesByRecordType
} from "lightning/uiObjectInfoApi";
// @wire(getObjectInfo, {objectApiName: ACCOUNT_OBJECT}) objectInfo; // => {apiName: "Account", childRelationships: Array(50), createable: true, custom: false, defaultRecordTypeId: "012000000000000AAA", …}
// @wire(getPicklistValues, {recordTypeId: '012000000000000AAA', fieldApiName: ACCOUNT_INDUSTRY_FIELD}) picklistValues;
// @wire(getPicklistValuesByRecordType, {objectApiName: ACCOUNT_OBJECT, recordTypeId: '012000000000000AAA' }) allPicklistValues;

// 単一のレコードを操作する場合
import {
  // レコード操作アダプタ
  createRecord,
  deleteRecord,
  updateRecord,
  // レコード操作準備アダプタ
  generateRecordInputForCreate,
  generateRecordInputForUpdate,
  createRecordInputFilteredByEditedFields,
  // レコード参照アダプタ
  getRecord,
  getFieldValue,
  getFieldDisplayValue,
  getRecordCreateDefaults,
  getRecordUi
} from "lightning/uiRecordApi";
// => @wire(getRecord, { recordId: '$recordId', fields: ['Contact.Name']}) record;
// => createRecord({apiName: 'Account', fields: {'Name': 'foo'}}).then(record => console.log(record)).catch(error =>  console.error(error));
// => updateRecord(recordInput: {apiName: 'Account', fields: {'Name': 'foo'}, }, clientOptions: {'ifUnmodifiedSince' : lastModifiedDate})
// => deleteRecord(recordId: '000AAAAAAAAAAAAAAA')

// Apex メソッドをコールする場合
import { getSObjectValue, refreshApex } from "@salesforce/apex";
// => getSObjectValue(record.data, ACCOUNT_INDUSTRY_FIELD) // SObject の項目値にアクセスする
// => refreshApex(wiredProperty) // キャッシュをリフレッシュする

// カスタム Apex メソッドをコールする場合
import findRecord from "@salesforce/apex/MyComponentController.findRecord";
// => findRecord({recordId: this.recordId}).then(result => console.log(result)).catch(error =>  console.error(error));
// => @wire(findRecord, {recordId: '$recordId'}) wiredRecord({error, data}) {}
// => @wire(findRecord, {recordId: '$recordId'}) record;

// ページ遷移する場合
import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
// @wire(CurrentPageReference) currentPageReference;

// トーストを表示する場合
import { ShowToastEvent } from "lightning/platformShowToastEvent";

// 現在のユーザー ID の取得
import USER_ID from "@salesforce/user/Id";

// フローのイベントを受け取る
import {
  FlowAttributeChangeEvent,
  FlowNavigationNextEvent,
  FlowNavigationBackEvent,
  FlowNavigationPauseEvent,
  FlowNavigationFinishEvent
} from "lightning/flowSupport";

// ブラウザの幅を受けとる: Large, Medium, Small
import FORM_FACTOR from "@salesforce/client/formFactor";
// @wire(getRecordCreateDefaults, { objectApiName: Account, formFactor: FORM_FACTOR }) recordCreateDefaults;

import myMessageChannelName from "@salesforce/messageChannel/MyMessageChannel__c";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";

export default class MyComponent extends NavigationMixin(LightningElement) {
  // Public Properties
  @api recordId;      // コンテキストレコード ID。モバイルでは常に 18 桁
  @api objectApiName; // コンテキストレコードのオブジェクト名。
  @api stringValue;
  @api requiredValue;
  @api booleanValue;
  @api integerValue;
  @api picklistValue;
  @api dynamicPicklistValue;

  // Private Properties
  primitiveProperty = false; // tracked
  objectProperty = {
    // tracked
    key1: "value1" // untracked
  };
  @track truckedObjectProperty = {
    // tracked
    key1: "value1", // tracked
    key2: {
      // tracked
      key3: "value3" // untracked
    }
  };

  // Getters and Setters
  @api
  get publicProperty() {
    return this.privateProperty;
  }
  set publicProperty(value) {
    this.privateProperty = value.toUpperCase();
    this.setAttribute("privateProperty", this.privateProperty);
  }

    /*
   * wired プロパティと wired 関数
   * ポイント:
   * - @wire は引数の全てに値が入っていないと provision しない
   * - 以下のリアクティブなプロパティを渡す場合はプリフィックスとして $ をつける
   *   - パブリックプロパティ
   *   - getter と setter の両方を持つプロパティ
   *   - private プロパティ(@track を含む)
   */
  @wire(getRecord, { recordId: "$recordId" }) record;
  @wire(getRecord, { recordId: "$recordId" }) onGetRecord({ data, error }) {
    if (data) {
      // SUCCESS
    } else if (error) {
      // ERROR
    }
  }

  /*
   * コンポーネントのライフサイクルイベントハンドラ
   */
  constructor() {
    // インスタンスが作成された時の処理
    super();
  }
  connectedCallback() {
    // ドキュメントに追加された時の処理
  }
  disconnectedCallback() {
    // ドキュメントから削除された時の処理
    // DOM イベント(addEventListener 等)はフレームワークが自動で登録解除を行うため不要。
    // ただし、window オブジェクトへのイベントリスナーは removeEventListener する必要がある。
    // また、pubsub を利用している場合も unregisterAllListeners(this) する必要がある。
  }
  renderedCallback() {
    // 子要素を含めた自身の描画が完了した時の処理
  }
  errorCallback(error, stack) {
    // 子要素及び自身のライフサイクル内でエラーが起こった時の処理
    // errorCallback は子から親へ伝播されるエラーを受けとり処理する事で以降の伝播を止める。
    // そのため、実質エラー伝播の境界コンポーネント(error boundary component)となる。
    console.error(this.error, this.stack);
  }

  /*
   * 要素のクエリ
   */
  queryElements() {
    // DOM のクエリは window や document, this.shadowRoot ではなく this.template に対して行う。
    // id はグローバル ID に変換されるので、id でのクエリはしない
    this.template.querySelector("ul[class=MyClassName]");
    this.template.querySelectorAll("li");
    this.templategetElementsByTagName("c-my-child-component");
    this.templategetElementsByClassName("MyClassName");
    // slot 内の DOM には this.querySelector() で取得できる
    this.querySelector("div");
  }

  /*
   * イベントハンドラ
   */
  handleEvent(e) {
    // イベント発生時の処理を記述
    // input 要素の値は以下で取得できる
    this.value = e.currentTarget.value;
  }
  onSlotChanged(e) {
    const assignedNodes = e.currentTarget.assignedNodes();
    const hasAssignedNodes = e.currentTarget.assignedNodes().length > 0;
  }

  /*
   * カスタムイベントの通知とハンドリング
   */
  dispatchCustomEvent() {
    // 親に対しイベントを通知する際は this.dispatchEvent する
    // セットするパラメータがプリミティブ型でない場合は、必ず複製したものを送る。
    this.dispatchEvent(new CustomEvent("mycustomevent")); // <c-my-component onMyCustomEvent={handler}>
    this.template.querySelector('div[data-id="eventhandler"]').dispatchEvent(
      new CustomEvent("customeventwithparams", {
        detail: {
          key: "value"
        },
        bubbles: false, // 親の ShadowRoot まで伝播させるか
        composed: false // DocumentRoot まで伝播させるか。名前の競合に気をつける
      })
    );
  }
  handleCustomEvent(event) {
    this.value = event.detail.key;
  }

  /*
   * platformResourceLoader による静的リソースを読み込み
   * 前提:
   * - import MY_STATIC_RESOURCE from "@salesforce/resourceUrl/MyStaticResource";
   * - import { loadStyle, loadScript } from "lightning/platformResourceLoader";
   */
  loadStaticResource() {
    Promise.all([
      loadScript(this, MY_STATIC_RESOURCE + "/js/app.js"),
      loadStyle(this, MY_STATIC_RESOURCE + "/css/style.css")
    ]).catch((error) => console.error("ERROR:" + error));

    // 画像の場合
    this.url = MY_STATIC_RESOURCE + "/img/logo.png";
  }

  /*
   * navigation によるページ遷移
   * 前提:
   * - import { CurrentPageReference, NavigationMixin } from "lightning/navigation";
   * - class MyComponent extends NavigationMixin(LightningElement) { ... }
   */
  @wire(CurrentPageReference) currentPageReference;
  navigate() {
    // レコードページへ遷移
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: "001XXXXXXXXXXXXXXX",
        actionName: "view"
      }
    });

    // タブへ遷移
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "MyCustomTabName"
      }
    });

    // コンポーネントへ遷移
    this[NavigationMixin.Navigate]({
      type: "standard__component",
      attributes: {
        componentName: "c__MyLightningComponent"
      },
      state: {
        c__counter: "5" // キーは名前空間必須。値は String のみ
      }
    });
    // 遷移先で const counter = CurrentPageReference.state.c__counter;

    // ファイルをプレビュー
    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "filePreview"
      },
      state: {
        recordIds: "0696F000009TmFgQAK,0696F000007Txp4QAC",
        selectedRecordId: "0696F000004lsiTQAQ"
      }
    });
  }

  /*
   *  Lightning Message Service の公開と購読
   *  前提:
   *  - import myMessageChannelName from "@salesforce/messageChannel/MyMessageChannel__c";
   *  - import {subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext} from "lightning/messageService";
   */
  @wire(MessageContext) messageContext;
  publishMessage() {
    publish(this.messageContext, myMessageChannelName, {
      recordId: "001XXXXXXXXXXXXXXX"
    });
  }
  subscribeMessage() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        myMessageChannelName,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }
  handleMessage(message) {
    this.recordId = message.recordId;
  }
  unsubscribeMessage() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  /*
   * トーストの表示
   * 前提:
   * - import { ShowToastEvent } from "lightning/platformShowToastEvent";
   */
  showSuccessToast(message) {
    // 成功メッセージ
    this.dispatchEvent(
      new ShowToastEvent({
        message: message,
        variant: "success"
      })
    );

    // 失敗メッセージ
    this.dispatchEvent(
      new ShowToastEvent({
        message: message,
        variant: "error",
        mode: "sticky"
      })
    );
  }
}
