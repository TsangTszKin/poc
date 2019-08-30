/*
 * @Author: zengzijian
 * @Date: 2018-12-13 16:22:24
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:05:33
 * @Description: 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd'
import { inject, observer } from 'mobx-react';

const style = {
    container: {
        height: '32px',
        width: 'fit-content',
        // marginBottom: '24px'
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
class FieldSelector2 extends Component {
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
    }

    change = (key, value) => {
        console.log("value", value)
        // for (let i = 0; i < value.length && i < 3; i++) {
        //     const element = value[i];
        //     valueList.push(element);
        // }
        this.props.store.setSelectValueList2(value);
    }

    render() {
        return (
            <div style={style.container}>
                <Select mode="multiple" showSearch={true} optionFilterProp="search" style={{ minWidth: '150px', float: 'left', margin: '0px 10px 0 10px' }} value={this.props.value} onChange={(value) => { this.change('ruleCode', value); }}>
                    {this.props.store.getRuleList.map((item, i) =>
                        <Select.Option key={i} search={`${item.code}${item.value}`} value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>
            </div>
        )
    }
}
FieldSelector2.propTypes = {
    index: PropTypes.number
}
FieldSelector2.defaultProps = {
}
export default FieldSelector2;