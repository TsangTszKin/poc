import React from 'react';
import {observer, Provider} from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import PageHeader from '@/components/PageHeader';
import store from '@/store/system/config2/tableStructure//Detail';
import eventSourceService from '@/api/system/eventSourceService';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import FormBlock from '@/components/FormBlock';
import FormTitle from '@/components/FormTitle';
import {Table, Row, Select, Col, InputNumber, Input, Modal, Button, Icon, Switch} from 'antd';
import FormButtonGroup from '@/components/business/variable/batch/FormButtonGroup';
import {withRouter} from 'react-router-dom';
import {message} from "antd/lib/index";
import dimensionService from '@/api/system/config2/dimensionService';
import {inject} from "mobx-react/index";
import strategyService from "@/api/business/strategyService";
import tablesService from "../../../../api/system/config2/tablesService";

const typeData = [
    {code: 1, value: 'RTD'},
    {code: 2, value: 'My SQL'}
]

@withRouter
@inject('GlobalStore')
@observer
class Details extends React.Component {
    constructor(props) {
        super(props);
        this.getDimensionList = this.getDimensionList.bind(this);
        this.state = {
            dimensionNameList: [],
        }
    }

    componentDidMount() {
        store.id = this.props.match.params.id;
        if (!common.isEmpty(this.props.match.params.id)) {
            window.document.querySelector("#event-source-details .pageContent").style.height = 'auto';
            store.id = this.props.match.params.id;
        } else {
            store.id = ''
            // todo
        }
        store.getDetailsForApi();
        this.getDimensionList();
    }

    updateSaveData(key, value) {
        console.log(`${key}=${value}`);
        if (key === 'code') {
            value = value.replace(/[^\w_]/g, '');
        }
        let data = common.deepClone(store.details.getData);
        if (key === 'name' && value !== '') {
            if (isNaN(value)) {
                data[key] = value;
            } else {
                message.warn("库表定义-库名称不能是纯数字")
            }
        } else if (key === 'code' && value !== '') {
            if (isNaN(value)) {
                data[key] = value;
            } else {
                message.warn("库表定义-编号不能是纯数字")
            }
        } else {
            data[key] = value;
            console.log("data", data)
        }
        if (key == 'type' && value == 2) {
            if (!common.isEmpty(data.isPartition)) {
                data.isPartition = 0;
            }
        }
        store.details.setData(data);
    }

    downloadTemplate = () => {
        tablesService.download(store.details.data.id).then(res => {
            common.loading.hide();
            const type = 'xls'
            const blob = new Blob([res.data], {type: type})
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', store.details.data.name+".xls");
            document.body.appendChild(link);
            link.click();
            message.success('下载成功');
        });
    };

    componentWillUpdate(nextProps) {
        if (this.props.match.params.id != nextProps.match.params.id) {
            this.getDataTypeList();
        }
    }


    getDimensionList() {
        dimensionService.getDimensionNameList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    dimensionId: element.id,
                    value: element.name,
                    code: `${element.id}·-·${element.code}`
                });
            })
            this.setState({
                dimensionNameList: tempArray
            })
        })
    }

    render() {
        console.log("store.details.getData.dateBaseType", store.details.getData.dateBaseType)
        return (
            <Provider store={store}>
                <div className='panel' id="event-source-details">
                    <PageHeader
                        meta={this.props.meta}
                        isShowBtns={false}
                        isShowSelect={false}
                        auth={{
                            test: false,
                            sql: false,
                            version: false,
                        }}
                    ></PageHeader>
                    <div className="pageContent" style={{padding: '24px 0px'}}>
                        {/* <FormHeader title="库表定义" style={{marginLeft: '24px'}}></FormHeader>*/}
                        <FormBlock header="基本信息">
                            <Row>
                                <Col span={6}>
                                    <p>表名称：{store.details.getData.name}</p>
                                </Col>
                                <Col span={6}>
                                    <p>标识：{store.details.getData.code}</p>
                                </Col>
                                <Col span={6}>
                                    <p>维度：{store.details.getData.dimensionCode}</p>
                                </Col>
                                {/*<Col span={6}>
                                    <p>类型：{store.details.getData.dateBaseType == 0 ? 'My SQL' : 'RTD'}</p>
                                </Col>*/}
                            </Row>
                            <Row style={{top: '15px'}}>
                                <Col span={6}>
                                    <p>是否区分表：{store.details.getData.isPartition == 1 ? '是' : '否'}</p>
                                </Col>
                            </Row>
                        </FormBlock>
                        <FormBlock header="字段信息">
                            <div>
                                <Button style={{marginBottom: "20px", marginTop: "-15px"}}
                                        onClick={() => this.downloadTemplate()}>下载字段信息
                                </Button>
                            </div>

                            {/*<Table dataSource={store.table.rtdTable.getDataSource} columns={store.table.rtdTable.getColumns} pagination={false} />
                            */}
                            <Table
                                editable={false}
                                dataSource={store.table.rtdTable.getDataSource}
                                columns={store.table.rtdTable.getColumns}/>
                        </FormBlock>
                        {/* <FormBlock header="分区信息">
                            {(store.details.getData.isPartition === 1 && store.details.getData.dateBaseType === 1) ?
                                <FormItem name="分区字段" type="select" isNotNull={false}
                                          changeCallBack={this.updateSaveData} code="partitionKey"
                                          defaultValue={store.details.getData.partitionKey}
                                          selectData={store.getPKData}></FormItem>
                                : ""
                            }
                        </FormBlock>*/}
                    </div>

                    {
                        publicUtils.isAuth("system:tableStructure:detail") ?
                            <FormButtonGroup
                                cancelCallBack={() => this.props.history.push('/system/config2/tableStructure')}
                            />
                            : ''
                    }
                </div>
            </Provider>
        )
    }
}

export default Details