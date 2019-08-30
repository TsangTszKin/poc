import React from 'react';
import PropTypes, { number } from 'prop-types';
import { Input } from 'antd';

class FieldCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={style.root.style}>
                <p style={style.root.name.style}>{this.props.name}</p>
                {
                    this.props.children
                }
            </div>
        )
    }
}

FieldCell.propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOf(['string', 'number'])
}
FieldCell.defaultProps = {
    name: '',
    value: null
}
export default FieldCell;

const style = {
    root: {
        style: {
            width: '100%',
            padding: '10px'
        },
        name: {
            style: {
                width: '100%',
                height: '32px',
                lineHeight: '32px',
                paddingLeft: '12px'
            }
        },
        form: {
            style: {
                float: 'left',
                width: '100%'
            }
        }
    },

}

