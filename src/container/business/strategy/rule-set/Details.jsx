import React, { Component } from 'react';
import { Table, Spin, Drawer, Descriptions } from 'antd';
import '@/styles/business/variable/real-time-query-edit.less';
import FormButtonGroupCommon from '@/components/FormButtonGroupCommon';
import strategyService from '@/api/business/strategyService';
import { withRouter } from 'react-router-dom';
import PageHeader2 from '@/components/PageHeader2';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/rule-set/Save';
import Code from "@/components/Code";


const columns = [{
    title: '序号',
    dataIndex: 'c1',
    key: 'c1',
}, {
    title: '规则名',
    dataIndex: 'c2',
    key: 'c2',
}, {
    title: '版本',
    dataIndex: 'c6',
    key: 'c6',
}, {
    title: '规则标识',
    dataIndex: 'c3',
    key: 'c3',
}, {
    title: '类别',
    dataIndex: 'category',
    key: 'category',
}];

@withRouter
@observer
class Save extends Component {
    constructor(props) {
        super(props);
        this.getRuleSetById = this.getRuleSetById.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.categoryList = {};
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            dimensionListAll: [],
            allRules: [],
            selectRuleList: [],
            index: 0,
            isLoading: false,
        }
        this.saveData = {
            "name": "",
            "code": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "description": "",
            "category": "",
            "categoryName": "",
            "type": this.props.match.params.type,
            "rules": [
                // {
                //     "id": ""
                // }
            ],
            "priority": ""


        }
    }

    componentDidMount() {
        this.init(this.props.match.params.id);
    }

    init(id) {
        this.id = id;
        // 策略包资源查看详情进来
        this.isResource = this.props.match.path === '/business/release/rule-set/details/:id';
        this.getRuleSetById(this.id);
        store.setId(id);
        store.allVersionForApi();
    }

    componentWillUpdate(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.init(nextProps.match.params.id);
        }
    }

    getRuleSetById(id) {
        const apiGet = this.isResource ? strategyService.getResourceDetail : strategyService.getRuleSetById;
        apiGet(id).then(res => {
            if (!publicUtils.isOk(res)) return;
            let data = res.data.result;
            // console.log(data);
            store.approvalSubmitParams.code = data.code;
            store.approvalSubmitParams.id = data.id;
            store.approvalSubmitParams.name = data.name;
            store.approvalSubmitParams.version = data.version;
            store.approvalSubmitParams.remark = '';
            store.approvalSubmitParams.approvalStatus = common.isEmpty(data.approvalStatus) ? '' : data.approvalStatus;
            store.approvalSubmitParams.actionType = data.status == 0 ? 0 : 4;

            store.setSqlPreview(data.sqlCode);
            data.rules.forEach(el=>{
                el.version = `v${el.version}`
            })
            this.saveData = data;
            this.rules = data.rules;
            store.setSelectedRule(this.saveData.rules[0]);
            // console.log(this.rules);
            var dataSource = this.renderTable(this.saveData.rules);
            this.setState({
                selectRuleList: dataSource
            })

            this.setState({
                index: Math.random()
            })
        })
    }



    renderTable(list) {
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                c1: i + 1,
                c2: element.name,
                c6: element.version,
                c3: element.code,
                category: element.categoryName
            })
        }

        return tempArray
    }

    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader2
                        meta={this.props.meta}
                        isShowBtns={true}
                        isShowSelect={!common.isEmpty(this.props.match.params.id)}
                        auth={{
                            test: false,
                            sql: true,
                            version: !this.isResource && publicUtils.isAuth("business:strategy:ruleSet:view"),
                        }}>
                        </PageHeader2>
                    <div className="pageContent" style={{ padding: '0 0 64px 0' }}>
                        <div style={{ marginTop: '20px', paddingTop: '16px' }}>
                            <Spin spinning={this.state.isLoading} size="large">
                                <FormBlock header="基本信息">
                                    <Descriptions title="">
                                        <Descriptions.Item label="名称">{this.saveData.name}</Descriptions.Item>
                                        <Descriptions.Item label="标识">{this.saveData.code}</Descriptions.Item>
                                        <Descriptions.Item label="事件源">{this.saveData.eventSourceName}</Descriptions.Item>
                                        <Descriptions.Item label="维度">{this.saveData.dimensionName}</Descriptions.Item>
                                        <Descriptions.Item label="匹配模式">{this.saveData.typeName}</Descriptions.Item>
                                        <Descriptions.Item label="类别">{this.saveData.categoryName}</Descriptions.Item>
                                        <Descriptions.Item label="描述">{this.saveData.description}</Descriptions.Item>
                                    </Descriptions>
                                </FormBlock>
                                <FormBlock header="规则集配置">
                                    <Table dataSource={this.state.selectRuleList} columns={columns} pagination={false} />
                                </FormBlock>
                            </Spin>
                        </div>
                        <FormButtonGroupCommon
                            isShowSaveBtn={false}
                            cancelText="返回"
                            cancelCallBack={() => this.props.history.goBack()}
                        />
                    </div>
                    <Drawer
                        title="总览"
                        placement="right"
                        closable={true}
                        onClose={() => { store.setIsShowDrawerForSql(false) }}
                        visible={store.isShowDrawerForSql}
                        width="720"
                        destroyOnClose={true}
                    >
                        <Code sqlCode={store.sqlPreview} type={1} />
                    </Drawer>
                </div>
            </Provider>
        )
    }
}

export default Save