import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class FormCell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{
                height: this.props.textArea ? '160px' : '83px',
                width: this.props.textArea ? '100%' : '300px',
                padding: '10px'
            }}>
                <div>
                    <span style={{ display: this.props.isNotNull ? 'initial' : 'none', marginRight: '5px', color: '#E44B4E' }}>*</span><span style={style.name}>{this.props.name}</span>
                </div>
                {this.props.children}
            </div>
        )
    }
}
FormCell.propTypes = {
    isNotNull: PropTypes.bool,
    name: PropTypes.string,
    textArea: PropTypes.bool
}
FormCell.defaultProps = {
    isNotNull: false,
    name: '',
    textArea: false
}
export default FormCell

const style = {
    name: {
        color: '#000'
    }
}
