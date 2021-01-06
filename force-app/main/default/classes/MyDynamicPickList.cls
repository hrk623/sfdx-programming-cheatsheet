public with sharing class MyDynamicPickList extends VisualEditor.DynamicPickList {

    // メンバー変数
    private VisualEditor.DesignTimePageContext context; // Lightning コンポーネントが配置されたページの情報
    private VisualEditor.DynamicPickListRows dynamicPickListRows; // 表示する選択肢

    // コンストラクター
    // 選択リストを初期化する
    public MyDynamicPickList(VisualEditor.DesignTimePageContext context) {
        this.context = context;
        this.dynamicPickListRows = new VisualEditor.DynamicPickListRows();
    }

    // デフォルト値を返す
    // レコードページの場合はレコードのおブジェクトタイプを返す。それ以外であれば空白
    public override VisualEditor.DataRow getDefaultValue() {
        return new VisualEditor.DataRow('', null);
    }

    // 選択リストを返す
    public override VisualEditor.DynamicPickListRows getValues() {
        return this.dynamicPickListRows;
    }
}