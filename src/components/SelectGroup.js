import React, { Component } from 'react';
import FieldSelector from '@/components/business/variable/real-time-query/FieldSelector';
import AddAndSub from '@/components/AddAndSub';
import PropTypes from 'prop-types';

const selectData = [
    { code: 'A', value: 'A' },
    { code: 'B', value: 'B' },
    { code: 'C', value: 'C' }
]

class SelectGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldSelector: [],
            fieldSelectorValue: [],
            index: 0
        }
        this.sub = this.sub.bind(this);
        this.add = this.add.bind(this);
    }
    /**
         * 删除操作回调
         */
    sub = () => {
        let tempArray = this.state.fieldSelector;
        let tempArray2 = this.state.fieldSelectorValue;
        tempArray.pop();
        tempArray2.pop();
        this.props.selectGroupAddAndSubCallBack('sub', this.props.resultName);
        this.setState({
            fieldSelector: tempArray,
            fieldSelectorValue: tempArray2
        })
    }

    /**
     * 增加操作回调
     */
    add = () => {
        let tempArray = this.state.fieldSelector;
        let tempArray2 = this.state.fieldSelectorValue;
        tempArray.push({
            name: tempArray.length === 0 ? this.props.firstTitle : this.props.secondTitle,
            selectData: this.props.selectData
        });
        if (this.props.resultName === 'orderFields'){
            tempArray2.push({field: '', order: 'asc'});
        }else {
            tempArray2.push('');
        }
       
        this.props.selectGroupAddAndSubCallBack('add', this.props.resultName);
        this.setState({
            fieldSelector: tempArray,
            fieldSelectorValue: tempArray2
        })
    }

    change = () => {

    }

    componentWillReceiveProps(nextProps) {
        console.log("nextProps.valueList", nextProps.valueList);
        let tempArray = [];
        let tempArray2 = [];
        for (let i = 0; i < nextProps.valueList.length; i++) {
            const element = nextProps.valueList[i];
            tempArray.push(element);
            tempArray2.push({
                name: this.state.fieldSelector.length === 0 ? nextProps.firstTitle :nextProps.secondTitle,
                selectData: this.props.selectData
            });
        }
        this.setState({
            fieldSelectorValue: tempArray,
        })

        console.log(tempArray);

        this.setState({
            fieldSelector: tempArray2
        })
    }

    render() {
        return (
            <div style={{ display: 'flow-root' }}>
                {this.state.fieldSelector.map((item, i) =>
                    <FieldSelector resultName={this.props.resultName} value={this.state.fieldSelectorValue[i]} index={i} name={item.name} selectData={item.selectData} selectGroupChange={this.props.selectGroupChange} resultName={this.props.resultName}></FieldSelector>
                )}
                <div style={{ marginTop: '10px', float: 'left' }}>
                    {this.state.fieldSelector.length > 0 ? <AddAndSub type="add-sub" sub={this.sub} add={this.add} />
                        :
                        <AddAndSub type="add" add={this.add} />

                    }
                </div>
            </div>
        )
    }
}
SelectGroup.propTypes = {
    selectData: PropTypes.array,
    style: PropTypes.object,
    selectGroupChange: PropTypes.func,
    resultName: PropTypes.string,
    selectGroupAddAndSubCallBack: PropTypes.func,
    valueList: PropTypes.array,
    firstTitle: PropTypes.string,
    secondTitle: PropTypes.string
}
SelectGroup.defaultProps = {
    selectData: [{ code: 'all', value: '所有' }],
    style: {},
    selectGroupChange: () => { },
    resultName: '',
    selectGroupAddAndSubCallBack: () => { },
    valueList: [],
    firstTitle: '按',
    secondTitle: '和'
}

export default SelectGroup;