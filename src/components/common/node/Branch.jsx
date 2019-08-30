import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, message, Table } from 'antd';
import PropTypes from 'prop-types';
import AddAndSub from '@/components/AddAndSub';
import FieldSelector from '@/components/business/variable/real-time-query/FieldSelector';
import TreePanel from '@/components/condition-tree/TreePanel';
import FormTitle from '@/components/FormTitle';
import FormButtonGroupForProcessTree from '@/components/FormButtonGroupForProcessTree';
import Code from '@/components/Code';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';
import FieldCell from '@/components/common/node/FieldCell';
import DragSortingTableForEditor from '@/components/DragSortingTableForEditor';

@withRouter
@inject('editorStore')
@observer
class Branch extends Component {
    constructor(props) {
        super(props);
        this.checkIsFinish = this.checkIsFinish.bind(this);
        this.dragSortCallBackFunc = this.dragSortCallBackFunc.bind(this);
        this.state = {
            dataSource: []
        }
    }

    componentDidMount() {
        // 做节点排序
        let branch = this.props.editorStore.branch.get_data;
        let branchLinker = [];//下游节点集合
        let uiData = JSON.parse(sessionStorage.def_local_1);//本地的数据
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'linker' && element.from && element.from.id === branch.id) {//找到下游的linker
                    branchLinker.push(element)
                }
            }
        }

        let sort_old = this.props.editorStore.branch.get_data.data.branchNodeVO.sort;
        console.log('sort_old', sort_old)
        console.log('branchLinker', branchLinker)
        let dataSource = [];
        if (!common.isEmpty(sort_old)) {
            sort_old.forEach(element => {
                for (let i = 0; i < branchLinker.length; i++) {
                    const element2 = branchLinker[i];
                    if (!element2.hasOwnProperty('data')) continue
                    if (element !== element2.to.id) continue
                    if (publicUtils.verifyConditionTree(element2.data.conditionVO, false)) {
                        dataSource.push({
                            id: element2.to.id,
                            name: element2.text,
                            expression: element2.data.expression
                        })
                    }
                }
            })
        } else {
            branchLinker.forEach(element2 => {
                if (!element2.hasOwnProperty('data')) return false
                if (publicUtils.verifyConditionTree(element2.data.conditionVO, false)) {
                    dataSource.push({
                        id: element2.to.id,
                        name: element2.text,
                        expression: element2.data.expression
                    })
                }
            })
        }

        this.props.editorStore.branch.updateHelper('dataSource', dataSource);
        console.log('dataSource', dataSource)
        let sort = [];
        dataSource.forEach(element => {
            sort.push(element.id)
        })
        let branchNodeVO = this.props.editorStore.branch.get_data.data.branchNodeVO;
        branchNodeVO.sort = sort;
        this.props.editorStore.branch.updatePropData('branchNodeVO', branchNodeVO)

        this.props.editorStore.sendUiData(this.props.editorStore.branch.get_data, true);
    }
    componentWillReceiveProps(nextProps) {

    }

    checkIsFinish() {
        let rs = true;
        if (common.isEmpty(this.props.editorStore.branch.get_data.data.branchNodeVO.name)) rs = false;
        return rs
    }
    dragSortCallBackFunc(dragIndex, hoverIndex) {
        console.log("dragIndex, hoverIndex", dragIndex, hoverIndex);
        //dataSource排序 start
        let dataSource = common.deepClone(this.props.editorStore.branch.get_helper.dataSource);
        let dataSourceBK = common.deepClone(dataSource);
        dataSourceBK.splice(dragIndex, 1);//删除
        dataSourceBK.splice(hoverIndex, 0, dataSource[dragIndex]);//增加
        this.props.editorStore.branch.updateHelper('dataSource', dataSourceBK);

        // end

        //sort数组排序 start
        let branchNodeVO = this.props.editorStore.branch.get_data.data.branchNodeVO;
        let sort = common.deepClone(branchNodeVO.sort);
        let sortBK = common.deepClone(sort);
        sortBK.splice(dragIndex, 1);//删除
        sortBK.splice(hoverIndex, 0, sort[dragIndex]);//增加
        branchNodeVO.sort = sortBK;
        this.props.editorStore.branch.updatePropData('branchNodeVO', branchNodeVO);
        this.props.editorStore.sendUiData(this.props.editorStore.branch.get_data);
        // end
        console.log("branchMapNew", sortBK)
    }

    render() {

        return (
            <div className="pageContent" style={style.root.style}>
                <p style={style.root.title.style}>基本信息</p>
                <Form>
                    <FormItem name="名称" type="input" isNotNull={true}
                        changeCallBack={(key, value) => {
                            if (!common.isEmpty(value))
                                value = value.substr(0, 30);

                            this.props.editorStore.branch.updateData('title', value);
                            let branchNodeVO = this.props.editorStore.branch.get_data.data.branchNodeVO;
                            branchNodeVO.name = value;
                            this.props.editorStore.branch.updatePropData('branchNodeVO', branchNodeVO);

                            if (this.checkIsFinish()) {
                                this.props.editorStore.branch.updateData('status', '1');
                                this.props.editorStore.sendUiData(this.props.editorStore.branch.get_data);
                            } else {
                                this.props.editorStore.branch.updateData('status', '0');
                                this.props.editorStore.sendUiData(this.props.editorStore.branch.get_data);
                            }

                        }}
                        defaultValue={this.props.editorStore.branch.get_data.title}
                    ></FormItem>
                    <FieldCell name="节点排序" >
                        <DragSortingTableForEditor
                            dataSource={this.props.editorStore.branch.get_helper.dataSource}
                            columns={columns}
                            callBackFunc={this.dragSortCallBackFunc}
                        />
                    </FieldCell>
                </Form>
            </div>
        )
    }
}

Branch.propTypes = {
}
Branch.defaultProps = {
}

export default Branch

const style = {
    root: {
        style: {
            height: '100%', padding: '0', margin: '0', color: 'rgba(0, 0, 0, 0.847058823529412)', height: '30px', lineHeight: '30px'
        },
        title: {
            style: {
                textAlign: 'left',
                backgroundColor: 'rgba(249, 249, 249, 1)',
                borderColor: 'rgba(233, 233, 233, 1)',
                paddingLeft: '12px'
            }
        }
    }
}


const columns = [
    {
        title: '分支名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '表达式',
        dataIndex: 'expression',
        key: 'expression',
    }
]