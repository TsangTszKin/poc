import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@/styles/status.less';
import common from '@/utils/common';

class Status extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="status" style={this.props.style}>
                {
                    (() => {
                        switch (this.props.status) {
                            case 0:
                                return <div><p className="status-label online"></p><p className="status-name">审核中</p></div>
                            case 1:
                                return <div><p className="status-label ready"></p><p className="status-name status-name-active">通过</p></div>
                            case 2:
                                return <div><p className="status-label ing"></p><p className="status-name">拒绝</p></div>
                            case 3:
                                return <div><p className="status-label ing"></p><p className="status-name">审核中</p></div>
                            default:
                                break;
                        }
                    })()
                }

            </div>
        )
    }
}
Status.propTypes = {
    status: PropTypes.number.isRequired,
    style: PropTypes.object
}
Status.defaultProps = {
    style: {}
}
export default Status