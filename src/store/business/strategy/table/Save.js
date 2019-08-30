import { action, computed, flow, observable, toJS } from "mobx";

const conditionVODemo = {
    relType: 0,
    nodeType: 2,
    conditions: [{
        relType: 0,
        conditions: [],
        expressionVO: {
            varCategoryType: 1,
            varTableAlias: "",
            varType: '',
            varDataType: "",
            varCode: "",
            varName: "",
            varDefaultValue: "",
            varValue: "",
            varParas: [],
            optType: 0,

            valueCategoryType: 0,//固定值
            valueTableAlias: "",
            valueType: '',
            valueDataType: '',
            valueCode: "",
            valueName: "",
            valueDefaultValue: "",
            value: "",
            valueParas: []
        },
        nodeType: 1
    }
    ]
};

const defaultCellContent = {
    cellsKey: '',
    type: 1,
    assignmentVO: {
        actionType: 0,
        computeJson: '',
        executionManner: 0,
        fixedValue: '',
        fixedValueType: 0,
        parameterId: '',
        parameterName: '',
        type: 0,
        varCode: '',
        varName: '',
        varType: 0,
        computeExpression: {
            "operators": [],
            "varList": [
                {
                    "code": "",//变量CODE
                    "varType": "",//变量 类型
                    "dataType": ""//变量 数据类型
                }
            ]
        }
    }
}

const defaultHeaders = [
    {
        name: '',
        selectId: '',
        type: 0
    },
    {
        name: '',
        selectId: '',
        actionType: 0,
        type: 1
    }
];

const defaultCrossTableHeader = [
    {
        cellsKey: '00000000001',
        conditionVO: {
            relType: 0,
            nodeType: 2,
            conditions: [{
                relType: 0,
                conditions: [],
                expressionVO: {
                    varCategoryType: 1,
                    varTableAlias: "",
                    varType: '',
                    varDataType: "",
                    varCode: "",
                    varName: "",
                    varDefaultValue: "",
                    varValue: "",
                    varParas: [],
                    optType: 0,

                    valueCategoryType: 0,//固定值
                    valueTableAlias: "",
                    valueType: '',
                    valueDataType: '',
                    valueCode: "",
                    valueName: "",
                    valueDefaultValue: "",
                    value: "",
                    valueParas: []
                },
                nodeType: 1
            }
            ]
        }
    }
];

const defaultDataRows = [
    [
        {
            type: 0,
            cellsKey: '00000000001',
            conditionVO: conditionVODemo,
        },
        defaultCellContent
    ]
];

class Store {
    @observable eventSource = {
        _isLoading: true,
        _list: [],
        _selected: undefined,
        get selected() { return toJS(this._selected) },
        setSelected(value) { this._selected = value; },
        get list() { return toJS(this._list) },
        setList(value) { this._list = value; },
        get isLoading() { return toJS(this._isLoading) },
        setIsLoading(value) { this._isLoading = value; },
    }

    @observable strategyTable = {
        _dataRows: defaultDataRows,
        _headers: defaultHeaders,
        _isLoading: true,
        _name: [],
        get name() { return toJS(this._name) },
        setName(value) { this._name = value; },
        get isLoading() { return toJS(this._isLoading) },
        setIsLoading(value) { this._isLoading = value; },
        get headers() { return toJS(this._headers) },
        setHeaders(value) { this._headers = value; },
        get dataRows() { return toJS(this._dataRows) },
        setDataRows(value) { this._dataRows = value; },
    }

    // 重置决策表
    @action.bound reset() {
        // console.log('reset');
        this.clearTable();
        this.strategyTable.setIsLoading(true);
    }

    @action.bound clearTable() {
        this.strategyTable.setHeaders(defaultHeaders);
        this.strategyTable.setDataRows(defaultDataRows);
        this.crossTable.setName('交叉决策表');
        this.crossTable.setHeaders(defaultCrossTableHeader);
        this.crossTable.setDataRows(defaultDataRows);
        this.setLeftColumns([]);
        this.setRightColumns([]);
        this.setDataSource([]);
    }

    @observable version = {
        _list: [],
        get list() { return toJS(this._list) },
        setList(value) { this._list = value; },
    }

    // 收集表格的数据
    @observable _leftColumns = [];
    @computed get leftColumns() { return toJS(this._leftColumns) }
    @action.bound setLeftColumns(value) { this._leftColumns = value; }
    @observable _rightColumns = [];
    @computed get rightColumns() { return toJS(this._rightColumns) }
    @action.bound setRightColumns(value) { this._rightColumns = value; }
    @observable _dataSource = [];
    @computed get dataSource() { return toJS(this._dataSource) }
    @action.bound setDataSource(value) { this._dataSource = value; }
    @observable _actionSaveData = [];
    @computed get actionSaveData() { return toJS(this._actionSaveData) }
    @action.bound setActionSaveData(value) { this._actionSaveData = value; }

    @observable crossTable = {
        _dataRows: [],
        _headers: [],
        _name: '交叉决策表',
        get name() { return toJS(this._name) },
        setName(value) { this._name = value; },
        get headers() { return toJS(this._headers) },
        setHeaders(value) { this._headers = value; },
        get dataRows() { return toJS(this._dataRows) },
        setDataRows(value) { this._dataRows = value; },
    }
}

export default new Store;