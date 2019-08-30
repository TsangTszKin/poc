/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:15:19
 * @Description: 
 */
import React, {Component} from 'react';
import {Provider, observer} from 'mobx-react';
import store from '@/store/business/strategy/strategy/Index';
import WebSocketStore from '@/store/WebSocketStore';
import PageHeader from '@/components/PageHeader';
import {Table, Select, Spin, message, Modal, Button, Row, Col, Input, Radio, Icon, Dropdown, Menu, Upload} from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar2';
import PageToolBar2 from '@/components/PageToolBar3';
import strategyService from '@/api/business/strategyService';
import {withRouter} from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import UseTimes from '@/components/business/UseTimes';
import commonService from '@/api/business/commonService';
import DragSortingTableHaveStore from '@/components/DragSortingTableHaveStore';
import '@/styles/business/rule-set/index.less'
import variableService from '@/api/business/variableService';
import MultiControl from "@/components/common/MultiControl";

@withRouter
@observer
class Definition extends Component {
    constructor(props) {
        super(props);
        this.state = {selectData: []}
        this.changePage = this.changePage.bind(this);
        this.multiDelete = this.multiDelete.bind(this);
        this.multiOffline = this.multiOffline.bind(this);
        this.multiOnline = this.multiOnline.bind(this);
        this.dragSortCallBackFunc = this.dragSortCallBackFunc.bind(this);
        this.getEventSourceSelectList = this.getEventSourceSelectList.bind(this);
        this.verifyTemplate = this.verifyTemplate.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    componentDidMount() {
        this.getEventSourceSelectList();
        store.initParams();
        store.getDataSourceForApi();
        window.onbeforeunload = function () {
            return ''
        }
        // eslint-disable-next-line no-undef
        let ticket = hex_md5(String(Math.random()));
        // let ticket = common.getGuid()
        sessionStorage.ticket = ticket;
        WebSocketStore.init(ticket);
        // WebSocketStore.init(localStorage.token);

        // window.addEventListener('beforeunload', function (event) { event.returnValue = "要离开吗？" }, true);
    }


    componentWillUnmount() {
        // WebSocketStore.close();
    }


    multiDelete() {
        var ids = [];
        for (let i = 0; i < store.responseData.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i && store.responseData[i].status !== 4) {
                    let row = common.deepClone(store.responseData[i]);
                    ids.push(row.code);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }

        common.loading.show();
        strategyService.changeStrategyStatus(ids, 'delete').then(res => {
            common.loading.hide();
            store.getDataSourceForApi();
            if (!publicUtils.isOk(res)) return
            message.success(res.data.resultMessage);
        }).catch(() => {
            common.loading.hide();
        })
    }

    multiOnline() {
        //做基本筛选
        var ids = [];
        var dataSource = [];
        let selectedDataSource = [];
        for (let i = 0; i < store.getDataSource.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];

                if (element === i && store.getDataSource[i].statusNumber === 1) {
                    ids.push(store.getDataSource[i].id);
                    selectedDataSource.push(store.getDataSource[i]);
                    dataSource.push(store.getDataSource[i]);
                }
            }
        }
        let eventSourceId;
        for (let i = 0; i < selectedDataSource.length; i++) {
            const element = selectedDataSource[i];
            if (i === 0) {
                eventSourceId = element.eventSourceId;
            } else {
                if (element.eventSourceId !== eventSourceId) {
                    message.warning("请选择在同一个事件源下的策略上线");
                    return;
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }

        //mobx处理
        store.tableFields.setDataSource(store.tableFields.renderTable(dataSource));
        store.modal.tableFields.setIsShow(true);
        store.modal.tableFields.setTitle("批量上线");
        let selectedRowKeys = [];
        for (let i = 0; i < dataSource.length; i++) {
            selectedRowKeys.push(i);
        }
        store.tableFields.setSelectedRowKeys(selectedRowKeys)

    }

    verifyTemplate() {
        if (common.isEmpty(store.templateVO.getData.name)) {
            message.warn('请输入名称');
            return false
        }
       /* if (common.isEmpty(store.templateVO.getData.description)) {
            message.warn('请输入描述');
            return false
        }*/
        return true
    }

    multiOffline() {
        var ids = [];
        var dataSource = [];
        for (let i = 0; i < store.getDataSource.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i && store.getDataSource[i].statusNumber === 4) {
                    ids.push(store.getDataSource[i].id);
                    dataSource.push(store.getDataSource[i]);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        common.loading.show();
        strategyService.changeStrategyStatus(ids, "offline").then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            store.getDataSourceForApi();
            store.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        });


        // //mobx处理
        // store.tableFields.setDataSource(store.tableFields.renderTable(dataSource));
        // store.modal.tableFields.setIsShow(true);
        // store.modal.tableFields.setTitle("批量下线");
        // let selectedRowKeys = [];
        // for (let i = 0; i < dataSource.length; i++) {
        //     selectedRowKeys.push(i);
        // }
        // store.tableFields.setSelectedRowKeys(selectedRowKeys)

    }


    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.setPageNum(pageNum);
        store.setPageSize(pageSize);
        store.getDataSourceForApi();
    }

    getEventSourceSelectList() {
        var self = this;
        variableService.getEventSourceSelectList(false).then(res => {
            if (!publicUtils.isOk(res)) return
            let dataList = [{code: '', value: '所有'}];
            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                let data = {};
                data.value = element.eventSourceName;
                data.code = element.eventSourceId;
                dataList.push(data);
            }
            self.setState({
                selectData: dataList
            });
        });
    }

    dragSortCallBackFunc(dragIndex, hoverIndex) {
        console.log("dragIndex, hoverIndex", dragIndex, hoverIndex)
        store.tableFields.dragSortCallBackFunc(dragIndex, hoverIndex);
    }

    handleFileChange(info) {
        console.log("handleFileChange", info);
        this.setState({
            info: info
        });
        let {file} = info;
        const status = file.status;
        if (['error', 'removed'].includes(status)) {
            this.setState({
                fieldJson: '',
                fileList: [],
            });
        } else this.setState({fileList: [file]});
    }

    render() {
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '标识',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => {
                return a.code.localeCompare(b.code)
            }
        }, {
            title: '更新时间',
            dataIndex: 'modifiedTime',
            key: 'modifiedTime',
            sorter: (a, b) => {
                return a.modifiedTime.localeCompare(b.modifiedTime)
            }
        }, {
            title: '当前版本',
            dataIndex: 'version',
            key: 'version'
        }, {
            title: '事件源',
            dataIndex: 'eventSourceName',
            key: 'eventSourceName'
        }, {
            title: '维度',
            dataIndex: 'dimensionName',
            key: 'dimensionName'
        }, {
            title: '类别',
            dataIndex: 'categoryName',
            key: 'categoryName'
        },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                fixed: 'right',
                width: 100
            }];
        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };
        const menuItems = [
            // { label: '上线', callback: selectedKeys => this.multiOnline(), auth: publicUtils.isAuth("business:strategy:strategy:deploy") },
            // { label: '下线', callback: selectedKeys => this.multiOffline(), auth: publicUtils.isAuth("business:strategy:strategy:deploy") },
            {
                label: '删除',
                callback: () => this.multiDelete(),
                auth: publicUtils.isAuth("business:strategy:strategy:delete"),
                confirmIcon: <Icon type="close-circle" style={{color: '#f00'}}/>
            },
        ];
        let multiActionComponent = (
            <MultiControl
                style={{float: 'right', margin: '4px 20px 0 0'}}
                items={menuItems}
                selectedKeys={store.getSelectedRowKeys}
                showConfirm={true}
            />);
        const menu = <Menu>
            <Menu.Item onClick={() => store.getTemplateListForApi(4)}>基于模板创建</Menu.Item>
            <Menu.Item onClick={() => store.modal.importZIP.show()}>基于文件创建</Menu.Item>
        </Menu>;

        const supportFileTypeText = '支持扩展名：.zip';
        const _this = this;
        const uploadProps = {
            // withCredentials: true,
            accept: '.zip',
            fileList: this.state.fileList,
            // disabled: !common.isEmpty(this.state.fileList),
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
                // EXAMPLE: post form-data with 'axios'
                const formData = new FormData();
                // if (data) {
                //     Object.keys(data).map(key => {
                //         formData.append(key, data[key]);
                //     });
                // }
                formData.append(filename, file);

                commonService.getImportZIP(formData,5).then(res => {
                    if (!publicUtils.isOk(res)) {
                        let a = _this.state.info;
                        a.fileList = [];
                        a.file.status = "removed";
                        _this.handleFileChange(a);
                        store.modal.importZIP.hide();
                        return;
                    } else {
                        onSuccess(res, file);
                        message.success('上传成功');
                        let a = _this.state.info;
                        a.fileList = [];
                        a.file.status = "removed";
                        _this.handleFileChange(a);
                        store.modal.importZIP.hide();
                        store.getDataSourceForApi();
                        _this.handleFileChange();
                        _this.setState({importData: res})
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
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar selectName="选择事件源" categoryType="category_strategy"
                                     selectData={this.state.selectData} searchPlaceholder="输入名称或标识查询"
                        >
                            {publicUtils.isAuth("business:strategy:strategy:edit") ?
                                <div style={{width: '280px'}}>
                                    <Dropdown.Button
                                        overlay={menu}
                                        type="primary"
                                        style={{float: 'right'}}
                                        onClick={() => this.props.history.push({pathname: '/business/strategy/definition/save'})}
                                    >
                                        新建决策流
                                    </Dropdown.Button>
                                    {multiActionComponent}
                                </div>
                                : ''
                            }
                        </PageToolBar>
                        <PageToolBar2 type="strategy" selectName="选择事件源" categoryType="category_strategy"
                                      selectData={this.state.selectData} selectName2="选择类别"
                                      searchPlaceholder="输入名称或标识查询"
                        >
                            {
                                publicUtils.isAuth("business:strategy:strategy:edit") ?
                                    <div style={{width: '280px'}}>
                                        <Dropdown.Button
                                            overlay={menu}
                                            type="primary"
                                            style={{float: 'right'}}
                                            onClick={() => this.props.history.push({pathname: '/business/strategy/definition/save'})}
                                        >
                                            新建决策流
                                        </Dropdown.Button>
                                        {multiActionComponent}
                                    </div>
                                    : ''
                            }
                        </PageToolBar2>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table scroll={{x: store.getDataSource.length > 0 ? 1100 : 'auto'}}
                                   rowSelection={rowSelection} columns={columns} dataSource={store.getDataSource}
                                   pagination={false}/>
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize}
                                changePage={this.changePage}></Paging>
                    </div>
                    <UseTimes/>

                    <Modal
                        title={store.modal.tableFields.getTitle}
                        visible={store.modal.tableFields.getIsShow}
                        onOk={() => {
                            store.modal.tableFields.setIsShow(false);
                            store.multiChangeStatusForApi(store.modal.tableFields.getTitle == '批量上线' ? 'online' : 'offline');
                        }}
                        onCancel={() => {
                            store.modal.tableFields.setIsShow(false)
                        }}
                        width={850}
                        destroyOnClose={true}
                    >
                        <p style={{float: 'left', width: 'fit-content', marginTop: '-4px', fontSize: '16px'}}>拟上线策略</p>
                        <p style={{
                            float: 'left',
                            width: 'fit-content',
                            marginLeft: '5px',
                            fontSize: '12px'
                        }}>可以通过拖动排序</p>
                        <DragSortingTableHaveStore
                            dataSource={store.tableFields.getDataSource}
                            columns={store.tableFields.getColumns}
                            callBackFunc={this.dragSortCallBackFunc}
                        />
                    </Modal>

                    <Modal
                        title="版本"
                        visible={store.modal.version.value}
                        onOk={() => {
                            store.modal.version.hide();
                        }}
                        width={850}
                        onCancel={() => {
                            store.modal.version.hide();
                        }}
                        afterClose={store.getDataSourceForApi}
                        footer={[
                            <Button key="back" onClick={() => store.modal.version.hide()}>
                                关闭
                            </Button>
                        ]}
                    >
                        <Table dataSource={store.getVersionList} columns={columns2} pagination={false}/>
                    </Modal>


                    <Modal
                        title="创建决策流模板"
                        visible={store.modal.shareTemplate.value}
                        onOk={() => {
                            if (this.verifyTemplate()) {
                                store.saveTemplateForApi();
                                store.modal.shareTemplate.hide();
                            }
                        }}
                        width={427}
                        onCancel={() => {
                            store.setTemplateType(1);
                            store.modal.shareTemplate.hide();
                        }}
                    >
                        <div>
                            <label>
                                <Radio.Group style={{marginBottom: '35px'}} onChange={(e) => {
                                    this.setState({authorizationType: e.target.value})
                                    store.templateVO.updateData('authorizationType', e.target.value)
                                }} value={store.templateVO.getData.authorizationType}>
                                    <Radio.Button value={0}>保存为私有模板</Radio.Button>
                                    <Radio.Button value={1}>保存为公有模板</Radio.Button>
                                    <Radio.Button value={2}>导出为文件</Radio.Button>
                                </Radio.Group>
                            </label>
                        </div>
                        <Row style={style.templateName}>
                            <Col span={4}>
                                <p style={style.modal_template_p}>名称：</p>
                            </Col>
                            <Col span={18}>
                                <Input maxlength={30} placeholder="请输入名称" value={store.templateVO.getData.name} onChange={(e) => {
                                    store.templateVO.updateData('name', e.target.value)
                                }}/>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '30px', display: this.state.authorizationType == '2' ? 'none' : ''}}>
                            <Col span={4}>
                                <p style={style.modal_template_p}>描述：</p>
                            </Col>
                            <Col span={18}>
                                <Input.TextArea
                                    maxlength={150}
                                    placeholder="请输入描述"
                                    autosize={{minRows: 2, maxRows: 6}} value={store.templateVO.getData.description}
                                    onChange={(e) => {
                                        store.templateVO.updateData('description', e.target.value)
                                    }}
                                />
                            </Col>
                        </Row>
                    </Modal>

                    <Modal
                        title="选择决策流模板"
                        visible={store.modal.useTemplate.value}
                        onOk={() => {
                            if (store.getTemplateType === 1) {//自定义
                                this.props.history.push({pathname: '/business/strategy/definition/save'});
                                store.setTemplateType(1);
                                store.modal.useTemplate.hide();
                            } else {
                                if (common.isEmpty(this.state.templateId)) {
                                    message.warn("请选择模板");
                                    return
                                }
                                this.props.history.push({pathname: '/business/strategy/definition/save/2/' + this.state.templateId});
                                store.setTemplateType(1);
                                store.modal.useTemplate.hide();
                            }
                        }}
                        width={400}
                        onCancel={() => {
                            store.modal.useTemplate.hide();
                        }}
                    >
                        {/*<Radio.Group onChange={(e) => {*/}
                        {/*    store.setTemplateType(e.target.value)*/}
                        {/*}} value={store.getTemplateType}>*/}
                        {/*    <Radio value={1} style={style.radio2}>自定义</Radio>*/}
                        {/*    <Radio value={2} style={style.radio2}>基于模板创建</Radio>*/}
                        {/*    {store.getTemplateType === 2 ?*/}
                        {/*        <Select placeholder="请选择模板" defaultValue={this.state.templateId}*/}
                        {/*                style={{width: '250px', marginTop: '10px'}} onChange={(value) => {*/}
                        {/*            this.setState({*/}
                        {/*                templateId: value*/}
                        {/*            })*/}
                        {/*        }}>*/}
                        {/*            {*/}
                        {/*                !common.isEmpty(store.getTemplateList) ?*/}
                        {/*                    store.getTemplateList.map((item, i) =>*/}
                        {/*                        <Select.Option value={item.id} key={i}>{item.name}</Select.Option>*/}
                        {/*                    ) : ''*/}
                        {/*            }*/}
                        {/*        </Select>*/}
                        {/*        : null}*/}
                        {/*</Radio.Group>*/}
                        <Select placeholder="请选择模板" defaultValue={this.state.templateId} style={{width: '100%'}}
                                onChange={templateId => this.setState({templateId})}>
                            {
                                !common.isEmpty(store.getTemplateList) ?
                                    store.getTemplateList.map((item, i) =>
                                        <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                    ) : ''
                            }
                        </Select>
                    </Modal>

                    <Modal
                        title="基于文件创建"
                        visible={store.modal.importZIP.value}
                        footer={null}
                        onOk={() => {
                            this.props.history.push({
                                pathname: '/business/strategy/card/save/3/',
                                state: {data: this.state.importData}
                            });
                            store.modal.importZIP.hide();
                            // if (common.isEmpty(this.state.templateId)) {
                            //     message.warn("请选择模板");
                            //     return
                            // }
                            // this.props.history.push({pathname: '/business/strategy/card/save/2/' + this.state.templateId});
                            // store.modal.importZIP.hide();
                        }}
                        width={500}
                        onCancel={() => {
                            store.modal.importZIP.hide();
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

export default Definition


const style = {
    modal_template_p: {
        width: '100%',
        height: '32px',
        lineHeight: '32px',
        textAlign: 'left'
    },
    templateName: {
        marginBottom: '15px'
    },
    templateDescription: {
        marginBottom: '30px'
    },
    radio: {
        // marginTop: '30px'
    },
    radio2: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    }
}

const columns2 = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '当前版本',
        dataIndex: 'version',
        key: 'version',
    },
    {
        title: '更新时间',
        dataIndex: 'modifiedTime',
        key: 'modifiedTime',
    },
    {
        title: '操作人',
        dataIndex: 'createdUserName',
        key: 'createdUserName',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
];