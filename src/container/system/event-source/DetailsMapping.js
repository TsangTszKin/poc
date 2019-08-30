/*
 * @Author: zengzijian
 * @Date: 2019-05-17 12:08:33
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:39:02
 * @Description: 
 */
import React from 'react';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import PageHeader from '@/components/PageHeader';
import store from '@/store/system/event-source/DetailsMapping';
import eventSourceService from '@/api/system/eventSourceService';
import FormBlock from '@/components/FormBlock';
import { Table, Modal, Button, Icon } from 'antd';
import FormButtonGroupForEventSourceMapping from '@/components/FormButtonGroupForEventSourceMapping';
import { withRouter } from 'react-router-dom';
import { message } from "antd/lib/index";
import { inject } from "mobx-react/index";

@withRouter
@inject('GlobalStore')
@observer
class DetailsMapping extends React.Component {
    constructor(props) {
        super(props);
        this.verify = this.verify.bind(this);
        this.saveMappingForApi = this.saveMappingForApi.bind(this);
    }

    componentDidMount() {
        store.table.dimensionMapping.init();
        store.id = this.props.match.params.id;
        if (!common.isEmpty(this.props.match.params.id)) {
            window.document.querySelector("#event-source-details .pageContent").style.height = 'auto';
            store.id = this.props.match.params.id;
            store.getDimensionListForApi(this.props.match.params.id);
        } else {
            store.id = ''
            // todo
            // store.initTable();
            store.getDimensionListForApi();
        }

    }

    updateSaveData(key, value) {
        console.log(`${key}=${value}`);
        let data = common.deepClone(store.details.getData);
        data[key] = value;
        store.details.setData(data);
    }


    verify() {
        console.log("verify", store.table.dimensionMapping.getData)
        for (let i = 0; i < store.table.dimensionMapping.getData.length; i++) {
            const element = store.table.dimensionMapping.getData[i];
            if (common.isEmpty(element.dimensionName)) {
                message.warning('维度映射 - 维度名称 不能为空');
                return
            }
            if (common.isEmpty(element.eventPartitionKey)) {
                message.warning('维度映射 - 维度主键 不能为空');
                return
            }
            if (element.mode === 0) {
                if (common.isEmpty(element.eventTimeKey)) {
                    message.warning('维度映射 - 维度时间 不能为空');
                    return
                }
                if (common.isEmpty(element.tableName)) {
                    message.warning('维度映射 - 维度入库表 不能为空');
                    return
                }
                if (common.isEmpty(element.eventDbMapping)) {
                    message.warning('维度映射 - 字段映射未填写完整');
                    return
                }
                if (!common.isEmpty(element.eventDbMapping)) {
                    let eventDbMappingData = JSON.parse(element.eventDbMapping);
                    for (let i = 0; i < eventDbMappingData.eventFieldMappings.length; i++) {
                        console.log("eventDbMappingData.eventFieldMappings", eventDbMappingData.eventFieldMappings)
                        if (common.isEmpty(eventDbMappingData.eventFieldMappings[i].column) && eventDbMappingData.eventFieldMappings[i].isDateTime) {
                            message.warning('维度映射 - 数据库列名必填项不能为空');
                            return
                        }
                    }
                }
            }
        }
        console.log("verify2", store.table.dimensionMapping.getData)
        if (store.vosRepeatVerify(true) && store.mappingRepeatVerify(true)) {
            this.saveMappingForApi();
        }
    }

    saveMappingForApi() {
        let data = common.deepClone(store.table.dimensionMapping.getData);
        data.eventSourceId = store.id;
        store.table.dimensionMapping.setData(data);
        data.forEach(element => {
            delete element.columns;
            delete element.tables;
            let eventDbMapping = element.eventDbMapping;
            if (!common.isEmpty(eventDbMapping)) {
                eventDbMapping = JSON.parse(eventDbMapping);
                let eventFieldMappings = eventDbMapping.eventFieldMappings;
                if (!common.isEmpty(eventFieldMappings)) {
                    eventFieldMappings.forEach(element2 => {
                        delete element2.columns;
                    });
                }
            }
            element.eventDbMapping = JSON.stringify(eventDbMapping)
        });
        console.log("data", data);
        common.loading.show();
        eventSourceService.saveMapping(store.id, data).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            this.props.history.push(`/system/config2/eventSource/eventSourceDetailsMapping/${store.id}`);
            store.getDimensionListForApi(store.id);
        }).catch(() => common.loading.hide())
    }

    render() {
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
                    <div className="pageContent" style={{ padding: '24px 0px' }}>
                        <FormBlock header="维度映射">
                            <Table dataSource={store.table.dimensionMapping.getDataSource}
                                columns={store.table.dimensionMapping.getColumns} pagination={false} />
                            <Button type="dashed" block style={{ marginTop: '10px' }} onClick={store.addOneRow}><Icon
                                type="plus" theme="outlined" />添加维度映射</Button>
                        </FormBlock>
                    </div>

                    {
                        publicUtils.isAuth("system:eventSource:edit") ?
                            <FormButtonGroupForEventSourceMapping
                                cancelCallBack={() => {
                                    this.props.history.push(`/system/config2/eventSource`);
                                    /*this.props.history.push(`/system/config2/eventSource/eventSourceDetails/${this.props.match.params.id}`);*/
                                }}
                                saveCallBack={() => {
                                    this.verify();
                                    /*this.props.history.push(`/system/eventSource`);*/
                                }}
                            />

                            : ''
                    }
                    <Modal
                        title="字段映射（数据库列名不可重复选择）"
                        visible={store.modal.isShow}
                        /*onOk={() => {
                            store.modal.hide();
                            console.log("store.table.dimensionMapping.getData", store.table.dimensionMapping.getData);
                            // }
                        }}*/
                        onOk={() => {
                            if (store.mappingRepeatVerify(true)) {
                                store.modal.hide();
                            }
                        }}
                        onCancel={() => {
                            store.modal.hide();
                            store.mappingTablesColsBackUp()
                        }
                        }
                        width="500px"
                    >
                        <Table columns={store.table.modal.getColumns} dataSource={store.table.modal.getDataSource}
                            pagination={false} scroll={{ x: 300, y: 400 }} />
                    </Modal>
                </div>
            </Provider>
        )
    }
}

export default DetailsMapping