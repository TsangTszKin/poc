import React from 'react';
import {observer, Provider} from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import PageHeader from '@/components/PageHeader';
import store from '@/store/system/config2/tableStructure/Save';
import eventSourceService from '@/api/system/eventSourceService';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import FormBlock from '@/components/FormBlock';
import FormTitle from '@/components/FormTitle';
import commonService from "@/api/business/commonService";
import {Table, Select, InputNumber, Input, Modal, Button, Icon, Switch, Upload} from 'antd';
import FormButtonGroup from '@/components/FormButtonGroup';
import {withRouter} from 'react-router-dom';
import {message} from "antd/lib/index";
import dimensionService from '@/api/system/config2/dimensionService';
import {inject} from "mobx-react/index";
import tablesService from '@/api/system/config2/tablesService';

const typeData = [
    {code: 1, value: 'RTD'},
    {code: 2, value: 'My SQL'}
]

@withRouter
@inject('GlobalStore')
@observer
class Save extends React.Component {
    constructor(props) {
        super(props);
        this.getDimensionList = this.getDimensionList.bind(this);
        this.verify = this.verify.bind(this);
        this.saveForApi = this.saveForApi.bind(this);
        this.init = this.init.bind(this);
        this.state = {
            dimensionNameList: [],
            importZIP: false,
            info: {},
        }
    }


    verify() {
        let data = common.deepClone(store.details.getData);
        if (common.isEmpty(store.details.getData.name)) {
            message.warning('基本信息 -表名称 不能为空');
            return
        }
        if (!store.details.getData.code) {
            message.warning('基本信息 - 标识 不能为空');
            return
        }
        if (common.isEmpty(store.details.getData.dateBaseType)) {
            message.warning('基本信息 -请选择类型');
            return
        }
        if (store.details.getData.isPartition === 1 && common.isEmpty(store.details.getData.dimensionName)) {
            message.warning('字段信息 - 请选择维度');
            return
        }
        if (store.details.getData.dateBaseType == '') {
            data.dateBaseType = 2;
            store.details.setData(data);
        }
        if (store.details.getData.dateBaseType == 1) {
            if (common.isEmpty(store.details.getData.isPartition)) {
                data.isPartition = 0;
                store.details.setData(data);
            }
        }
        if (store.details.getData.dateBaseType == 2) {
            data.isPartition = 0;
            data.partitionKey = '';
            store.details.setData(data);
        }
        if (store.details.getData.isPartition == 0) {
            data.dimensionCode = '';
            data.dimensionName = '';
            data.dimensionId = '';
            store.details.setData(data);
        }
        if (common.isEmpty(store.details.getData.type)) {
            data.type = "TABLE";
            store.details.setData(data);
        }
        for (let i = 0; i < store.table.rtdTable.getData.length; i++) {
            const element = store.table.rtdTable.getData[i];
            if (common.isEmpty(element.name)) {
                message.warning('字段信息 - 名称 不能为空');
                return
            }
            if (common.isEmpty(element.code)) {
                message.warning('字段信息 - 标识 不能为空');
                return
            }
            if (common.isEmpty(element.type)) {
                message.warning('字段信息 - 类型 不能为空');
                return
            }
            if (!isNaN(element.name)) {
                message.warning('字段信息 - 名称 不能为纯数字');
                return
            }
            if (!isNaN(element.code)) {
                message.warning('字段信息 - 标识 不能是纯数字且不能有中文和特殊符号！');
                return
            }
            if (!isNaN(element.code.substr(0,1))) {
                message.warning('字段信息 - 标识 不能是纯数字或特殊符号开头！');
                return
            }
            if (store.details.getData.isPartition == 1) {
                if (!common.isEmpty(element.flagPartitionKey)) {
                    if (element.flagPartitionKey == true) {
                        if (element.type !== 12) {
                            message.warning('字段信息 - 类型     已勾选为分区字段，该行类型必须为字符串！');
                            return
                        }
                        if (element.isNull == 1) {
                            message.warning('字段信息 - 可为空   已勾选为分区字段，该行不能勾选“可为空”！');
                            return
                        }
                        data.partitionKey = element.code;
                        store.details.setData(data);
                    }
                }
            }
        }

        if (store.details.getData.isPartition == 1) {
            if (common.isEmpty(store.details.getData.partitionKey)) {
                message.warning('分区信息 - 请选择分区字段');
                return
            }
        }
        /*  if (!common.isEmpty(store.details.getData.partitionKey)) {
              let tempArray = [];
              let partitionKey = store.details.getData.partitionKey;
              store.getPKData.forEach(element => {
                  tempArray.push({
                      code: element.code,
                  })
              });
              let flag = false;
              console.log("tempArray", tempArray)
              console.log("partitionKey", partitionKey)
              for (let i = 0; i < tempArray.length; i++) {
                  if (partitionKey === (tempArray[i].code)) {
                      flag = true;
                  }
              }
              if (!flag) {
                  message.warning('分区信息 - 选择的分区字段不存在或不是主键，请重新选择');
                  return
              }
          }*/
        console.log("store.details.getData", store.details.getData);
        console.log("store.table.rtdTable.getData", store.table.rtdTable.getData);
        this.saveForApi();
    }

