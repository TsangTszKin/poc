import {
    Button,
    Col,
    Dropdown,
    Form, Icon,
    Input,
    Menu,
    message,
    Modal,
    Popconfirm,
    Radio,
    Row, Select,
    Spin,
    Table,
    Upload
} from "antd";
import React, {Component, Fragment} from 'react';
import {observer, Provider} from "mobx-react";
import PageHeader from "@/components/business/strategy-package/page-header";
import store from '@/store/business/strategy/table/Index';
import commonService from "@/api/business/commonService";
import publicUtils from "@/utils/publicUtils";
import strategyService from "@/api/business/strategyService";
import MultiControl from "@/components/common/MultiControl";
import PageToolBar from "@/components/business/strategy/table/PageToolBar";
import {withRouter} from "react-router-dom";
import Action from "@/components/business/strategy/table/Action";
import common from "@/utils/common";
import UseTimes from "@/components/business/UseTimes";
import getStrategyTypeName from "@/utils/strategy-type-name";
import Paging from "@/components/Paging";
import {action} from "mobx";

const versionColumns = [
    {title: '序号', dataIndex: 'index', width: 55},
    {title: '名称', dataIndex: 'name'},
    {title: '当前版本', dataIndex: 'version'},
    {title: '更新时间', dataIndex: 'modifiedTime'},
    {title: '操作人', dataIndex: 'createdUserName'},
    {title: '状态', dataIndex: 'status'},
    {title: '操作', dataIndex: 'action'},
];

@withRouter
@observer
class Index extends Component {
    state = {
        selectedKeys: [],
        selectedRows: [],
        eventSourceId: '',
        category: '',
        search: '',
        isLoading: true,
        isShowVersionList: false,
        isShowShareTemplate: false,
        isUseTemplate: false,
        importZIP: false,
        versionList: [],
        info: {},
        templateList: [],
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        let queryParams = {
            page: store.pagination.page,
            size: store.pagination.pageSize,
            name: this.state.search,
            code: this.state.search,
            category: this.state.category,
            eventSourceId: this.state.eventSourceId,
        };
        console.log(queryParams);
        this.setState({isLoading: true});
        strategyService.getStrategyTableList(queryParams).then(res => {
            this.setState({isLoading: false});
            if (!publicUtils.isOk(res)) return;
            let dataSource = res.data.pageList.resultList;
            store.pagination.setTotal(res.data.pageList.sum);
            dataSource.forEach((item, index) => {
                item.index = index + 1;
                item.action = <Action dataId={item.id}
                                      code={item.code}
                                      reload={this.getData}
                                      delete={() => this.delete(item.code)}
                                      edit={() => this.edit(item.id)}
                                      toDetail={() => this.toDetail(item.id)}
                                      showVersionList={() => this.showVersionList(item.code)}
                                      showShareTemplate={() => this.showShareTemplate(item.id)}
                                      showOverview={() => this.showOverview(item.id, item.quoteSum)}
                />;
            });
            store.setDataSource(dataSource);
        })
    }
    getTemplateListForApi = (type) => {
        common.loading.show();
        commonService.getTemplateList('', '', {code: '', name: '', type: type})
            .then(this.getTemplateListForApiCallBack).then(res => {
            console.log("喵喵喵？", res)
            common.loading.hide();
            this.setState({isUseTemplate: true});
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.pageList.resultList.forEach(element => {
                tempArray.push({
                    name: element.name,
                    id: element.id,
                })
            })
            this.setState({templateList: tempArray});
            console.log("this.getTemplateList", this.state.templateList);
        })
    }

    showOverview = (id, quoteSum) => {
        store.useTimesTree.setData({});
        store.useTimesTree.setTimes(quoteSum);
        strategyService.getStrategyTableQuiteById(id).then(res => {
            if (!publicUtils.isOk(res)) return;

            let data = res.data.result;
            this.formatUseTimesTree(data);
            store.useTimesTree.setData(data);
            store.useTimesTree.setShow(true);
        })
    }

