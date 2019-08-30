import React, { Component } from 'react';
import PropTypes from 'prop-types'

const style = {
    notNull: {
        // marginRight: '5px',
        // color: 'rgb(228, 75, 78)'
    },
    name: {
        color: '#000'
    }
}

class FormTitle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <span style={{ display: this.props.isNotNull ? 'initial' : 'none', marginRight: '5px', color: '#E44B4E' }}>*</span><span style={style.name}>{this.props.name}</span>
            </div>
        )
    }
}
FormTitle.propTypes = {
    name: PropTypes.string.isRequired,
    isNotNull: PropTypes.bool
}
FormTitle.defaultProps = {
    isNotNull: true
}
export default FormTitle;