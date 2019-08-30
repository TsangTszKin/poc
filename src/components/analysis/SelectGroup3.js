/*
 * @Author: zengzijian
 * @Date: 2018-10-24 08:42:05
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:07:04
 * @Description: 
 */
import React, { Component } from 'react';
import FieldSelector3 from '@/components/analysis/FieldSelector3';
import AddAndSub from '@/components/AddAndSub';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import publicUtils from '@/utils/publicUtils';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class SelectGroup3 extends Component {
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
        this.add = this.add.bind(this);
    }


    change = () => {

    }

    add = () => {
        let tempArray = this.props.store.getSelectValueList3;
        tempArray.push({ optType: '', value: '', col: '', type: '', optTypeList: [] });
        this.props.store.setSelectValueList3(tempArray);
    }


    render() {
        return (
            <div style={{ display: this.props.store.getSelectValueList1.length == 0 ? 'none' : 'flow-root', margin: '0 0 24px 0', float: 'left', width: '100%', paddingLeft: '15px' }}>
                <p style={{ float: 'left', width: 'fint-content', height: '32px', lineHeight: '32px' }}>{this.props.firstTitle}</p>
                <div style={{ float: 'left' }}>
                    {this.props.store.getSelectValueList3.map((item, i) =>
                        <FieldSelector3 key={i} value={item} index={i}></FieldSelector3>
                    )}

                </div>

                <div style={{ float: 'left', display: this.props.store.getSelectValueList3.length >= 3 ? 'none' : 'block' }}>
                    <AddAndSub type="add" add={this.add} />
                </div>
                {
                    publicUtils.isAuth('analysis:event:statistics:view') ?
                        <Button type="primary" style={{ float: 'right', marginBottom: '20px' }} onClick={this.props.store.getEventDetailsList}>查询</Button>
                        :
                        ''
                }
                <div style={{ clear: 'both' }}></div>

            </div>
        )
    }
}
SelectGroup3.propTypes = {
    firstTitle: PropTypes.string,
    style: PropTypes.object,
    eventSourceIds: PropTypes.array,
    haveCompare: PropTypes.bool
}
SelectGroup3.defaultProps = {
    eventSourceIds: [],
    haveCompare: true
}

export default SelectGroup3;