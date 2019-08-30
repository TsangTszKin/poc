/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:51
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:33:10
 * @Description: 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddAndSub from '@/components/AddAndSub';
import FieldSelector from '@/components/business/variable/real-time-query/FieldSelector';
import TreePanel from '@/components/condition-tree/TreePanel';
import FormTitle from '@/components/FormTitle';


const selectData = [
    { code: 'A', value: 'A' },
    { code: 'B', value: 'B' },
    { code: 'C', value: 'C' }
]

class QueryConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldSelector: []
        }
        this.sub = this.sub.bind(this);
        this.add = this.add.bind(this);
    }

    /**
     * 删除操作回调
     */
    sub = () => {
        let tempArray = this.state.fieldSelector;
        tempArray.pop();
        this.setState({
            fieldSelector: tempArray
        })
    }

    /**
     * 增加操作回调
     */
    add = () => {
        let tempArray = this.state.fieldSelector;
        tempArray.push({
            name: '和',
            selectData: selectData
        });
        this.setState({
            fieldSelector: tempArray
        })
    }
    render() {


        return (
            <div className="query-config-container">
                <div className="left">
                    <FormTitle isNotNull={true} name="分组字段"></FormTitle>
                    <div>
                        <FieldSelector name="按" selectData={selectData}></FieldSelector>
                        {this.state.fieldSelector.map((item, i) =>
                            <FieldSelector key={i} name={item.name} selectData={item.selectData}></FieldSelector>
                        )}
                        <AddAndSub sub={this.sub} add={this.add}></AddAndSub>
                    </div>
                </div>
                <div className="right">
                    <FormTitle isNotNull={true} name="查询字段"></FormTitle>
                    <div>
                        <FieldSelector name="对" selectData={selectData}></FieldSelector>
                        <FieldSelector name="进行" selectData={selectData}></FieldSelector>
                        <p className="query">查询</p>
                    </div>
                </div>
                <div className="bottom">
                    <FormTitle isNotNull={true} name="查询条件"></FormTitle>
                    <TreePanel></TreePanel>
                </div>
            </div>
        )
    }
}

QueryConfig.propTypes = {
    selectData: PropTypes.array,
}
QueryConfig.defaultProps = {
    selectData: [{ code: 'all', value: '所有' }]
}

export default QueryConfig