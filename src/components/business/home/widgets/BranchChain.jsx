import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react'
import BranchChainCell from '@/components/business/home/widgets/BranchChainCell'
import common from '@/utils/common';

@inject('store') @observer
class BranchChain extends Component {
    render() {
        return (
            <div style={{ marginRight: '20px' }}>
                {
                    this.props.data.map((item, i) =>
                        <BranchChainCell key={i} nodeKey={i} {...item} />
                    )
                }
            </div>
        );
    }
}

BranchChain.propTypes = {
    data: PropTypes.array
};
BranchChain.defaultProps = {
    data: []
}

export default BranchChain;

const data = [
    {
        title: 'A服务集群',
        count: 200,
        time: 20
    },
    {
        title: 'B服务集群',
        count: 200,
        time: 20
    },
    {
        title: 'C服务集群',
        count: 200,
        time: 20
    },
    {
        title: 'D服务集群',
        count: 200,
        time: 20
    }
]