import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import BranchESBCell from '@/components/business/home/widgets/BranchESBCell'

@inject('store') @observer
class BranchESB extends Component {
    render() {
        return (
            <div className="clearfix">
                {
                    this.props.data.map((item, i) =>
                        <BranchESBCell key={i} nodeKey={i} {...item} start={i === 0} end={this.props.data.length - 1 === i} />
                    )
                }
            </div>
        );
    }
}

BranchESB.propTypes = {
    data: PropTypes.array
};
BranchESB.defaultProps = {
    data: []
}
export default BranchESB;