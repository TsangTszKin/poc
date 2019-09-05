/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:18:31
 * @Description: 
 */
import React, { Component } from 'react';
import store from '@/store/business/pay/Detail';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import PageHeader from '@/components/PageHeader';
import { Row, Col, DatePicker, Button, Select, Spin, Divider } from 'antd'
import moment from 'moment';
import DiagramDetail from '@/components/business/home/DiagramDetail'
import DiagramDetailESB from '@/components/business/home/DiagramDetailESB'
import Code from '@/components/Code';
import { withRouter } from 'react-router-dom'
import TimeUnit from '@/components/business/home/widgets/TimeUnit';
import publicUtils from '@/utils/publicUtils'
import payService from '@/api/business/payService'

@withRouter
@observer
class Pre extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbName: ''
        }
        this.init_jiaoyiliang = this.init_jiaoyiliang.bind(this);
        this.init_pingjunhaoshi = this.init_pingjunhaoshi.bind(this);
        this.getData = this.getData.bind(this);
        this.getDetailChartsForApi = this.getDetailChartsForApi.bind(this);
    }

    componentDidMount() {
        this.init()
    }

    init() {
        this.getData()
        this.getDetailChartsForApi();
    }

    getData() {
        switch (this.props.match.path) {
            case '/business/pay/pre':
                store.getPayDetailDataForApi('front');
                break;
            case '/business/pay/unit':
                store.getPayDetailDataForApi('online');
                break;
            case '/business/pay/esb':
                store.getPayDetailDataForApi('esb');
                break;
            default:
                break;
        }
    }

    getDetailChartsForApi() {
        store.helper.updateData('loading2', true);
        let query = Object.assign({
            timeUnit: store.helper.getData.timeUnit
        }, store.helper.getData.query)

        let type = ''
        switch (this.props.match.path) {
            case '/business/pay/pre':
                type = 'front'
                break;
            case '/business/pay/unit':
                type = 'online'
                break;
            case '/business/pay/esb':
                type = 'esb'
                break;
            default:
                break;
        }

        payService.getDetailCharts(query, type).then(res => {
            store.helper.updateData('loading2', false);
            if (!publicUtils.isOk(res)) return
            this.init_jiaoyiliang(res.data.result.keys, res.data.result.trades)
            this.init_pingjunhaoshi(res.data.result.keys, res.data.result.times)
        })
    }

    init_jiaoyiliang(x = [], data = []) {
        var myChart = echarts.init(this.jiaoyiliang);
        // 绘制图表

        let option = {
            title: {
                text: '交易量'
            },
            dataZoom: [{
            }, {
                type: 'inside'
            }],
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: x
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data,
                type: 'line'
            }],
            color: '#ec7c31'
        };

        myChart.setOption(option);
    }

    init_pingjunhaoshi(x = [], data = []) {
        var myChart = echarts.init(this.pingjunhaoshi);
        // 绘制图表

        let option = {
            title: {
                text: '平均耗时'
            },
            dataZoom: [{
            }, {
                type: 'inside'
            }],
            xAxis: {
                type: 'category',
                data: x
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data,
                type: 'line'
            }],
            color: '#ec7c31'
        };

        myChart.setOption(option);
    }

    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    {/* <PageHeader meta={this.props.meta} /> */}
                    <div className="pageContent charts-main">
                        <div className="clearfix" style={style.searchPanel}>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>统计周期 :</span>
                                <DatePicker.RangePicker
                                    size='small'
                                    allowClear={false}
                                    defaultValue={[moment(store.helper.getData.query.startTime, 'YYYY-MM-DD hh:mm'), moment(store.helper.getData.query.endTime, 'YYYY-MM-DD hh:mm')]}
                                    format={'YYYY-MM-DD'}
                                    onChange={(date, dateString) => {
                                        console.log('date, dateString', date, dateString)
                                        let query = { startTime: `${dateString[0]} 00:00`, endTime: `${dateString[1]} 00:00` }
                                        store.helper.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary" onClick={() => {
                                    this.getData();
                                    this.getDetailChartsForApi();
                                }}>查询</Button>
                            </div>
                        </div>


                        <Spin spinning={
                            this.props.match.path === '/business/pay/esb' ? false :
                                store.helper.getData.loading
                        } size="large" >
                            {
                                this.props.match.path === '/business/pay/esb' ?

                                    <DiagramDetailESB
                                        data={(() => {
                                            let data = [];
                                            DiagramDetailData.forEach((el, i) => {
                                                let title = `支付系统ESB节点${i + 1}`
                                                data.push({
                                                    title: title,
                                                    count: el.tradeCount,
                                                    time: el.avg_time,
                                                    ip: el.hostIp,
                                                    service: [
                                                        {
                                                            name: 'aaa',
                                                            totalCount: 0,
                                                            avgTime: 0
                                                        },
                                                        {
                                                            name: 'bbb',
                                                            totalCount: 0,
                                                            avgTime: 0
                                                        },
                                                        {
                                                            name: 'ccc',
                                                            totalCount: 0,
                                                            avgTime: 0
                                                        }
                                                    ]
                                                })
                                            })
                                            return data
                                        })()}
                                    />

                                    :

                                    <DiagramDetail
                                        data={(() => {
                                            let data = [];
                                            store.data.getData.forEach((el, i) => {
                                                let title = '';
                                                switch (this.props.match.path) {
                                                    case '/business/pay/pre':
                                                        title = `支付系统前置节点${i + 1}`
                                                        break;
                                                    case '/business/pay/unit':
                                                        title = `支付系统联机节点${i + 1}`
                                                        break;
                                                    case '/business/pay/esb':
                                                        title = `支付系统ESB节点${i + 1}`
                                                        break;
                                                    default:
                                                        break;
                                                }
                                                data.push({
                                                    title: title,
                                                    count: el.tradeCount,
                                                    time: el.avg_time,
                                                    ip: el.hostIp
                                                })
                                            })
                                            return data
                                        })()}
                                    />
                            }

                        </Spin>

                        <Row style={{ marginBottom: '40px' }}>
                            <Col span={24}>
                                <TimeUnit value={store.helper.getData.timeUnit} callBack={(value) => {
                                    store.helper.updateData('timeUnit', value);
                                    //todo 调接口
                                    this.getDetailChartsForApi();
                                }} />
                            </Col>

                            <Row style={{ margin: '10px 0 40px 0' }} gutter={10}>
                                <Col span={12}>
                                    <Spin spinning={store.helper.getData.loading2} size="large">
                                        <div ref={el => this.jiaoyiliang = el} style={{ width: '100%', height: '300px' }}></div>

                                    </Spin>
                                </Col>
                                <Col span={12}>
                                    <Spin spinning={store.helper.getData.loading2} size="large">
                                        <div ref={el => this.pingjunhaoshi = el} style={{ width: '100%', height: '300px' }}></div>

                                    </Spin>
                                </Col>
                            </Row>


                        </Row>
                        <Divider orientation="left">日志</Divider>
                        <Row style={{ marginBottom: '40px' }}>
                            <Col span={24}>
                                <Code sqlCode={log} type={1} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Pre

