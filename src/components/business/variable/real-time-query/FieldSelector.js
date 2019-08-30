import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd'

const style = {
    container: {
        height: '42px',
        paddingTop: '10px',
        width: 'fit-content',
        float: 'left'
    },
    selectText: {
        width: 'fit-content',
        float: 'left',
        margin: '0px 10px 0 10px',
        height: '32px',
        lineHeight: '32px'
    },
    select: {
        width: '150px',
        float: 'left'
    }
}

class FieldSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
        this.change = this.change.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: nextProps.value
            })
        }

    }

    change = (value) => {
        if (this.props.resultName === 'orderFields') {
            value = { field: value, order: this.props.value.order }
        }
        this.props.selectGroupChange(this.props.index, this.props.resultName, value);
        this.setState({
            value: value
        })
    }

    changeOrder = (value) => {
        value = { field: this.props.value.field, order: value };
        this.props.selectGroupChange(this.props.index, this.props.resultName, value);
        this.setState({
            value: value
        })
    }

    render() {
        return (
            <div style={style.container}>
                <p style={style.selectText}>{this.props.name}</p>
                <Select style={style.select} onChange={this.change} value={this.props.resultName === 'orderFields' ? this.state.value.field : this.state.value}>
                    {this.props.selectData.map((item, i) =>
                        <Select.Option value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>
                {
                    this.props.resultName === 'orderFields' ? <Icon type={this.state.value.order === 'asc' ? 'arrow-up' : 'arrow-down'} theme="outlined" style={{ margin: '10px' }} onClick={() => { this.changeOrder(this.state.value.order === 'asc' ? 'desc' : 'asc') }} /> : ''
                }

            </div>
        )
    }
}
FieldSelector.propTypes = {
    name: PropTypes.string.isRequired,
    selectData: PropTypes.array,
    index: PropTypes.number,
    selectGroupChange: PropTypes.func,
    resultName: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string,
    PropTypes.number])
}
FieldSelector.defaultProps = {
    selectData: [],
    selectGroupChange: () => { },
    resultName: "",
    value: ''
}
export default FieldSelector;