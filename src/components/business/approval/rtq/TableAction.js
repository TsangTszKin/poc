import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@/styles/status.less';
import { Icon, Popconfirm } from 'antd';
import publicUtils from '@/utils/publicUtils';

class TableAction extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <p style={{ margin: '0' }}>
                <Icon type="ordered-list" title="审核过程" onClick={() => {
                    this.props.auditProcessCallBack(true)
                }} style={{ cursor: 'pointer', marginRight: '10px' }} />
                {
                    publicUtils.isAuth("business:approval:rtq:audit") && this.props.isShowYOrN ?
                        <Popconfirm
                            title={"通过该审核?"}
                            onConfirm={() => { this.props.passCallBack(this.props.index) }}
                            onCancel={() => { }}
                            okText="确定"
                            cancelText="取消">
                            <Icon type="check-circle" title="通过" style={{ color: '#00a854', cursor: 'pointer', marginRight: '10px' }} />
                        </Popconfirm>
                        :
                        ''
                }
                {
                    publicUtils.isAuth("business:approval:rtq:audit") && this.props.isShowYOrN ?
                        <Popconfirm
                            title={"否决该审核?"}
                            onConfirm={() => { this.props.refuseCallBack(this.props.index) }}
                            onCancel={() => { }}
                            okText="确定"
                            cancelText="取消">
                            <Icon type="close-circle" title="拒绝" style={{ color: '#E44B4E', cursor: 'pointer' }} />
                        </Popconfirm>
                        :
                        ''
                }
            </p>
        )
    }
}
TableAction.propTypes = {
    passCallBack: PropTypes.func.isRequired,
    refuseCallBack: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isShowYOrN: PropTypes.bool
}
TableAction.defaultProps = {
    isShowYOrN: true
}
export default TableAction