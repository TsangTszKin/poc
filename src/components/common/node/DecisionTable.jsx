import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, message, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import AddAndSub from '@/components/AddAndSub';
import FieldSelector from '@/components/business/variable/real-time-query/FieldSelector';
import TreePanel from '@/components/condition-tree/TreePanel';
import FormTitle from '@/components/FormTitle';
import FormButtonGroupForProcessTree from '@/components/FormButtonGroupForProcessTree';
import Code from '@/components/Code';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';
import FieldCell from '@/components/common/node/FieldCell';
import CascadeWithTitle from '@/components/CascadeWithTitle';
import commonService from '@/api/business/commonService';
import strategyService from '@/api/business/strategyService';

@withRouter
@inject('store', 'editorStore')
@observer
class DecisionTable extends Component {
    constructor(props) {
        super(props);
        this.checkIsFinish = this.checkIsFinish.bind(this);
        this.getCategoryList = this.getCategoryList.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.state = {
            index: 0,
            secondSelectData: [],
            categoryList: []
        }
    }

    componentDidMount() {
        this.getCategoryList();
    }
    componentWillReceiveProps(nextProps) {

    }

    checkIsFinish() {
        let rs = true;
        if (common.isEmpty(this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.name)) rs = false;
        if (common.isEmpty(this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.decisionTableId)) rs = false;
        if (common.isEmpty(this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.category)) rs = false;
        if (common.isEmpty(this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.code)) rs = false;
        return rs
    }

    getCategoryList() {
        commonService.getCategoryListByType("decision").then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            if (res.data.result && res.data.result instanceof Array) {

                res.data.result.forEach(element => {
                    tempArray.push({
                        code: Number(element.dataValue),
                        value: element.dataName
                    });
                    if (element.dataValue == this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.category) {
                        this.props.editorStore.getDecisionTableListByC_E_DForApi(element.dataValue);
                    }
                })
                this.setState({
                    categoryList: tempArray
                })
            }
        })
    }

    updateSaveData = (key, value, options, i) => {
        console.log("updateSaveData  =", key, value, i);
        let decisionTableNodeVO = this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO;
        switch (key) {
            case 'category':
                decisionTableNodeVO.category = value;
                decisionTableNodeVO.decisionTableId = '';
                decisionTableNodeVO.code = '';

                this.props.editorStore.getDecisionTableListByC_E_DForApi(value);
                break;
            case 'code':
                this.props.editorStore.decisionTable.updateHelper('versionList', options);
                decisionTableNodeVO.code = value;
                decisionTableNodeVO.decisionTableId = '';
                decisionTableNodeVO.description = '';
                break;
            case 'decisionTableId':
                decisionTableNodeVO.decisionTableId = value;
                break;
            case 'description':
                decisionTableNodeVO.description = value;
                break;
            default:
                break;
        }
        
        this.props.editorStore.decisionTable.updatePropData('decisionTableNodeVO', decisionTableNodeVO);

        if (this.checkIsFinish()) {
            this.props.editorStore.decisionTable.updateData('status', '1');
            this.props.editorStore.sendUiData(this.props.editorStore.decisionTable.get_data);
        } else {
            this.props.editorStore.decisionTable.updateData('status', '0');
            this.props.editorStore.sendUiData(this.props.editorStore.decisionTable.get_data);
        }

    }


    render() {
        return (
            <div className="pageContent" style={style.root.style}>
                <p style={style.root.title.style}>基本信息</p>

                <Form>
                    <FormItem
                        name="名称"
                        type="input"
                        isNotNull={true}
                        changeCallBack={(key, value) => {
                            if (!common.isEmpty(value))
                                value = value.substr(0, 30);

                            this.props.editorStore.decisionTable.updateData('title', value);
                            let decisionTableNodeVO = this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO;
                            decisionTableNodeVO.name = value;
                            this.props.editorStore.decisionTable.updatePropData('decisionTableNodeVO', decisionTableNodeVO);

                            if (this.checkIsFinish()) {
                                this.props.editorStore.decisionTable.updateData('status', '1');
                                this.props.editorStore.sendUiData(this.props.editorStore.decisionTable.get_data);
                            } else {
                                this.props.editorStore.decisionTable.updateData('status', '0');
                                this.props.editorStore.sendUiData(this.props.editorStore.decisionTable.get_data);
                            }
                        }}
                        code="name"
                        defaultValue={this.props.editorStore.decisionTable.get_data.title}
                    ></FormItem>

                    <FieldCell name="选择需要添加的决策表" >
                        <CascadeWithTitle style={{width: '200px'}} isVersions={true} changeCallBack={this.updateSaveData} firstCode="category" secondCode="code" firstValue={this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.category} secondValue={this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.code} firstSelectData={this.state.categoryList} secondSelectData={this.props.editorStore.decisionTable.get_helper.decisionTableList} />
                    </FieldCell>

                    <div className="clearfix">
                        <p style={{ float: 'left', width: 'fit-content', height: '32px', lineHeight: '32px', padding: '0 8px', marginBottom: '5px' }}>版本</p>
                        <Select style={{ float: 'left', width: '150px', marginBottom: '5px' }}
                            value={this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.decisionTableId}
                            onChange={(value, option) => {
                                this.updateSaveData('decisionTableId', value)
                                this.updateSaveData('description', option.props.description)
                            }}>
                            {
                                this.props.editorStore.decisionTable.get_helper.versionList.map((item, i) =>
                                    <Select.Option value={item.id} description={item.description}>{item.version}</Select.Option>
                                )
                            }
                        </Select>
                    </div>


                    <FormItem
                        name="决策表描述"
                        type="textarea"
                        isNotNull={false}
                        readonly={true}
                        defaultValue={this.props.editorStore.decisionTable.get_data.data.decisionTableNodeVO.description}
                    ></FormItem>
                </Form>
            </div>
        )
    }
}

DecisionTable.propTypes = {
}
DecisionTable.defaultProps = {
}

export default DecisionTable

const style = {
    root: {
        style: {
            height: '100%', padding: '0', margin: '0', color: 'rgba(0, 0, 0, 0.847058823529412)', height: '30px', lineHeight: '30px'
        },
        title: {
            style: {
                textAlign: 'left',
                backgroundColor: 'rgba(249, 249, 249, 1)',
                borderColor: 'rgba(233, 233, 233, 1)',
                paddingLeft: '12px'
            }
        }
    }
}