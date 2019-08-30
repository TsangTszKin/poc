import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Icon, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import common from '@/utils/common';

const style = {
    container: {
        width: 'fit-content',
        float: 'left',
        height: '32px',
        lineHeight: '32px',
        padding: '0',
        margin: '0',
        // paddingTop: '3px'
    },
    sub: {
        margin: '0 3px 0 2px',
        color: '#E44B4E',
        fontSize: '15px',
        cursor: 'pointer'
    },
    add: {
        margin: '0 2px 0 3px',
        color: '#00A854',
        fontSize: '15px',
        cursor: 'pointer'
    }
}
@inject('GlobalStore')
class AddAndSub extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p className="container" style={common.isEmpty(this.props.style) ? style.container : this.props.style}>

                {(() => {
                    switch (this.props.type) {
                        case 'add':
                            return <Icon type="plus-circle" className="add" onClick={this.props.add} style={style.add} title="增加" />;
                        case 'sub':
                            return <Icon type="minus-circle" className="sub" onClick={this.props.sub} style={style.sub} title="删除" />;
                        case 'add-sub':
                            return <p><Icon type="plus-circle" className="add" onClick={this.props.add} style={style.add} title="增加" /> <Icon type="minus-circle" className="sub" onClick={this.props.sub} style={style.sub} title="删除" /></p>;
                        default:
                            break;
                    }
                })()}

            </p>
        )
    }
}

AddAndSub.propTypes = {
    type: PropTypes.oneOf(['add', 'sub', 'add-sub'])
}
AddAndSub.defaultProps = {
    type: 'add-sub'
}

export default AddAndSub;