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
class RuleSet extends Component {
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
        if (common.isEmpty(this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.name)) rs = false;
        if (common.isEmpty(this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.ruleSetId)) rs = false;
        if (common.isEmpty(this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.category)) rs = false;
        return rs
    }

    getCategoryList() {
        commonService.getCategoryListByType("ruleSet").then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            if (res.data.result && res.data.result instanceof Array) {

                res.data.result.forEach(element => {
                    tempArray.push({
                        code: Number(element.dataValue),
                        value: element.dataName
                    });
                })
                this.setState({
                    categoryList: tempArray
                })

                if (!common.isEmpty(this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.category)) {
                    this.props.editorStore.getRuleSetListByC_E_DForApi(this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.category)
                }
            }
        })
    }

    updateSaveData = (key, value, options) => {
        let ruleSetNodeVO = this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO;
        switch (key) {
            case 'category':
                ruleSetNodeVO.category = value;
                ruleSetNodeVO.ruleSetId = '';
                ruleSetNodeVO.ruleSetCode = '';

                this.props.editorStore.getRuleSetListByC_E_DForApi(value);
                break;
            case 'ruleSetCode':
                console.log("options", options)
                this.props.editorStore.ruleSet.updateHelper('versionList', options);
                ruleSetNodeVO.ruleSetCode = value;
                ruleSetNodeVO.ruleSetId = '';
                ruleSetNodeVO.description = '';
                ruleSetNodeVO.sqlCode = '';
                break;
            case 'ruleSetId':
                    ruleSetNodeVO.ruleSetId = value;
                break;
            case 'description':
                    ruleSetNodeVO.description = value;
                break;
            case 'description':
                    ruleSetNodeVO.description = value;
                break;
            default:
                break;
        }
        
        this.props.editorStore.ruleSet.updatePropData('ruleSetNodeVO', ruleSetNodeVO);

        if (this.checkIsFinish()) {
            this.props.editorStore.ruleSet.updateData('status', '1');
            this.props.editorStore.sendUiData(this.props.editorStore.ruleSet.get_data);
        } else {
            this.props.editorStore.ruleSet.updateData('status', '0');
            this.props.editorStore.sendUiData(this.props.editorStore.ruleSet.get_data);
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

                            this.props.editorStore.ruleSet.updateData('title', value);
                            let ruleSetNodeVO = this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO;
                            ruleSetNodeVO.name = value;
                            this.props.editorStore.ruleSet.updatePropData('ruleSetNodeVO', ruleSetNodeVO);

                            
                            if (this.checkIsFinish()) {
                                this.props.editorStore.ruleSet.updateData('status', '1');
                                this.props.editorStore.sendUiData(this.props.editorStore.ruleSet.get_data);
                            } else {
                                this.props.editorStore.ruleSet.updateData('status', '0');
                                this.props.editorStore.sendUiData(this.props.editorStore.ruleSet.get_data);
                            }
                        }}
                        code="name"
                        defaultValue={this.props.editorStore.ruleSet.get_data.title}
                    ></FormItem>

                    <FieldCell name="选择需要添加的规则" >
                        <CascadeWithTitle style={{width: '200px'}} isVersions={true} changeCallBack={this.updateSaveData} firstCode="category" secondCode="ruleSetCode" firstValue={this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.category} secondValue={this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.ruleSetCode} firstSelectData={this.state.categoryList} secondSelectData={this.props.editorStore.ruleSet.get_helper.ruleSetList} />
                    </FieldCell>

                    <div className="clearfix">
                        <p style={{ float: 'left', width: 'fit-content', height: '32px', lineHeight: '32px', padding: '0 8px', marginBottom: '5px' }}>版本</p>
                        <Select style={{ float: 'left', width: '150px', marginBottom: '5px' }}
                            value={this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.ruleSetId}
                            onChange={(value, option) => {
                                this.updateSaveData('ruleSetId', value);
                                this.updateSaveData('description', option.props.description);
                                this.updateSaveData('sqlCode', option.props.sqlCode);
                            }}>
                            {
                                this.props.editorStore.ruleSet.get_helper.versionList.map((item, i) =>
                                    <Select.Option value={item.id} description={item.description} sqlCode={item.sqlCode}>{item.version}</Select.Option>
                                )
                            }
                        </Select>
                    </div>

                    <FormItem
                        name="规则描述"
                        type="textarea"
                        isNotNull={false}
                        readonly={true}
                        defaultValue={this.props.editorStore.ruleSet.get_data.data.ruleSetNodeVO.description}
                    ></FormItem>
                </Form>
            </div>
        )
    }
}

RuleSet.propTypes = {
}
RuleSet.defaultProps = {
}

export default RuleSet

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