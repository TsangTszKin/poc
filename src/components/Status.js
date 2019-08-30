import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@/styles/status.less';
import variable from '@/filters/variable';
import loadinng from '@/assets/loading.mini.png';
import { Icon } from 'antd';

class Status extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="status" style={this.props.style}>
                {
                    (() => {
                        let status = variable.variableStatus(this.props.status);
                        switch (this.props.status) {
                            case 0:
                                return <div><p className="status-label ing"></p><p className="status-name">{status}</p></div>
                                break;
                            case 1:
                                return <div><p className="status-label ready"></p><p className="status-name status-name-active">{status}</p></div>
                                break;
                            case 2:
                                return <div><p className="status-label ing"></p><p className="status-name">{status}</p></div>
                                break;
                            case 3:
                                return <div><p className="status-label ing"></p><p className="status-name">{status}</p></div>
                                break;
                            case 4:
                                return <div><p className="status-label online"></p><p className="status-name status-name-active">{status}</p></div>
                                break;
                            case 5:
                                return <div><p className="status-label ing"></p><p className="status-name">{status}</p></div>
                                break;
                            case 6:
                                return <div><p className="status-label warning"></p><p className="status-name status-name-active">{status}</p></div>
                                break;
                            case 7:
                                return <div><p className="status-label ready"></p><p className="status-name status-name-active">{status}</p></div>
                                break;
                            case 8:
                                return <div><p className="status-label ready"></p><p className="status-name status-name-active">{status}</p></div>
                                break;
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