    formatUseTimesTree(obj) {
        obj.collapsed = false;
        delete obj.id;
        obj.name = obj.name + `（${getStrategyTypeName(obj.type)}）`;
        delete obj.type;
        if (!common.isEmpty(obj.nodes)) {
            obj.children = obj.nodes;
            delete obj.nodes;
            obj.children.forEach(element => {
                this.formatUseTimesTree(element);
            })
        }
    }

    showShareTemplate = id => {
        store.updateTemplateVO('id', id);
        this.setState({isShowShareTemplate: true});
    }

    handleChangePage = (page, pageSize) => {
        store.pagination.setPage(page);
        store.pagination.setPageSize(pageSize);
        this.getData();
    }

    handleSearch = keyWork => {
        console.log(keyWork);
        this.setState({search: keyWork}, this.getData);
    }

    handleChangeCategory = category => {
        this.setState({category}, this.getData);
    }

    handleChangeEventSource = eventSourceId => {
        store.pagination.setPage(1);
        this.setState({eventSourceId}, this.getData);
    }

    multiDelete = selectedKeys => {
        // console.log(selectedKeys);
        console.log(this.state.selectedRows);
        if (common.isEmpty(this.state.selectedRows)) {
            message.warning('请勾选');
            return;
        }
        let codeArr = this.state.selectedRows.map(item => item.code);
        common.loading.show();
        strategyService.multiDeleteStrategyTable(codeArr).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return;
            message.success('删除成功');
            this.getData();
            this.setState({
                selectedKeys: [],
                selectedRows: [],
            })
        })
    }

    edit = id => this.props.history.push(`/business/strategy/table/save/${id}`);
    toDetail = id => this.props.history.push(`/business/strategy/table/detail/${id}`);
    delete = code => {
        common.loading.show();
        strategyService.deleteStrategyTableByCode(code).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return;
            message.success('删除成功！');
            this.getData();
        });
    }

    deleteVersion = (id, code) => {
        common.loading.show();
        strategyService.deleteStrategyTableVersionById(id).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return;
            message.success('删除成功！');
            this.getData();
            // this.setState(preState => {
            //     let versionList = preState.versionList;
            //     versionList.splice(deleteIndex, 1);
            //     if (common.isEmpty(versionList)) {
            //         return {
            //             isShowVersionList: false,
            //             versionList: [],
            //         }
            //     }
            //     else return { versionList };
            // });
            this.showVersionList(code);
        })
    }

    showVersionList = code => {
        let dataSource = [];
        strategyService.getStrategyTableVersions(code).then(res => {
            if (!publicUtils.isOk(res)) return;
            dataSource = res.data.result;
            dataSource.forEach((item, index) => {
                item.index = index + 1;
                item.action = <div className="table-actions">
                    <icon className="iconfont iconbianji" title="编辑" onClick={() => this.edit(item.id)}/>
                    {
                        publicUtils.isAuth("business:strategy:rule:delete") ?
                            <Popconfirm
                                title="是否确定删除?" onConfirm={() => this.deleteVersion(item.id, code)}
                                onCancel={() => {
                                }} okText="确定" cancelText="取消">
                                <icon className="iconfont iconshanchu"/>
                            </Popconfirm>
                            : <icon className="iconfont disabled iconshanchu"/>
                    }
                </div>
            });
            this.setState({
                versionList: dataSource,
                isShowVersionList: !common.isEmpty(dataSource)
            });
        });
    }

    cancelVersionList = () => {
        this.setState({
            isShowVersionList: false,
            versionList: [],
        });
    }

    downloadTemplate = () => {
        // console.log(666);
        let transplantVO = {
            id: store.templateVO.id,
            type: 7
        }
        commonService.getExportZIP(transplantVO).then(res => {
            common.loading.hide();
            const type = 'application/zip'
            const blob = new Blob([res.data], {type: type})
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', store.templateVO.name);
            document.body.appendChild(link);
            link.click();
            message.success('下载成功');
            this.setState({isShowShareTemplate: false});
            store.resetTemplateVO();
        })
    };

    handleConfirmShare = () => {
        if (common.isEmpty(store.templateVO.name)) {
            message.warning('请输入名称');
            return;
        }
        common.loading.show();
        if (store.templateVO.authorizationType == "2") {
            this.downloadTemplate();
        } else {
            commonService.saveTemplate(store.templateVO).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return;
                message.success('保存成功');
                this.setState({isShowShareTemplate: false});
                store.resetTemplateVO();
            })

        }
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
                sorter: common.tableSorter('code')
            },
            {
                title: '更新时间',
                dataIndex: 'modifiedTime',
                key: 'modifiedTime',
                sorter: common.tableSorter('modifiedTime')
            },
            {
                title: '当前版本',
                dataIndex: 'version',
                key: 'version'
            },
            {
                title: '事件源',
                dataIndex: 'eventSourceName',
                key: 'eventSourceName'
            }, {
                title: '维度',
                dataIndex: 'dimensionName',
                key: 'dimensionName'
            },
            {
                title: '类型',
                dataIndex: 'typeName',
                key: 'typeName',
            },
            {
                title: '类别',
                dataIndex: 'categoryName',
                key: 'categoryName',
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                fixed: 'right',
                width: 50
            }
        ];
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
                              withCredentials,
                          }) {
                // EXAMPLE: post form-data with 'axios'
                const formData = new FormData();
                // if (data) {
                //     Object.keys(data).map(key => {
                //         formData.append(key, data[key]);
                //     });
                // }
                formData.append(filename, file);

                commonService.getImportZIP(formData,7).then(res => {
                    if (!publicUtils.isOk(res)) {
                        let a = _this.state.info;
                        a.fileList = [];
                        a.file.status = "removed";
                        _this.handleFileChange(a);
                        _this.setState({importZIP: false})
                        return;
                    } else {
                        onSuccess(res, file);
                        message.success('上传成功');
                        let a = _this.state.info;
                        a.fileList = [];
                        a.file.status = "removed";
                        _this.handleFileChange(a);
                        _this.getData();
                        _this.handleFileChange();
                        _this.setState({importData: res, importZIP: false})
                    }
                });

                return {
                    abort() {
                        console.log('upload progress is aborted.');
                    },
                };
            },
        };
        const menuItems = [
            {label: '删除', callback: selectedKeys => this.multiDelete(selectedKeys),}
        ];
        const rowSelection = {
            selectedRowKeys: this.state.selectedKeys,
            onChange: (selectedKeys, selectedRows) => {
                console.log('selectedKeys changed: ', selectedKeys);
                console.log('selectedRows changed: ', selectedRows);
                this.setState({selectedKeys, selectedRows});
            }
        };
        const menu = <Menu>
            <Menu.Item onClick={() => this.getTemplateListForApi(6)}>基于模板创建</Menu.Item>
            <Menu.Item onClick={() => this.setState({importZIP: true})}>基于文件创建</Menu.Item>
        </Menu>;

        return (
            <Provider store={store}>
                <div>
                    <PageHeader meta={this.props.meta}/>
                    <div className="page-content">
                        <PageToolBar
                            handleSearch={this.handleSearch}
                            handleChangeCategory={this.handleChangeCategory}
                            handleChangeEventSource={this.handleChangeEventSource}
                        >
                            <Fragment>
                                <Dropdown.Button
                                    style={{float: 'right'}}
                                    type="primary"
                                    overlay={menu}
                                    onClick={() => this.props.history.push('/business/strategy/table/save')}>
                                    新建决策表
                                </Dropdown.Button>
                                <MultiControl
                                    style={{float: 'right', margin: '4px 20px 0 0'}}
                                    items={menuItems}
                                    selectedKeys={this.state.selectedKeys}
                                    showConfirm={true}
                                />
                            </Fragment>
                        </PageToolBar>
                        <Spin spinning={this.state.isLoading}>
                            <Table
                                scroll={{x: 1200}}
                                columns={columns}
                                dataSource={store.dataSource}
                                rowSelection={rowSelection}
                                pagination={false}
                            />
                            <Paging
                                showPageSize={store.pagination.pageSize}
                                total={store.pagination.total}
                                changePage={this.handleChangePage}
                                pageNum={store.pagination.page}
                            />
                        </Spin>
                    </div>
                    <Modal
                        title="版本"
                        width={850}
                        visible={this.state.isShowVersionList}
                        footer={[
                            <Button type="default" onClick={this.cancelVersionList} htmlType="button">
                                取消
                            </Button>
                        ]}
                        onCancel={this.cancelVersionList}
                        // afterClose={ this.clearSelectedKeys }
                    >
                        <Table
                            dataSource={this.state.versionList}
                            columns={versionColumns}
                            pagination={false}
                        />
                    </Modal>
                    <Modal
                        title="创建决策表模板"
                        visible={this.state.isShowShareTemplate}
                        onOk={this.handleConfirmShare}
                        width={427}
                        onCancel={() => {
                            store.resetTemplateVO();
                            this.setState({isShowShareTemplate: false});
                        }}
                    >
                        <div>
                            <div>
                                {console.log("store.templateVO.getData.authorizationType", store.templateVO.description, store.templateVO.name)}
                            </div>
                            <label>
                                <Radio.Group style={{marginBottom: '35px'}} onChange={(e) => {
                                    store.updateTemplateVO('authorizationType', e.target.value);
                                }} value={store.templateVO.authorizationType}>
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
                                <Input maxlength={30} placeholder="请输入名称" value={store.templateVO.name}
                                       onChange={(e) => {
                                           store.updateTemplateVO('name', e.target.value);
                                       }}/>
                            </Col>
                        </Row>
                        <Row style={{
                            marginBottom: '30px',
                            display: store.templateVO.authorizationType == '2' ? 'none' : ''
                        }}>
                            <Col span={4}>
                                <p style={style.modal_template_p}>描述：</p>
                            </Col>
                            <Col span={18}>
                                <Input.TextArea
                                    maxlength={150}
                                    placeholder="请输入描述"
                                    autosize={{minRows: 2, maxRows: 6}} value={store.templateVO.description}
                                    onChange={(e) => {
                                        store.updateTemplateVO('description', e.target.value);
                                    }}
                                />
                            </Col>
                        </Row>
                    </Modal>

                    <Modal
                        title="选择决策表模板"
                        visible={this.state.isUseTemplate}
                        onOk={() => {
                            if (common.isEmpty(this.state.templateId)) {
                                message.warn("请选择模板");
                                return
                            }
                            this.props.history.push({pathname: '/business/strategy/table/save/2/' + this.state.templateId});
                            this.setState({isUseTemplate: false});
                        }}
                        width={400}
                        onCancel={() => {
                            this.setState({isUseTemplate: false});
                        }}
                    >
                        <Select placeholder="请选择模板" defaultValue={this.state.templateId} style={{width: '100%'}}
                                onChange={value => {
                                    let templateId = value;
                                    this.setState({templateId})
                                }}>
                            {
                                !common.isEmpty(this.state.templateList) ?
                                    this.state.templateList.map((item, i) =>
                                        <Select.Option value={item.id}
                                                       key={i}>{item.name}</Select.Option>
                                    ) : ''
                            }
                        </Select>
                    </Modal>

                    <Modal
                        title="基于文件创建"
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

                    <UseTimes/>
                </div>
            </Provider>
        );
    }
}

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

export default Index;