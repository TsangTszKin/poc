import React from 'react';
import { Input, Select, Table, Button, Icon, Divider, Transfer } from 'antd';
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

@inject("editorStore")
@observer
class OutPutPanel extends React.Component {
    constructor(props) {
        super(props);
        this.getParamSelection = this.getParamSelection.bind(this);
        this.changeKey = this.changeKey.bind(this);
    }

    componentDidMount() {
        this.getParamSelection();
    }

    getParamSelection() {
        commonService.getParamSelection().then(res => {
            if (!publicUtils.isOk(res)) return
            if (common.isArray(res.data.result)) {
                res.data.result.forEach(element => {
                    element.key = element.id;
                })
                this.props.editorStore.output.updateHelper('parametersList', res.data.result);
                let selectedKeys = [];
                this.props.editorStore.output.get_data.data.outPutNodeVO.parameters.forEach(element => {
                    selectedKeys.push(element.id)
                })
                this.props.editorStore.output.updateHelper('parametersKey', selectedKeys);
            }
        })
    }

    changeKey(keys) {
        this.props.editorStore.output.updateHelper('parametersKey', keys);
    }
    render() {
        return (
            <Transfer
                dataSource={this.props.editorStore.output.get_helper.parametersList}
                showSearch
                listStyle={{
                    width: 250,
                    height: 300,
                }}
                operations={['加入', '移除']}
                targetKeys={this.props.editorStore.output.get_helper.parametersKey}
                onChange={this.changeKey}
                render={item => `${item.name}`}
            />
        )
    }
}
export default OutPutPanel