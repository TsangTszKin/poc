import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Input, Select, Switch, InputNumber, message} from 'antd';
import FormTitle from '@/components/FormTitle';
import commonService from '@/api/business/commonService';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';

const style = {
    container: {
        width: '300px',
        padding: '10px',
    },
    name: {
        color: '#000'
    },
    input: {
        marginTop: '10px'
    }
}

class FormItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            selectDefault: this.props.defaultValue,
            textareaDefault: this.props.defaultValue,
            switchDefault: this.props.defaultValue,
            InputNumberDefault: this.props.defaultValue,
            selectData: []
        }
        this.getCategoryListByType = this.getCategoryListByType.bind(this);
    }

    componentDidMount() {
        if (this.props.categoryType)
            this.getCategoryListByType();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.type === 'select') {
            this.setState({
                selectDefault: nextProps.defaultValue
            })
        }
        if (this.props.type === 'textarea') {
            this.setState({
                textareaDefault: nextProps.defaultValue
            })
        }
        if (this.props.type === 'switch' && this.props.defaultValue !== nextProps.defaultValue) {
            this.setState({
                switchDefault: nextProps.defaultValue
            })
        }
        if (this.props.type === 'InputNumber' && this.props.defaultValue !== nextProps.defaultValue) {
            this.setState({
                InputNumberDefault: nextProps.defaultValue
            })
        }
        if (this.props.name == 'mode') {
            // alert(this.prop.defaultValue);
        }

    }

    formatSelectDefaultVaule(value) {
        if (value === '·-·') {
            return ''
        } else {
            return value
        }
    }

    selectChange(value) {
        if (typeof this.props.code === 'string') {
            this.props.changeCallBack(this.props.code, value);
            this.setState({selectDefault: value});
        } else {
            let valueArray = value.split('·-·');
            this.props.changeCallBack(this.props.code, valueArray, true);
        }
    }

    getCategoryListByType() {
        commonService.getCategoryListByType(this.props.categoryType).then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            if (res.data.result && res.data.result instanceof Array) {

                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.dataValue + '·-·' + element.dataName,
                        value: element.dataName
                    });
                })
                this.setState({
                    selectData: tempArray
                })
            }
        })
    }

    render() {
        return (
            <div style={{
                height: this.props.type === 'textarea' ? '160px' : '83px',
                width: '300px',
                padding: '10px'
            }}>

                <FormTitle isNotNull={this.props.isNotNull} name={this.props.name}></FormTitle>
                {
                    this.props.code === 'defaultValue' ?
                        <FixedValue value={this.props.defaultValue} changeData={this.props.changeCallBack}
                                    dataType={this.props.dataType} style={{marginTop: '10px', width: '280px'}}
                                    disabled={this.props.disabled}
                                    type="defaultValue"/>
                        :
                        <Input readonly={this.props.readonly} disabled={this.props.disabled}
                               value={this.props.defaultValue}
                               onChange={this.props.changeCallBack ? (e) => this.props.changeCallBack(this.props.code, e.target.value) : () => {
                               }} placeholder={this.props.placeHolder} style={{
                            display: this.props.type === 'input' ? 'block' : 'none',
                            marginTop: '10px'
                        }}/>
                }

                <InputNumber readonly={this.props.readonly} min={this.props.numberMin} max={this.props.numberMax}
                             disabled={this.props.disabled} value={this.state.InputNumberDefault}
                             onChange={this.props.changeCallBack ? (value) => this.props.changeCallBack(this.props.code, value) : () => {
                             }} placeholder={this.props.placeHolder} style={{
                    display: this.props.type === 'InputNumber' ? 'block' : 'none',
                    marginTop: '10px',
                    width: '100%'
                }}/>
                {
                    this.props.categoryType ?
                        <Select readonly={this.props.readonly} disabled={this.props.disabled}
                                dropdownMatchSelectWidth={true}
                                onChange={this.props.changeCallBack ? (value) => {
                                    this.selectChange(value);
                                } : () => {
                                }} value={this.formatSelectDefaultVaule(this.state.selectDefault)} style={{
                            display: this.props.type === 'select' ? 'block' : 'none',
                            marginTop: '10px'
                        }}>
                            {this.state.selectData.map((item, i) =>
                                <Select.Option value={item.code}>{item.value}</Select.Option>
                            )}
                        </Select>
                        :
                        <Select readonly={this.props.readonly} disabled={this.props.disabled}
                                dropdownMatchSelectWidth={true}
                                onChange={this.props.changeCallBack ? (value) => {
                                    this.selectChange(value);
                                } : () => {
                                }} value={this.formatSelectDefaultVaule(this.state.selectDefault)} style={{
                            display: this.props.type === 'select' ? 'block' : 'none',
                            marginTop: '10px'
                        }}>
                            {this.props.selectData.map((item, i) =>
                                <Select.Option value={item.code}>{item.value}</Select.Option>
                            )}
                        </Select>
                }
                <Input.TextArea readonly={this.props.readonly} disabled={this.props.disabled}
                                placeholder={this.props.placeHolder}
                                value={this.state.textareaDefault} onChange={this.props.changeCallBack ? (e) => {
                    this.props.changeCallBack(this.props.code, e.target.value);
                    this.setState({textareaDefault: e.target.value});
                } : () => {
                }} rows={4} style={{
                    display: this.props.type === 'textarea' ? 'block' : 'none',
                    marginTop: '10px'
                }}/>
                <Switch disabled={this.props.disabled} onChange={this.props.changeCallBack ? (value) => {
                    this.props.changeCallBack(this.props.code, value ? 1 : 0);
                } : () => {
                }} checked={this.state.switchDefault == 1 ? true : false}
                        checkedChildren={this.props.switchStrArray[0]}
                        unCheckedChildren={this.props.switchStrArray[1]} style={{
                    display: this.props.type === 'switch' ? 'block' : 'none',
                    marginTop: '16px',
                    width: '30px'
                }}/>
            </div>


        )
    }
}

FormItem.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['input', 'select', 'textarea', 'switch', 'InputNumber']).isRequired,
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    selectData: PropTypes.array,
    placeHolder: PropTypes.string,
    isNotNull: PropTypes.bool,
    changeCallBack: PropTypes.func,//更改数据的回调
    code: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),//更改数据的回调key
    disabled: PropTypes.bool,
    switchStrArray: PropTypes.array,
    numberMin: PropTypes.number,
    numberMax: PropTypes.number,
    categoryType: PropTypes.oneOf(['var', 'rule', 'ruleSet', 'strategy']),
    dataType: PropTypes.string,
    readonly: PropTypes.bool,
    layout: PropTypes.oneOf(['vertical', 'horizontal']),
}
FormItem.defaultProps = {
    placeHolder: '请输入',
    isNotNull: true,
    selectData: [],
    disabled: false,
    switchStrArray: ['是', '否'],
    numberMin: 0,
    numberMax: 2147483647,
    categoryType: '',
    dataType: '',
    readonly: false,
    layout: 'vertical'
}
export default FormItem