    saveForApi() {
        let data = store.details.getData;
        data.rtdTableColumnEntities = store.table.rtdTable.getData;
        common.loading.show();
        tablesService.saveTables(data).then(store.saveForApiCallBack).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            // this.init();
            this.props.history.push(`/system/config2/tableStructure/save/${res.data.result.id}`);
        }).catch(() => common.loading.hide())
    }


    componentDidMount() {
        this.init();
    }

    init() {
        store.initTable();
        store.id = this.props.match.params.id;
        if (!common.isEmpty(this.props.match.params.id)) {
            window.document.querySelector("#event-source-details .pageContent").style.height = 'auto';
            store.id = this.props.match.params.id;
        } else {
            store.id = ''
            // todo
        }
        store.getDataTypeList();
        this.getDimensionList();
    }

    updateSaveData(key, value) {
        console.log(`${key}=${value}`);
        if (key === 'code') {
            value = value.replace(/[^\w_]/g, '');
        }
        let data = common.deepClone(store.details.getData);
        let rtdTableData = common.deepClone(store.table.rtdTable.getData);
        if (key === 'name' && value !== '') {
            if (isNaN(value)) {
                data[key] = value;
            } else {
                message.warn("基本信息-表名称不能是纯数字")
            }
        } else if (key === 'code' && value !== '') {
            if (isNaN(value)) {
                data[key] = value;
            } else {
                message.warn("基本信息-标识不能是纯数字")
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
        if (key == "isPartition" && value == 0) {
            data.partitionKey = '';
            data.dimensionCode = '';
            data.dimensionName = '';
            data.dimensionId = '';
            rtdTableData.forEach(element => {
                element.flagPartitionKey = false;
            });
        }
        store.details.setData(data);
        store.table.rtdTable.setDataSource(store.renderTable(rtdTableData));
    }

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
                    dimensionId: element.rtdDimensionId,
                    value: element.name,
                    code: `${element.rtdDimensionId}·-·${element.code}·-·${element.name}`
                });
            })
            this.setState({
                dimensionNameList: tempArray
            })
        })
    }

    handleFileChange = info => {
        console.log("handleFileChange", info);
        this.setState({
            info: info
        });
        let {file, fileList} = info;
        const status = file.status;
        if (['error', 'removed'].includes(status)) {
            this.setState({
                fieldJson: '',
                fileList: [],
            });
        } else this.setState({fileList: [file]});
    };

    render() {
        const supportFileTypeText = '支持扩展名：.xls';
        const _this = this;
        const uploadProps = {
            accept: '.xls',
            fileList: this.state.fileList,
            onChange: (info) => this.handleFileChange(info),
            onSuccess(res, file) {
                if (!publicUtils.isOk(res)) return;
                console.log('onSuccess', res, file);
                _this.setState({fieldJson: res.data.result});
                _this.setState({fileList: [file]});
            },
            onProgress({percent}, file) {
                console.log('onProgress', `${percent}%`, file.name);
            },
            customRequest({
                              file,
                              filename,
                              onSuccess,
                          }) {
                const formData = new FormData();
                formData.append(filename, file);
                let tableEntity = store.details.getData;
                tableEntity.rtdTableColumnEntities = store.table.rtdTable.getData;
                let a = JSON.stringify(tableEntity)
                tablesService.upload(formData,a).then(res => {
                    if (!publicUtils.isOk(res)) {
                        message.success('上传失败');
                        _this.setState({importZIP: false})
                        return;
                    } else {
                        console.log("上传的数据：", res)
                        onSuccess(res, file);
                        message.success('上传成功');
                        store.uploadDetails.setData(res)
                        _this.setState({importZIP: false})
                        store.getDetailsByUpload()
                    }
                });

                return {
                    abort() {
                        console.log('upload progress is aborted.');
                    },
                };
            },
        };
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
                    />
                    <div className="pageContent" style={{padding: '24px 0px'}}>
                        {/*<FormHeader title="库表定义" style={{ marginLeft: '24px' }}></FormHeader>*/}
                        <FormBlock header="基本信息">
                            <Form>
                                <FormItem name="表名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData}
                                          code="name" defaultValue={store.details.getData.name}/>
                                <FormItem name="标识" type="input"
                                          disabled={store.details.getData.id != null ? true : false} isNotNull={true}
                                          changeCallBack={this.updateSaveData} code="code"
                                          defaultValue={store.details.getData.code}/>
                                {/* <FormItem name="类型" type="select" isNotNull={true} changeCallBack={this.updateSaveData}
                                          code="dateBaseType"
                                          defaultValue={store.details.getData.dateBaseType}
                                          selectData={typeData}/>*/}
                                {
                                    store.details.getData.isPartition === 1 ?
                                        <FormItem name="维度" type="select" isNotNull={true} changeCallBack={
                                            (key, value) => {
                                                let dimensionId = value.split('·-·')[0];
                                                let code = value.split('·-·')[1];
                                                let name = value.split('·-·')[2];
                                                // this.updateSaveData('code', code);
                                                this.updateSaveData('dimensionCode', code);
                                                this.updateSaveData('dimensionName', name);
                                                this.updateSaveData('dimensionId', dimensionId);
                                            }
                                        } code="dimensionCode" defaultValue={store.details.getData.dimensionName}
                                                  selectData={this.state.dimensionNameList}/>
                                        : ""
                                }
                                {
                                    store.details.getData.dateBaseType === 1 ?
                                        <FormItem name="是否分区表" type="switch" isNotNull={false}
                                                  changeCallBack={this.updateSaveData} code="isPartition"
                                                  defaultValue={store.details.getData.isPartition}/>
                                        : ""
                                }
                            </Form>
                        </FormBlock>
                        <FormBlock header="字段信息">
                            {/*<Table dataSource={store.table.rtdTable.getDataSource} columns={store.table.rtdTable.getColumns} pagination={false} />
                            */}
                            <div>
                                <Button style={{
                                    /*display: common.isEmpty(this.props.match.params.id) ? "block" : "none",*/
                                    marginBottom: "20px",
                                    marginTop: "-15px"
                                }} onClick={() => this.setState({importZIP: true})}>上传字段信息
                                </Button>
                            </div>
                            <Table dataSource={store.table.rtdTable.getDataSource}
                                   columns={store.table.rtdTable.getColumns} style={{width: '100%', overflowX: 'auto'}}
                                   pagination={false}/>
                            <Button type="dashed" block style={{marginTop: '10px'}} onClick={store.addTempVar}><Icon
                                type="plus" theme="outlined"/>添加字段</Button>
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
                        publicUtils.isAuth("system:eventSource:edit") ?
                            <FormButtonGroup
                                cancelCallBack={() => this.props.history.push('/system/config2/tableStructure')}
                                saveCallBack={() => {
                                    this.verify()
                                }}
                            />

                            : ''
                    }

                    <Modal
                        title="导入字段信息"
                        visible={this.state.importZIP}
                        width={500}
                        footer={null}
                        onCancel={() => {
                            this.setState({importZIP: false});
                        }}
                    >
                        <div style={{marginBottom: 20, marginTop: 10}}>
                            <Upload.Dragger
                                {...uploadProps}
                            >
                                <p className="ant-upload-drag-icon"><Icon type="inbox"/></p>
                                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                                <p className="ant-upload-hint">{supportFileTypeText}</p>
                            </Upload.Dragger>
                        </div>
                    </Modal>

                </div>
            </Provider>
        )
    }
}

export default Save