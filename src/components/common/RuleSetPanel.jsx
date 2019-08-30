import React from 'react';
import { Input, Select, Table, Button, Icon, Divider, Descriptions, Row, Col, Spin } from 'antd';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import AddSub from '@/components/process-tree/AddSub';
import { inject, observer } from 'mobx-react';
import variableService from '@/api/business/variableService';
import FormBlock from '@/components/FormBlock';
import strategyService from '@/api/business/strategyService';
import { element } from 'prop-types';
import commonService from '@/api/business/commonService';
import Code from '@/components/Code';
import PropTypes from 'prop-types';

@inject("editorStore")
@observer
class RuleSetPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            isLoading: true
        }
        this.saveData = {
            "id": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "\t",
            "name": "",
            "code": "",
            "type": 0,
            "typeName": "",
            "version": '',
            "category": 1,
            "categoryName": "",
            "description": "",
            "rules": [
                // {
                //     "id": "ff8080816af7315f016af81493cd00b0",
                //     "name": "test8",
                //     "code": "r_test8",
                //     "type": 0,
                //     "version": 2,
                //     "description": "111",
                //     "sort": 1
                // }
            ],
            "sqlCode": ""
        }
        this.sqlCode = '';
        this.getRuleSetById = this.getRuleSetById.bind(this);
    }

    componentDidMount() {
        if (!common.isEmpty(this.props.ruleSetId)) {
            this.getRuleSetById(this.props.ruleSetId);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.ruleSetId !== nextProps.ruleSetId && !common.isEmpty(nextProps.ruleSetId)) {
            this.getRuleSetById(nextProps.ruleSetId);
        }
    }
    getRuleSetById(id) {
        strategyService.getRuleSetById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            this.saveData = (() => {
                let data = res.data.result;
                data.rules.forEach(element => {
                    element.version = `v${element.version}`
                })
                return data
            })();
            if (!common.isEmpty(this.saveData.rules)) {
                this.sqlCode = this.saveData.rules[0].sqlCode;
            }
            this.setState({
                index: Math.random(),
                isLoading: false
            })

        })
    }

    render() {
        return (
            <Spin spinning={this.state.isLoading} size="large">
                <div>
                    <Descriptions title="">
                        <Descriptions.Item label="名称">{this.saveData.name}</Descriptions.Item>
                        <Descriptions.Item label="标识">{this.saveData.code}</Descriptions.Item>
                        <Descriptions.Item label="匹配模式">{this.saveData.typeName}</Descriptions.Item>
                        <Descriptions.Item label="版本">
                            {
                                this.saveData.version ? `v${this.saveData.version}` : ''
                            }
                        </Descriptions.Item>
                    </Descriptions>
                    <Table columns={columns} dataSource={this.saveData.rules} pagination={false} style={{ margin: '30px 0' }}
                        onRow={record => {
                            return {
                                onClick: event => {
                                    this.sqlCode = record.sqlCode;
                                    this.setState({
                                        index: Math.random(),
                                        isLoading: false
                                    })
                                }, // 点击行
                                onDoubleClick: event => { },
                                onContextMenu: event => { },
                                onMouseEnter: event => { }, // 鼠标移入行
                                onMouseLeave: event => { },
                            };
                        }}
                    />
                    <Code sqlCode={this.sqlCode} type={1} />
                </div>
            </Spin>
        )
    }
}
export default RuleSetPanel
RuleSetPanel.propTypes = {
    ruleSetId: PropTypes.string
}
RuleSetPanel.defaultProps = {
    ruleSetId: ''
}
const columns = [
    {
        title: '规则名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '规则标识',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: '规则版本',
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: '规则描述',
        dataIndex: 'description',
        key: 'description',
    },
];