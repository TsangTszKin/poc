import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Drawer, Table } from "antd";
import common from "@/utils/common";
import FixedValue from "@/components/condition-tree/FixedValue";
import commonService from "@/api/business/commonService";
import publicUtils from "@/utils/publicUtils";

const testInputColumns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',

    },
    {
        title: '标识',
        dataIndex: 'code',
        key: 'code',

    },
    {
        title: '值',
        dataIndex: 'value',
        key: 'value',

    }
];
const testOutputColumns = [
    {
        title: '名称',
        dataIndex: 'resultName',
        key: 'resultName',

    },
    {
        title: '值',
        dataIndex: 'resultValue',
        key: 'resultValue',
    }
];

class TestButton extends Component {
    state = {
        isShowTest: false,
        canTest: false,
        testInput: [],
        testOutput: [],
        inputValueList: [],
        inputResponseData: [],
    };

    formatDateValueForFixedValue = (value, dataType) => {
        if (!common.isEmpty(value)) {
            if (dataType === 93) {
                value = value.split(' 00:00:00')[0];
            }
            return value;
        } else {
            return value;
        }
    };

    inputValueChange = (index, value, dataType) => {
        console.log(index, value, dataType);
        let inputValueList = common.deepClone(this.state.inputValueList);
        inputValueList[index] = value;
        console.log(inputValueList);
        this.setState({
            inputValueList,
            canTest: true,
        });
        for (let i = 0; i < this.state.inputValueList.length; i++) {
            const element = inputValueList[i];
            if (this.state.inputResponseData[i].dataType !== 12) {
                if (common.isEmpty(element)) {
                    this.setState({
                        canTest: false,
                    });
                }
            }
        }
        let tempArray = [];
        for (let i = 0; i < this.state.inputResponseData.length; i++) {
            const element = this.state.inputResponseData[i];
            tempArray.push({
                key: i,
                name: element.name,
                code: element.code,
                value: <FixedValue
                    type="defaultValue"
                    style={ { width: '200px' } }
                    value={ this.formatDateValueForFixedValue(inputValueList[i], element.dataType) }
                    dataType={ element.dataType }
                    changeData={ (name, value) => {
                        // console.log("name, value", name, value);
                        this.inputValueChange(i, value, element.dataType);
                    } }
                    index={ i }
                />

            });
        }
        this.setState({
            testInput: tempArray
        });
    };

    renderTestInput = () => {
        console.log(1234);
        const { inspectVarSet } = this.props;
        if (!inspectVarSet) return;
        this.setState({
            inputResponseData: inspectVarSet
        });
        const testInput = inspectVarSet.map((item, i) => ({
            key: i,
            name: item.name,
            code: item.code,
            value: <FixedValue
                type="defaultValue"
                style={ { width: '200px' } }
                value={ this.formatDateValueForFixedValue(this.state.inputValueList[i], item.dataType) }
                dataType={ item.dataType }
                changeData={ (name, value) => this.inputValueChange(i, value, item.dataType) }
                index={ i }
            />
        }));
        let inputValueList = new Array(inspectVarSet.length).fill('');
        console.log('testInput', testInput);
        console.log('inputValueList', inputValueList);
        this.setState({
            testInput,
            isShowTest: true,
            inputValueList
        });
    };

    getTestOutput = () => {
        const { testParams } = this.props;
        if (!testParams.inspectCodeMap) testParams.inspectCodeMap = {};
        for (let i = 0; i < this.state.testInput.length; i++) {
            const element = this.state.testInput[i];
            testParams.inspectCodeMap[element.code] = this.state.inputValueList[i];
        }
        common.loading.show();
        commonService.getTestOutput(testParams).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return;
            console.log(res.data);
            this.setState({
                testOutput: res.data.result
            });
        });
    };

    render() {
        const { className } = this.props;
        console.log('this.state.isShowTest', this.state.isShowTest);
        return <Fragment>
            <div className={ className } onClick={ this.renderTestInput }>
                <icon className="iconfont iconcelveceshi" title="测试"/>
                <span>测试</span>
            </div>
            <Drawer
                title="测试"
                placement="right"
                closable={ true }
                onClose={ () => {
                    this.setState({ isShowTest: false });
                } }
                visible={ this.state.isShowTest }
                width="720"
                destroyOnClose={ true }
            >
                <p style={ {
                    font: 'Microsoft Tai Le',
                    fontSize: '16px',
                    margin: '0',
                    height: '58px',
                    lineHeight: '58px',
                    color: '#000',
                    opacity: '0.85'
                } }>输入</p>
                <Table columns={ testInputColumns } dataSource={ this.state.testInput } pagination={ false }/>

                <p style={ {
                    font: 'Microsoft Tai Le',
                    fontSize: '16px',
                    margin: '0',
                    height: '58px',
                    lineHeight: '58px',
                    color: '#000',
                    opacity: '0.85',
                    marginTop: '70px'
                } }>输出</p>
                <Table columns={ testOutputColumns } dataSource={ this.state.testOutput } pagination={ false }/>

                <Button type="primary" style={ { position: 'fixed', right: '20px', bottom: '20px', zIndex: '1' } }
                        onClick={ this.getTestOutput }
                >测试</Button>
            </Drawer>
        </Fragment>;
    }
}

TestButton.propTypes = {
    testParams: PropTypes.object.isRequired,
    inspectVarSet: PropTypes.array.isRequired,
    className: PropTypes.string,
};

TestButton.propTypes = {
    testParams: {},
    inspectVarSet: [],
    className: ''
};

export default TestButton;
