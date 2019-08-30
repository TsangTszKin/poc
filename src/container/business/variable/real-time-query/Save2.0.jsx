import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/rtq/Save2.0';
import PageHeader2 from '@/components/PageHeader2';
import '@/styles/business/variable/real-time-query-edit.less';
import { withRouter } from 'react-router-dom';
import { Drawer, Table, Button } from 'antd';
import common from '@/utils/common';
import Code from '@/components/Code';
import Info from '@/components/business/variable/real-time-query/2.0/Info.jsx';
import DesignPanel from '@/components/business/variable/real-time-query/2.0/DesignPanel.jsx';

@withRouter
@observer
class Save extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            dimensionListAll: [],
            dataTypeList: [],
            isResource: false,
        }
    }

    componentDidMount() {
        this.isResource = this.props.match.path === '/business/release/rtqVar/detail/:type/:rtqVarType/:id';
        store.setIsResource(this.isResource);
        this.setState({
            isResource: this.isResource
        });
        this.init();

        // 根据当前页面类型，改写页面标题头部大标题
        let title
        switch (this.props.match.params.rtqVarType) {
            case 'RTQQUERY'://实时集合
                title = '实时集合'
                break;
            case 'RTQVAR'://实时变量
                title = '实时变量'
                break;
            case 'SCRIPTVAR'://脚本变量
                title = '脚本变量'
                break;
            default:
                break;
        }
        window.document.getElementById('page-title').innerHTML = title
    }

    componentWillUnmount() {
    }

    componentWillUnmount() {
        store.reset();
    }

    componentWillUpdate(nextProps) {
        if (this.props.match.params.id != nextProps.match.params.id) {
            console.log("this.props.match.params.id, nextProps.match.params.id", this.props.match.params.id, nextProps.match.params.id)
            if (store.getCurrentStepIndex === 0) {
                store.init();
                store.reset();
                if (!common.isEmpty(nextProps.match.params.id)) {
                    store.getRtqInfo_2_0_forApi(nextProps.match.params.id, this.isResource);
                    store.setId(nextProps.match.params.id);
                    if (!this.state.isResource) store.allVersionForApi(nextProps.match.params.id);
                    switch (nextProps.match.params.type) {
                        case 'RTQQUERY'://实时集合
                            store.setCurrentStepIndex(1);
                            break;
                        case 'RTQVAR'://实时变量
                            store.setCurrentStepIndex(1);
                            break;
                        // case 'RTQVAR'://脚本变量
                        //     break;
                        default:
                            break;
                    }
                }
                store.setIsLoading(false);
            }
        }

    }

    init() {
        store.init();
        store.reset();
        if (!common.isEmpty(this.props.match.params.id)) {
            if (this.props.match.params.type === '2') {
                store.getRtqByTemplateId(this.props.match.params.id, this.isResource);
            } else {
                store.getRtqInfo_2_0_forApi(this.props.match.params.id, this.isResource);
                store.setId(this.props.match.params.id);
                if (!this.isResource) store.allVersionForApi(this.props.match.params.id);
                switch (this.props.match.params.rtqVarType) {
                    case 'RTQQUERY'://实时集合
                        store.setCurrentStepIndex(1);
                        break;
                    case 'RTQVAR'://实时变量
                        store.setCurrentStepIndex(1);
                        break;
                    // case 'RTQVAR'://脚本变量
                    //     break;
                    default:
                        break;
                }
            }
        } else {
            store.setCurrentStepIndex(0);
            store.getRtqInfo_2_0_forApi('');
            store.baseInfo.updateData('rtqVarType', this.props.match.params.rtqVarType);
        }
        store.setIsLoading(false);
    }

    render() {
        const testInputColumns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',

        }, {
            title: '标识',
            dataIndex: 'code',
            key: 'code',

        }, {
            title: '值',
            dataIndex: 'value',
            key: 'value',

        }]
        const testOutputColumns = [{
            title: '名称',
            dataIndex: 'resultName',
            key: 'resultName',

        }, {
            title: '值',
            dataIndex: 'resultValue',
            key: 'resultValue',

        }]


        //解决在mobx之间的通讯问题
        switch (store.getStoreBus) {
            case 1:
                store.setStoreBus(2);//info再初始化一次
                break;

            default:
                break;
        }

        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader2
                        meta={this.props.meta}
                        isShowBtns={!common.isEmpty(this.props.match.params.id) ? this.props.match.params.type !== '2' ? true : false : false}
                        isShowSelect={!common.isEmpty(this.props.match.params.id) ? this.props.match.params.type !== '2' ? true : false : false}
                        auth={{
                            test: !common.isEmpty(this.props.match.params.rtqVarType) && this.props.match.params.rtqVarType === 'RTQVAR',
                            sql: true,
                            version: true,
                        }}
                    ></PageHeader2>
                    <div className="pageContent" style={{ marginLeft: '24px', padding: '0 0 64px 0' }}>
                        <div style={{ marginTop: '20px', paddingTop: '16px' }}>
                            {
                                store.getCurrentStepIndex === 0 ?
                                    <Info
                                        eventSourceList={store.helper.getData.eventSourceList}
                                        dimensionList={store.helper.getData.dimensionList}
                                        rtqVarTypeList={store.helper.getData.rtqVarTypeList}
                                        dataTypeList={store.helper.getData.dataTypeList}
                                        categoryList={store.helper.getData.categoryList}
                                        isResource={this.state.isResource}
                                    />
                                    :
                                    <DesignPanel currentStepIndex={store.getCurrentStepIndex}
                                        isResource={this.state.isResource} />
                            }

                        </div>
                    </div>


                    <Drawer
                        title="总览"
                        placement="right"
                        closable={true}
                        onClose={() => {
                            store.setIsShowDrawerForSql(false)
                        }}
                        visible={store.getIsShowDrawerForSql}
                        width="720"
                        destroyOnClose={true}
                    >
                        <Code sqlCode={store.getSqlPreview} type={1} />
                    </Drawer>
                    <Drawer
                        title="测试"
                        placement="right"
                        closable={true}
                        onClose={() => {
                            store.setIsShowDrawerForTest(false)
                        }}
                        visible={store.getIsShowDrawerForTest}
                        width="720"
                        destroyOnClose={true}
                    >
                        <p style={{
                            font: 'Microsoft Tai Le',
                            fontSize: '16px',
                            margin: '0',
                            height: '58px',
                            lineHeight: '58px',
                            color: '#000',
                            opacity: '0.85'
                        }}>输入</p>
                        <Table columns={testInputColumns} dataSource={store.getInputDataSource} pagination={false} />

                        <p style={{
                            font: 'Microsoft Tai Le',
                            fontSize: '16px',
                            margin: '0',
                            height: '58px',
                            lineHeight: '58px',
                            color: '#000',
                            opacity: '0.85',
                            marginTop: '70px'
                        }}>输出</p>
                        <Table columns={testOutputColumns} dataSource={store.getOutputDataSource} pagination={false} />

                        <Button type="primary" style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: '1' }}
                            disabled={!store.getIsCanTest}
                            onClick={store.getTestOutputForApi}
                        >测试</Button>
                    </Drawer>
                </div>

            </Provider>
        )
    }
}

Save.propTypes = {}
Save.defaultProps = {}
export default Save