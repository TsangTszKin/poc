/*
 * @Author: zengzijian
 * @Date: 2019-03-14 10:08:32
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:06:44
 * @Description: 
 */
import React, { Component } from 'react';
import FieldSelector from '@/components/analysis/FieldSelector';
import PropTypes from 'prop-types';
import publicUtils from '@/utils/publicUtils';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';

@inject('store')
@observer
class SelectGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.add = this.add.bind(this);
    }

    componentDidMount() {
    }


    add() {
        let selectValueList1 = this.props.store.getSelectValueList1;
        selectValueList1.push({ eventSourceCode: '', strategyId: '', eventSourceId: '' });
        this.props.store.setSelectValueList1(selectValueList1);
    }

    render() {
        let valueList = [];
        this.props.store.getSelectValueList1.forEach(element => {
            valueList.push(`${element.strategyCode}·-·${element.eventSourceId}·-·${element.eventSourceCode}·-·${element.strategyId}`);
        })
        // console.log("valueList", valueList)
        return (
            <div style={{ display: 'flow-root', marginBottom: '24px' }}>
                <p style={{ float: 'left', width: 'fint-content', height: '32px', lineHeight: '32px' }}>{this.props.firstTitle}</p>
                {/* {this.props.store.getSelectValueList1.map((item, i) =>
                    <FieldSelector sub={this.props.sub} valueListCount={this.props.valueList.length} value={item} index={i} selectGroupChange={this.props.selectGroupChange} resultName={this.props.resultName}></FieldSelector>
                )} */}
                <FieldSelector sub={this.props.sub} value={valueList} selectGroupChange={this.props.selectGroupChange} resultName={this.props.resultName}></FieldSelector>
                {/* <div style={{ float: 'left', display: this.props.store.getSelectValueList1.length >= 3 ? 'none' : 'block' }}>
                    <AddAndSub type="add" add={this.add} />
                </div> */}
                {
                    publicUtils.isAuth('analysis:event:statistics:view') ?
                        <Button type="primary" style={{ float: 'right', marginBottom: '20px', width: '65px' }} onClick={() => { this.props.store.getStatisticsListForApi(); this.props.store.getChartDataForApi(); }}>查询</Button>
                        :
                        ''
                }
                <div style={{ clear: 'both' }}></div>
            </div>
        )
    }
}
SelectGroup.propTypes = {
    valueList: PropTypes.array,
    selectData: PropTypes.array,
    firstTitle: PropTypes.string,
    resultName: PropTypes.string,
    add: PropTypes.func,
    sub: PropTypes.func
}
SelectGroup.defaultProps = {
    valueList: [],
    selectData: []
}

export default SelectGroup;