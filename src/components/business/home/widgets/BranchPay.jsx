import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import BranchPayCell from '@/components/business/home/widgets/BranchPayCell'

@inject('store') @observer
class BranchPay extends Component {
    render() {
        return (
            <div style={{ marginRight: '20px' }}>
                {
                    this.props.data.map((item, i) =>
                        <BranchPayCell key={i} nodeKey={i} {...item} isESB={this.props.isESB} />
                    )
                }
            </div>
        );
    }
}

BranchPay.propTypes = {
    data: PropTypes.array,
    isESB: PropTypes.bool,
};
BranchPay.defaultProps = {
    data: [],
    isESB: false
}
export default BranchPay;