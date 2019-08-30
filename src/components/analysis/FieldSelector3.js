/*
 * @Author: zengzijian
 * @Date: 2018-12-13 16:22:24
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:05:46
 * @Description: 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Button } from 'antd'
import AddAndSub from '@/components/AddAndSub';
import FixedValue from '@/components/condition-tree/FixedValue';
import { inject, observer } from 'mobx-react';

const style = {
    container: {
        height: '32px',
        width: 'fit-content',
        marginBottom: '24px'
    },
    selectText: {
        width: 'fit-content',
        float: 'left',
        margin: '0px 10px 0 10px',
        height: '32px',
        lineHeight: '32px'
    },
    select1: {
        width: '250px',
        float: 'left',
        margin: '0 10px',
    },
    select2: {
        width: '100px',
        float: 'left',
        margin: '0 10px',
        marginLeft: '30px'
    },
    input: {
        float: 'left',
        margin: '0 10px',
        width: '100px',
    }
}

@inject('store')
@observer
class FieldSelector3 extends Component {
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
        this.sub = this.sub.bind(this);
        this.clear = this.clear.bind(this);
    }

    change = (key, value) => {
        let selectValueList3 = this.props.store.getSelectValueList3;
        selectValueList3[this.props.index][key] = value;
        this.props.store.setSelectValueList3(selectValueList3);
        // this.props.store.getEventDetails();
        console.log(this.props.store.getSelectValueList3)
    }

    sub = () => {
        let selectValueList3 = this.props.store.getSelectValueList3;
        selectValueList3.splice(this.props.index, 1);
        this.props.store.setSelectValueList3(selectValueList3);
        // this.props.store.getEventDetails();
    }

    clear() {
        let selectValueList3 = this.props.store.getSelectValueList3;
        selectValueList3[this.props.index] = {  optType: '', value: '', col: '', type: '', optTypeList: [] };
        this.props.store.setSelectValueList3(selectValueList3);
    }

    render() {
        return (
            <div style={style.container}>
                {/* <Select style={{ width: '150px', float: 'left', margin: '0px 30px 0 10px' }} value={this.props.value.ruleCode} onChange={(value) => { this.change('ruleCode', value); }}>
                    {this.props.store.getRuleList.map((item, i) =>
                        <Select.Option value={item.code}>{item.value}</Select.Option>
                    )}
                </Select> */}
                {/* {
                    this.props.index === 0 ? <p style={{ width: '70px', float: 'left', height: '32px', lineHeight: '32px', margin: '0' }}>筛选条件：</p> : <p style={{ width: '70px', float: 'left', height: '32px', lineHeight: '32px', margin: '0' }}></p>
                } */}
                <Select showSearch={true} optionFilterProp="search" placeholder="选择字段" style={{ width: '150px', float: 'left', margin: '0px 10px 10px 10px' }} value={this.props.value.col} onChange={(value, option) => { this.change('col', value); this.change('type', option.props.type); this.change('optType', ""); this.props.store.filterOptTypeList(); this.change('value', "") }}>
                    {this.props.store.getCols.map((item, i) =>
                        <Select.Option key={i} value={item.value} type={item.type} search={`${item.value}${item.title}`}>{item.title}</Select.Option>
                    )}
                </Select>
                <Select placeholder="选择关系" style={{ width: '100px', float: 'left', margin: '0px 10px 10px 10px' }} value={this.props.value.optType} onChange={(value) => { this.change('optType', value); }}>
                    {this.props.value.optTypeList.map((item, i) =>
                        <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>

                {
                    this.props.value.type === 16 || this.props.value.optType === 'IS_NULL' || this.props.value.optType === 'NOT_NULL' ? '' :
                        // <Input placeholder="输入值" style={{ width: '100px', float: 'left', margin: '0px 10px 10px 10px' }} value={this.props.value.value} onChange={(e) => { this.change('value', e.target.value); }} />
                        <FixedValue type="defaultValue" style={{ width: '120px', float: 'left', margin: '0px 10px 10px 10px' }} value={this.props.value.value} changeData={(key, value) => this.change('value', value)} dataType={this.props.value.type} />
                }
                <Button style={{ float: 'left', margin: '0px 10px 10px 10px' }} onClick={this.clear} >清除</Button>
                {
                    this.props.store.getSelectValueList3.length > 1 ? <AddAndSub type="sub" sub={this.sub} /> : ''
                }
            </div>
        )
    }
}
FieldSelector3.propTypes = {
    index: PropTypes.number
}
FieldSelector3.defaultProps = {
}
export default FieldSelector3;