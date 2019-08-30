import React, {Component} from 'react';
import {Provider, observer} from 'mobx-react';
import store from '@/store/business/release/package/Index';
import PageHeader from '@/components/PageHeader';
import {
    Table,
    Icon,
    Spin,
    Modal,
    Form,
    Button,
    Col,
    Upload,
    Dropdown,
    Row,
    Menu,
    Input,
    message
} from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/business/strategy-package/page-tool-bar';
import {withRouter} from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';
import UseTimes from '@/components/business/UseTimes';
import common from "@/utils/common";
import strategyService from "@/api/business/strategyService";
import '@/styles/business/release/release.less';
import Status from "@/components/business/strategy-package/status";
import MultiControl from "@/components/common/MultiControl";
import webSocketConnection from '@/utils/websocket';
import packageStatus from "@/utils/strategy-package-status";
import commonService from '@/api/business/commonService';

@Form.create()
@withRouter
@observer
class Index extends Component {
    state = {
        confirmLoading: false,
        packageSelectedKeys: [],
        packageRows: []
    };

    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.ticket = 'strategypackage';
    }

    componentDidMount() {
        store.initParams();
        store.getDataSourceForApi();
        // this.ticket = hex_md5(String(Math.random()));
        this.socket = new webSocketConnection({
            ticket: this.ticket,
            // socketOpen: () => {},
            socketMessage: this.handleSocketMessage,
            // socketClose: e => {},
            socketError: e => console.log('WebSocket连接发生错误', e),
            timeout: 10000,
        });
    }

    handleSocketMessage = msg => {
        let msgData = JSON.parse(msg.data);
        console.log(message);
        message.success(msgData.resultMessage);
        store.getDataSourceForApi();
        // if (Number(msgData.resultCode) === 1000) {
        //     // console.log(msg);
        // }
    };

    componentWillUnmount() {
        this.socket.closeSocket();
        // this.socket = null;
    }

    changePage = (pageNum, pageSize) => {
        store.setPageNum(pageNum);
        store.setPageSize(pageSize);
        store.getDataSourceForApi();
    };

    handleSearch = (keyword) => {
        console.log(`关键词：${ keyword }`);
        const query = {
            name: keyword,
            code: keyword
        };
        store.setPageNum(1);
        store.updateQuery(query);
        store.getDataSourceForApi();
    };

    cancelRelease = () => {
        store.setIsShowRelease(false);
    };
    cancelTest = () => {
        store.setIsShowTest(false);
    };
    cancelAudit = () => {
        store.setIsShowAudit(false);
    };
    cancelVersionList = () => {
        store.setIsShowVersionList(false);
    };
    clearSelectedKeys = () => {
        store.rowSelection.setSelectedRowKeys([]);
    };
    releaseConfirm = () => {
        let releaseList = common.deepClone(store.releaseList) || [];
        if (common.isEmpty(store.rowSelection.selectedIndex)) {
            Modal.warning({title: '系统提示', content: '未勾选'});
            return;
        }
        const releaseVersion = releaseList[store.rowSelection.selectedIndex];
        this.setState({confirmLoading: true});
        strategyService.updateStrategyPackageStatus([releaseVersion.id], 105)
            .then(res => {
                publicUtils.isOk(res, true);
                this.setState({confirmLoading: false});
                // store.getDataSourceForApi();
                store.setIsShowRelease(false);
            });
    };
    testConfirm = () => {
        if (!common.isEmpty(store.rowSelection.selectedRowKeys)) {
            let submitIdArr = store.testList
                .filter((item, index) => store.rowSelection.selectedRowKeys.includes(index))
                .map(item => item.id);
            this.setState({confirmLoading: true});
            strategyService.submitTest(submitIdArr).then(res => {
                publicUtils.isOk(res, true);
                this.setState({confirmLoading: false});
                store.getDataSourceForApi();
                store.setIsShowTest(false);
            });
        } else {
            Modal.warning({title: '系统提示', content: '请勾选'});
        }
    };
    auditConfirm = () => {
        if (!common.isEmpty(store.rowSelection.selectedRowKeys)) {
            let submitIdArr = store.auditList
                .filter((item, index) => store.rowSelection.selectedRowKeys.includes(index))
                .map(item => item.id);
            this.setState({confirmLoading: true});
            strategyService.submitAudit(submitIdArr).then(res => {
                publicUtils.isOk(res, true);
                this.setState({confirmLoading: false});
                store.getDataSourceForApi();
                store.setIsShowAudit(false);
            });
        } else {
            Modal.warning({title: '系统提示', content: '请勾选'});
        }
    };
    multiControl = control => {
        let idArr;
        switch (control) {
            case '发布':
                common.loading.show();
                idArr = this.state.packageRows.map(item => item.versions.lastEditVersion.id);
                strategyService.updateStrategyPackageStatus(idArr, 105).then(this.handleSuccess);
                break;
            case '停止':
                common.loading.show();
                idArr = this.state.packageRows.filter(item => !common.isEmpty(item.versions.deployedVersion))
                    .map(item => item.versions.deployedVersion.id);
                if (common.isEmpty(idArr)) {
                    common.loading.hide();
                    return;
                }
                strategyService.updateStrategyPackageStatus(idArr, 106).then(this.handleSuccess);
                break;
            case '删除':
                idArr = this.state.packageRows.map(item => item.id);
                let _this = this;
                Modal.confirm({
                    title: '系统提示',
                    content: '是否批量删除?',
                    icon: <Icon type="close-circle" style={{color: '#f00'}}/>,
                    onOk() {
                        common.loading.show();
                        strategyService.deleteStrategyPackage(idArr).then(_this.handleSuccess);
                    }
                });
                break;
        }
    };

    verifyTemplate = () => {
        if (common.isEmpty(store.templateVO.getData.name)) {
            message.warn('请输入文件名称');
            return false
        }
        return true
    }

    // 批量操作成功处理
    handleSuccess = res => {
        common.loading.hide();
        this.setState({
            packageSelectedKeys: [],
            packageRows: []
        });
        if (publicUtils.isOk(res, true)) {
            store.getDataSourceForApi();
        }
    };

    // 根据选择条件获取列表
    handleStateChange = ({key}) => {
        store.updateQuery({status: key});
        store.getDataSourceForApi();
    };

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
                              onError,
                              onProgress,
                              onSuccess,
                          }) {
                const formData = new FormData();
                formData.append(filename, file);
                commonService.getImportZIP(formData,8).then(res => {
                    if (!publicUtils.isOk(res)) {
                        let a = _this.state.info;
                        a.fileList = [];
                        a.file.status = "removed";
                        _this.handleFileChange(a);
                        store.modal.importZIP.hide();
                        message.success('上传失败');
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
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '标识',
                dataIndex: 'code',
                key: 'code',
                sorter: (a, b) => {
                    return a.code.localeCompare(b.code);
                }
            },
            {
                title: '事件源',
                dataIndex: 'eventSource.eventSourceName'
            },
            {
                title: '发布版本',
                dataIndex: 'deployedVersion',
                key: 'deployedVersion'
            },
            {
                title: '更新时间',
                dataIndex: 'modifiedTime',
                key: 'modifiedTime',
                sorter: (a, b) => a.modifiedTime.localeCompare(b.modifiedTime)
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status'
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                fixed: 'right',
                width: 100
            }
        ];
        const modalColumns = [
            {title: '名称', dataIndex: 'name'},
            {title: '当前版本', dataIndex: 'version'},
            {title: '更新时间', dataIndex: 'modifiedTime'},
            {
                title: '状态', dataIndex: 'status', key: 'status',
                render: (text, record) => <Status statusCode={text}
                                                  isShowMsg={packageStatus.isShowErrorMsg(record.status)}
                                                  errorMsg={record.lastErrorMessage}/>
            }
        ];
        const versionColumns = [
            {title: '序号', dataIndex: 'index', width: 55},
            {title: '名称', dataIndex: 'name'},
            {title: '当前版本', dataIndex: 'version'},
            {title: '更新时间', dataIndex: 'modifiedTime'},
            {title: '操作人', dataIndex: 'createdUserName'},
            {title: '状态', dataIndex: 'status'},
            {title: '操作', dataIndex: 'action'},
        ];
        const strategyPackageSelection = {
            selectedRowKeys: this.state.packageSelectedKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    packageSelectedKeys: selectedRowKeys,
                    packageRows: selectedRows
                });
            }
        };
        const releaseRowSelection = {
            selectedRowKeys: store.rowSelection.selectedRowKeys,
            onChange: (selectedRowKeys) => {
                // 配合ccs隐藏全选，强行单选
                const selectedIndex = selectedRowKeys.pop();
                store.rowSelection.setSelectedRowKeys([selectedIndex]);
                store.rowSelection.setSelectedIndex(selectedIndex);
            }
        };
        const testRowSelection = {
            selectedRowKeys: store.rowSelection.selectedRowKeys,
            onChange: (selectedRowKeys) => {
                store.rowSelection.setSelectedRowKeys(selectedRowKeys);
            }
        };
        const menuItems = [
            // { label: '发布', callback: () => this.multiControl('发布') },
            {label: '停止', callback: () => this.multiControl('停止'), isShowConfirm: true},
            {label: '删除', callback: () => this.multiControl('删除')},
        ];

        // key就是query
        const stateText = {
            0: '所有',
            105: '已发布',
            106: '已停止',
            113: '未发布',
        };
        const menu = <Menu>
            <Menu.Item onClick={() => store.modal.importZIP.show()}>基于文件创建</Menu.Item>
        </Menu>;
        const stateMenu = (
            <Menu onClick={this.handleStateChange}>
                {
                    Object.keys(stateText).map((item, index) =>
                        <Menu.Item key={item}>{stateText[item]}</Menu.Item>)
                }
            </Menu>
        );

        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader
                        meta={this.props.meta}
                        versions={store.version}/>
                    <div className="pageContent">
                        <PageToolBar
                            searchPlaceholder="输入名称查询"
                            handleSearch={this.handleSearch}
                            /* btnStr={ publicUtils.isAuth("business:release:package:edit") ? "新增策略包" : '' }
                             btnCallBack={ () => this.props.history.push({ pathname: '/business/release/package/save' }) }*/>
                            <div className="state-drop-menu">
                                选择状态：
                                <Dropdown className="dropdown-state" overlay={stateMenu}>
                                    <Button className="dropdown-state-btn"
                                            htmlType="button">{stateText[store.query.status]}
                                        <Icon type="down"/>
                                    </Button>
                                </Dropdown>
                            </div>
                            <Dropdown.Button
                                style={{float: 'right'}}
                                type="primary"
                                overlay={menu}
                                onClick={() => this.props.history.push('/business/release/package/save')}>
                                新建策略包
                            </Dropdown.Button>
                            <MultiControl
                                style={{float: 'right', margin: '5px 20px'}}
                                items={menuItems}
                                selectedKeys={this.state.packageSelectedKeys}
                            />
                        </PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table
                                rowSelection={strategyPackageSelection}
                                scroll={{x: 1100}}
                                columns={columns}
                                dataSource={store.getDataSource}
                                pagination={false}/>
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize}
                                changePage={this.changePage}/>
                    </div>
                    <Modal
                        title="版本发布"
                        width={850}
                        visible={store.isShowRelease}
                        onOk={this.releaseConfirm}
                        okText="发布"
                        onCancel={this.cancelRelease}
                        confirmLoading={this.state.confirmLoading}
                        afterClose={this.clearSelectedKeys}>
                        <Table
                            scroll={{x: true}}
                            className="release-version-table"
                            dataSource={store.releaseList}
                            columns={modalColumns}
                            rowSelection={releaseRowSelection}
                            pagination={false}
                        />
                    </Modal>
                    <Modal
                        title="测试"
                        width={850}
                        visible={store.isShowTest}
                        onOk={this.testConfirm}
                        onCancel={this.cancelTest}
                        confirmLoading={this.state.confirmLoading}
                        afterClose={this.clearSelectedKeys}>
                        <Table
                            scroll={{x: true}}
                            dataSource={store.testList}
                            columns={modalColumns}
                            rowSelection={testRowSelection}
                            pagination={false}/>
                    </Modal>
                    <Modal
                        title="提交审核"
                        width={850}
                        visible={store.isShowAudit}
                        onOk={this.auditConfirm}
                        onCancel={this.cancelAudit}
                        confirmLoading={this.state.confirmLoading}
                        afterClose={this.clearSelectedKeys}>
                        <Table
                            scroll={{x: true}}
                            dataSource={store.auditList}
                            columns={modalColumns}
                            rowSelection={testRowSelection}
                            pagination={false}/>
                    </Modal>
                    <Modal
                        title="版本"
                        width={850}
                        visible={store.isShowVersionList}
                        footer={[
                            <Button type="default" onClick={this.cancelVersionList} htmlType="button">
                                取消
                            </Button>
                        ]}
                        onCancel={this.cancelVersionList}
                        afterClose={this.clearSelectedKeys}>
                        <Table
                            scroll={{x: true}}
                            dataSource={store.versionList}
                            columns={versionColumns}
                            pagination={false}/>
                    </Modal>
                    <Modal
                        title="导出为文件"
                        visible={store.modal.shareTemplate.value}
                        onOk={() => {
                            if (this.verifyTemplate()) {
                                store.saveTemplateForApi();
                                store.modal.shareTemplate.hide();
                            }
                        }}
                        width={425}
                        onCancel={() => {
                            store.modal.shareTemplate.hide();
                            store.templateVO.updateData('name', '');
                        }}
                    >
                        <Row style={style.templateName}>
                            <Col span={5}>
                                <p style={style.modal_template_p}>文件名称：</p>
                            </Col>
                            <Col span={18}>
                                <Input maxlength={30} placeholder="请输入文件名称" value={store.templateVO.getData.name}
                                       onChange={(e) => {
                                           store.templateVO.updateData('name', e.target.value)
                                       }}/>
                            </Col>
                        </Row>
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
                    <UseTimes/>
                </div>
            </Provider>
        );
    }
};
const style = {
    modal_template_p: {
        width: '100%',
        height: '32px',
        lineHeight: '32px',
        textAlign: 'left'
    },
    templateName: {
        marginBottom: '15px'
    }
}

export default Index;