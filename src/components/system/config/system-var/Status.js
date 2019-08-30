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
            <div className="status">
                {
                    (() => {
                        let status = variable.systemVarStatus(this.props.status);
                        switch (this.props.status) {
                            case 1:
                                return <div><p className="status-label online"></p><p className="status-name status-name-active">{status}</p></div>
                            case 2:
                                return <div><p className="status-label ready"></p><p className="status-name status-name-active">{status}</p></div>
                            default:
                                return <div><p className="status-label ing"></p><p className="status-name">{status}</p></div>
                        }
                    })()
                }

            </div>
        )
    }
}
Status.propTypes = {
    status: PropTypes.number.isRequired
}
Status.defaultProps = {

}
export default Status