const style = {
    searchPanel: {
        marginBottom: '40px'
    },
    searchShell: {
        margin: '0px 30px 10px 0px',
        width: 'fit-content',
        float: 'left',
        height: '25px'
    },
    searchTitle: {
        height: '21px',
        lineHeight: '21px',
        display: 'inline-block',
        marginRight: '5px'
    }
}

const DiagramDetailData = [
    {
        title: '支付系统ESB节点1',
        count: 200,
        time: 20,
        ip: '96.0.56.198',
        service: []
    },
    {
        title: '支付系统ESB节点1',
        count: 200,
        time: 20,
        ip: '96.0.56.198',
        service: []
    },
    {
        title: '支付系统ESB节点1',
        count: 200,
        time: 20,
        ip: '96.0.56.198',
        service: []
    }
]

const log = `2019-08-15 18:30:00,042 INFO  [THREAD-POOL-ICITICServer-25871]com.icitic.fusion.container.web.interceptor.LoggerInterceptor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - path:/mfe4nepcc/provider, request:{}
2019-08-15 18:30:00,044 INFO  [THREAD-POOL-ICITICServer-25871]com.icitic.fusion.mfe4nepcc.provider.controller.TextController 7663224042502925 172.18.9.237  /mfe4nepcc/provider - service code:[8006200000101]
2019-08-15 18:30:00,044 INFO  [THREAD-POOL-ICITICServer-25871]com.icitic.fusion.mfe4nepcc.provider.controller.TextController 7663224042502925 172.18.9.237  /mfe4nepcc/provider - ȫȳ±¨τ xml:<?xml version="1.0" encoding="UTF-8"?><service><SYS_HEAD><SvcCd>80062000001</SvcCd><SvcScn>01</SvcScn><CnsmrId>NPS</CnsmrId><TxnDt>20190815</TxnDt><TxnTm>182959</TxnTm><SplrId>MPS</SplrId></SYS_HEAD><APP_HEAD><array></array><array></array></APP_HEAD><LOCAL_HEAD><HVerNo>02</HVerNo><HMsgCd>NPS.142.001.01</HMsgCd><HIttBankNo>900584000014</HIttBankNo><HRecvBrchNo>402581090008</HRecvBrchNo><HCmmLvlFlgNo>BBE12983839</HCmmLvlFlgNo><HFmtTp>AA</HFmtTp><HResvFldInfo>B</HResvFldInfo><HCallMd>ASYN</HCallMd></LOCAL_HEAD><BODY><MsgIndNo>201908166612983839</MsgIndNo><MsgSndTm>2019-08-15T18:29:59</MsgSndTm><DtlBizTotalCnt>1</DtlBizTotalCnt><StlmtModeTp>CLRG</StlmtModeTp><BizTp>D200</BizTp><TermToTermIndNo>2019081561510378243561410300804</TermToTermIndNo><DtlFlgNo>201908166612983839</DtlFlgNo><CurrSignNo>CNY</CurrSignNo><TransAmt>1000.00</TransAmt><BrrTp>CRED</BrrTp><PayeeName>΢хת֋</PayeeName><PayeeAcctNo>1000050101</PayeeAcctNo><PayeeBankAcctNo>900584000014</PayeeBankAcctNo><PayeeMemBankNo>900584000014</PayeeMemBankNo><PayeeBankNo>900584000014</PayeeBankNo><DraweeName>0</DraweeName><DraweeAcctNo>0</DraweeAcctNo><DraweeBankAcctNo>402581090008</DraweeBankAcctNo><DraweeMemBankAcctNo>402581090008</DraweeMemBankAcctNo><DraweeBankNo>402581090008</DraweeBankNo><BizCateCd>01602</BizCateCd><array><SuppRqsInfoarray><RmkCmntInfo>/Remark/1000.00</RmkCmntInfo><AgntBankPndg>/TransFee/0.00</AgntBankPndg><CertMethod>/AuthCode/AC00</CertMethod><CertInfo>/AuthInfo/18070219003514856183</CertInfo><TransChanTp>/TranChnlTyp/07</TransChanTp><ClearingDt>/SttlmDt/2019-08-16</ClearingDt><DraweeAcctTp>/PayerAccTyp/PT05</DraweeAcctTp><PayeeAcctTp>/PayeeAccTyp/PT08</PayeeAcctTp><WebTransPlfName>/MrchntPltfrmNm/3</WebTransPlfName><OrderNo>/OrdrId/141908156151037824356</OrderNo><OrderDtlsInfo>/OrdrDesc/1|1|΢хת֋%1000050101%02%99%%0000%1#1#²Ƹ¶֧ͨ¸¶^CNY1000.00^1|</OrderDtlsInfo><NoBankPayBrchFlg>/InstgId/Z2004944000010</NoBankPayBrchFlg><NoBankPayBrchResvAcctNo>/InstgAcctId/243300133</NoBankPayBrchResvAcctNo><ResvAcctAsgnBrchFlg>/InstgAcctIssrId/Z2004944000010</ResvAcctAsgnBrchFlg><BtchNo>/BatchId/B201908150019</BtchNo></SuppRqsInfoarray></array><signature>MEYCIQCNuqsOQ8INoLA40Qxxppr+9KIGzSoVEHyRodEWMIcpwgIhAKxNpuD48cQI85F8Gb6igY/77s/JkZHIwVppXJgy9KcG</signature></BODY></service>
2019-08-15 18:30:00,044 INFO  [THREAD-POOL-ICITICServer-25871]com.icitic.fusion.mfe4nepcc.provider.service.Mfe142Service 7663224042502925 172.18.9.237  /mfe4nepcc/provider - >>>>>>>>>>>>ʵʱ½轇  - ¿ªʼ1565865000044
2019-08-15 18:30:00,045 INFO  [THREAD-POOL-ICITICServer-25871]com.icitic.fusion.mfe4nepcc.base.component.Mfe142ServiceExecuter 7663224042502925 172.18.9.237  /mfe4nepcc/provider - MFEǰ׃·�Ė§¸¶¹݀��ϱ,ȫȳхϢPayOnTimeReqVo{msgCd='NPS.142.001.01', sndAppCd='NPS', sndMbrCd='900584000014', sndDt='20190815', sndTm='182959', rcvAppCd='MPS', rcvMbrCd='402581090008', seqNb='BBE12983839', structType='AA', msgId='201908166612983839', msgSendTime='2019-08-15T18:29:59', mxNum=1, sttlmMtd='CLRG', busiType='D200', nodeId='2019081561510378243561410300804', mxId='201908166612983839', currNo='CNY', amt=1000.00, chrbr='CRED', spMmbNo='null', prior='null', pyeeName='΢хת֋', pyeeAddr='null', pyeeAcctNo='1000050101', pyeeAcctBank='900584000014', pyeeAcctBankName='null', pyeeMmbNo='900584000014', pyeeBank='900584000014', pyerName='0', pyerAddr='null', pyerAcctNo='0', pyerAcctBank='402581090008', pyerAcctBankName='null', pyerMmbNo='402581090008', pyerBank='402581090008', busiKind='01602', postscript='null', remark='1000.00', tranSmmry='null', feeAmt=0.00, authCode='AC00', authInfo='18070219003514856183', chlType='07', clearDate='2019-08-16', pyerAcctType='PT05', pyerAcctBranch='null', pyeeAcctType='PT08', pyeeAcctBranch='null', track2='null', track3='null', bookAmt=0, bookNo='null', certType='null', certNo='null', cardSeqNo='null', icData='null', panErtMode='null', termEc='null', icCondCode='null', icChkFlag='null', tranType='null', pyeeCtryNo='null', pyeeAreaNo='null', acqrrId='null', pyeeTermType='null', pyeeTermNo='null', tranDeviceInfo='null', mercName='null', mercSname='null', mercType='null', mercCertType='null', mercCertNo='null', mercChlType='null', mercNo='null', mercPlatName='3', orderNo='141908156151037824356', orderDesc='1|1|΢хת֋%1000050101%02%99%%0000%1#1#²Ƹ¶֧ͨ¸¶^CNY1000.00^1|', instgId='Z2004944000010', instgAcctId='243300133', instgIssrId='Z2004944000010', pyerTermType='null', pyerTermNo='null', acctInType='null', batchNo='B201908150019', dcFlag='null'}
2019-08-15 18:30:00,157 INFO  [THREAD-POOL-ICITICServer-25871]com.icitic.fusion.mfe4nepcc.base.component.Mfe142ServiceExecuter 7663224042502925 172.18.9.237  /mfe4nepcc/provider - MFEǰ׃·�Ė§¸¶¹݀��ϱ,ЬӦхϢPayAvailableResult{data=PayOnTimeResVo{procRecStat='PR05', rejectCode='null', rejectReason='null', bankSerial='S5170102190816181908150073596164', resMsgId='201908160062177412', hostSerial='027452411', hostDate='20190815', hostTime='063000', pyerAcctNo='6217281382900649183', platSerial='51773596164', platDate='20190815'}} BaseResult{returnCode='200', returnMsg='³ɹ¦'}
2019-08-15 18:30:00,157 INFO  [THREAD-POOL-ICITICServer-25871]com.icitic.fusion.mfe4nepcc.provider.service.Mfe142Service 7663224042502925 172.18.9.237  /mfe4nepcc/provider - >>>>>>>>>>>>ʵʱ½轇-·¢ǰѐѐºě900584000014],±¨τ±늶ºě201908166612983839],¶˵½¶˱늶ºě2019081561510378243561410300804]  - ½⋸1565865000157,ºŊ±113ms
2019-08-15 18:30:00,157 INFO  [THREAD-POOL-ICITICServer-25871]com.icitic.fusion.mfe4nepcc.provider.controller.TextController 7663224042502925 172.18.9.237  /mfe4nepcc/provider - ЬӦ±¨τ xml:<?xml version="1.0" encoding="utf-8"?><service version="2.0">
    <SYS_HEAD>
        <SvcCd>80062000001</SvcCd>
        <SvcScn>01</SvcScn>
        <CnsmrId>MPS</CnsmrId>
        <SplrId>NPS</SplrId>
        <TxnDt>20190815</TxnDt>
        <TxnTm>183000</TxnTm>
        <array>
            <Ret>
                <RetCd>000000</RetCd>
                <RetMsg>SUCCESS</RetMsg>
            </Ret>
        </array>
    </SYS_HEAD>
    <APP_HEAD/>
    <LOCAL_HEAD>
        <HVerNo>02</HVerNo>
        <HMsgCd>NPS.143.001.01</HMsgCd>
        <HIttBankNo>402581090008</HIttBankNo>
        <HRecvBrchNo>900584000014</HRecvBrchNo>
        <HCmmLvlFlgNo>201908160062177412</HCmmLvlFlgNo>
        <HRefCmmLvlFlgNo>BBE12983839</HRefCmmLvlFlgNo>
        <HFmtTp>XML</HFmtTp>
        <HMsgTranDirTp>U</HMsgTranDirTp>
        <HResvFldInfo>B</HResvFldInfo>
        <HCallMd>ASYN</HCallMd>
        <HRefCallMd>ASYN</HRefCallMd>
        <HRefOriMsgCd>NPS.142.001.01</HRefOriMsgCd>
        <HRefOriCnsmrId>NPS</HRefOriCnsmrId>
        <HRefOriIttBankNo>900584000014</HRefOriIttBankNo>
        <HRefOriTxnDt>20190815</HRefOriTxnDt>
    </LOCAL_HEAD>
    <BODY>
        <MsgIndNo>201908160062177412</MsgIndNo>
        <MsgSndTm>2019-08-15T18:30:00</MsgSndTm>
        <OriMsgIndNo>201908166612983839</OriMsgIndNo>
        <OriMsgIdNo>NPS.142.001.01</OriMsgIdNo>
        <ClearingDt>/SttlmDt/2019-08-16</ClearingDt>
        <BizRcptSt>PR05</BizRcptSt>
        <OriDtlFlgNo>201908166612983839</OriDtlFlgNo>
        <OriCurrSignNo>CNY</OriCurrSignNo>
 <OriTransAmt>1000.00</OriTransAmt>
        <OriBizTp>D200</OriBizTp>
        <OriPayeeMemBankNo>900584000014</OriPayeeMemBankNo>
        <OriPayeeBankNo>900584000014</OriPayeeBankNo>
        <DraweeMemBankAcctNo>402581090008</DraweeMemBankAcctNo>
        <DraweeBankNo>402581090008</DraweeBankNo>
        <PayeeMemBankNo>900584000014</PayeeMemBankNo>
        <PayeeBankNo>900584000014</PayeeBankNo>
        <array>
            <SuppRspInfoarray>
                <RmkCmntInfo>/Remark/1000.00</RmkCmntInfo>
                <OriBizCateCd>/BusinessKind/01602</OriBizCateCd>
                <OriTransChanTp>/TranChannelType/07</OriTransChanTp>
                <TransSeqNo>/BkTrxId/2019081551773596164</TransSeqNo>
                <SignAgmtNo>/SgnNo/18070219003514856183</SignAgmtNo>
                <DraweeAcctNo>/PyerAcctId/6217281382900649183</DraweeAcctNo>
            </SuppRspInfoarray>
        </array>
    </BODY>
</service>,ºŊ±ͳ¼ı14ms
`