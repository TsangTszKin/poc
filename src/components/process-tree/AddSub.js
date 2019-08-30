import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

class AddSub extends Component {
    constructor(props) {
        super(props);
    }
    add = () => {
        this.props.add();
    }
    sub = () => {
        this.props.sub();
    }
    render() {
        return (
            <p className="node-action">
                {(() => {
                    switch (this.props.type) {
                        case 'add':
                            return <Icon style={{fontSize: '12px'}} type="plus-circle" className="add" onClick={this.add} />;
                        case 'sub':
                            return <Icon style={{fontSize: '12px'}} type="minus-circle" className="sub" onClick={this.sub}/>;
                        case 'add-sub':
                            return <p><Icon style={{fontSize: '12px'}} type="plus-circle" className="add" onClick={this.add} /> <Icon style={{fontSize: '12px'}} type="minus-circle" className="sub" onClick={this.sub} /></p>;
                        default:
                            break;
                    }
                })()}
            </p>
        )
    }
}
AddSub.propTypes = {
    type: PropTypes.oneOf(['add', 'sub', 'add-sub'])
}
AddSub.defaultProps = {
    type: 'add-sub'
}
export default AddSub;