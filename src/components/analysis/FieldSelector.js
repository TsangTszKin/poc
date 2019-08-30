/*
 * @Author: zengzijian
 * @Date: 2018-10-17 13:58:48
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:04:55
 * @Description: 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect } from 'antd'
import { inject, observer } from 'mobx-react';
import common from '@/utils/common';

const style = {
    container: {
        height: '32px',
        width: 'fit-content',
        float: 'left'
    },
    selectText: {
        width: 'fit-content',
        float: 'left',
        margin: '0px 10px 0 10px',
        height: '32px',
        lineHeight: '32px'
    },
    select: {
        minWidth: '150px',
        float: 'left',
        margin: '0 10px',
    }
}
@inject('store')
@observer
class FieldSelector extends Component {
    constructor(props) {
        super(props);
        this.sub = this.sub.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    sub = () => {
        let selectValueList1 = this.props.store.getSelectValueList1;
        selectValueList1.splice(this.props.index, 1);
        this.props.store.setSelectValueList1(selectValueList1);

        let tempArray = [];
        selectValueList1.forEach(element => {
            tempArray.push(element.strategyCode)
        })
        if (!common.isEmpty(tempArray))
            this.props.store.getRuleListByStrategyList(tempArray);

        // this.props.store.getEventDetails();
    }

    onChange(value, label, extra) {//value=strategyCode·-·eventSourceId·-·eventSourceCode
        console.log(value, label, extra);
        let selectDataList = [];

        if (common.isEmpty(value)) {
            selectDataList = [{ eventSourceCode: '', eventSourceId: '', strategyCode: '' }];
        } else {

            for (let i = 0; i < value.length && i < 3; i++) {
                const element = value[i];
                let strategyCode = element.split("·-·")[0];
                let strategyId = element.split("·-·")[3];
                let eventSourceId = element.split("·-·")[1];
                let eventSourceCode = element.split("·-·")[2];
                selectDataList.push({
                    strategyCode: strategyCode,
                    strategyId: strategyId,
                    eventSourceId: eventSourceId,
                    eventSourceCode: eventSourceCode,
                })
            }

        }



        this.props.store.setSelectValueList1(selectDataList);

        // this.props.store.getSelectValueList2.forEach(element => {
        //     let tempObj = common.deepClone(element);
        //     tempObj.ruleCode = "";
        //     tempArrayForValueList2.push(tempObj);
        // })
        this.props.store.setSelectValueList2([]);
        this.props.store.setRuleList([]);

        let tempArray = [];
        selectDataList.forEach(element => {
            if (!common.isEmpty(element.strategyId))
                tempArray.push(element.strategyId);
        })
        if (!common.isEmpty(tempArray))
            this.props.store.getRuleListByStrategyList(tempArray);

        this.props.store.getEventCols();
    }

    render() {
        console.log("value", this.props.value)
        console.log("this.props.store.getStrategyList", this.props.store.getStrategyList)
        // let strategyCode = this.props.value[0].split("·-·")[0];
        let eventSourceId = this.props.value[0].split("·-·")[0];
        let eventSourceCode = this.props.value[0].split("·-·")[1];
        console.log("this.props.value", (!eventSourceId && !eventSourceCode) ? [] : this.props.value)
        // alert(!strategyCode && !eventSourceId && !eventSourceCode)
        return (
            <div style={style.container}>
                <TreeSelect
                    showSearch
                    treeNodeFilterProp="search"
                    multiple
                    style={style.select}
                    value={(!eventSourceId && !eventSourceCode) ? [] : this.props.value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.props.store.getStrategyList}
                    placeholder="请选择事件"
                    treeDefaultExpandAll
                    onChange={this.onChange}
                />
                {/* {
                    this.props.store.getSelectValueList1.length > 1 ? <AddAndSub type="sub" sub={this.sub} /> : ''
                } */}

            </div>
        )
    }
}
FieldSelector.propTypes = {
    index: PropTypes.number
}
FieldSelector.defaultProps = {
}
export default FieldSelector;