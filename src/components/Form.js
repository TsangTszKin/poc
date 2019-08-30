import React, {Component} from 'react'
import PropTypes from 'prop-types'

const style = {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
}

class Form extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }
}

export default Form