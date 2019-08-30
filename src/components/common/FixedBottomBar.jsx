import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@/styles/components/FixedBottomBar.less'

class FixedBottomBar extends Component {
    render() {
        const { children, style } = this.props;
        return (
            <div className="fixed-bottom fixed-bottom-bar" style={ style }>
                { children }
            </div>
        );
    }
}

FixedBottomBar.propTypes = {};

export default FixedBottomBar;
