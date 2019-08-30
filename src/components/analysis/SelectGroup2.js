/*
 * @Author: zengzijian
 * @Date: 2018-12-13 16:21:45
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:06:54
 * @Description: 
 */
import React, { Component } from 'react';
import FieldSelector2 from '@/components/analysis/FieldSelector2';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class SelectGroup2 extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div style={{ display: this.props.store.getSelectValueList1.length == 0 ? 'none' : 'flow-root', margin: '0 0 24px 0', width: this.props.width ? this.props.width : '100%', float: 'left', paddingLeft: '15px' }}>
                <p style={{ float: 'left', width: 'fint-content', height: '32px', lineHeight: '32px' }}>{this.props.firstTitle}</p>
                <div style={{ float: 'left', width: 'calc(100% - 70px)' }}>
                    <FieldSelector2 value={this.props.store.getSelectValueList2}></FieldSelector2>
                </div>
                <div style={{ clear: 'both' }}></div>
            </div>
        )
    }
}
SelectGroup2.propTypes = {
    firstTitle: PropTypes.string,
    style: PropTypes.object,
    eventSourceIds: PropTypes.array,
    haveCompare: PropTypes.bool,
    isShowBtn: PropTypes.bool
}
SelectGroup2.defaultProps = {
    eventSourceIds: [],
    haveCompare: true,
    isShowBtn: true
}

export default SelectGroup2;