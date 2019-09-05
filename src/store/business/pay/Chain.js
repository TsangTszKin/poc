/*
 * @Author: zengzijian
 * @Date: 2019-08-26 14:17:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 20:21:33
 * @Description: 
 */
import { observable, toJS, action } from 'mobx'
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils'
import payService from '@/api/business/payService'

class store {
    constructor() {
        this.reset = this.reset.bind(this);
        this.retDetail = this.retDetail.bind(this);
        this.getChainListForApi = this.getChainListForApi.bind(this);
        this.getChainDetailForApi = this.getChainDetailForApi.bind(this);
    }

    /**
     *列表公共参数
     */
    @observable list = {
        data: {
            dataSource: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            loading: true,
            selectedRowKeys: [],
            query: { startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime(), userAccount: '', userName: '' },
            timeUnit: 60
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value
        },
        updateData(key, value) {
            this.data[key] = value
        }
    }

    @observable detail = {
        data: {
            data: common.deepClone(detailNodeDemo),
            log: '',
            visible: false,
            step: ''
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value
        },
        updateData(key, value) {
            this.data[key] = value
        }
    }

    reset() {
        this.list.setData({
            dataSource: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            loading: true,
            selectedRowKeys: [],
            query: { startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime(), userAccount: '', userName: '' },
            timeUnit: 60
        })
    }

    retDetail() {
        this.detail.updateData('data', common.deepClone(detailNodeDemo))
        this.detail.updateData('log', '')
        this.detail.updateData('step', '')
    }

    getChainListForApi() {
        this.list.updateData('loading', true);
        payService.getChainList(this.list.getData.pageNum, this.list.getData.pageSize, this.list.getData.query).then(this.getChainListForApiCallBack)
    }
    @action.bound getChainListForApiCallBack(res) {
        this.list.updateData('loading', false);
        if (!publicUtils.isOk(res)) return

        let pageNum = res.data.pageList.sum === 0 ? this.list.getData.sum : ++res.data.pageList.curPageNO;
        let total = res.data.pageList.sum;
        let dataSource = res.data.pageList.resultList;
        this.list.updateData('pageNum', pageNum);
        this.list.updateData('total', total);
        this.list.updateData('dataSource', dataSource);
    }

    getChainDetailForApi(tradeNo) {
        this.retDetail();
        common.loading.show();
        payService.getPayFindByTradeNoList({ 'tradeNo': tradeNo }).then(this.getChainDetailForApiCallBack)
    }
    @action.bound getChainDetailForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return

        let detail = {}

        if (!common.isEmpty(res.data.result)) {

            let front = res.data.result.find(el => el.clusterSign === 'front');
            if (!front) {
                front = common.deepClone(detailNodeDemo)
                front.clusterSign = 'front'
            }
            front.logFile = frontLog
            detail.front = front

            let online = res.data.result.find(el => el.clusterSign === 'online');
            if (!online) {
                online = common.deepClone(detailNodeDemo)
                online.clusterSign = 'online'
            }
            online.logFile = onlineLog
            detail.online = online

            let ESB = res.data.result.find(el => el.clusterSign === 'ESB');
            if (!ESB) {
                ESB = common.deepClone(detailNodeDemo)
                ESB.clusterSign = 'ESB'
            }
            ESB.logFile = esbLog
            detail.ESB = ESB
        } else {
            detail = common.deepClone(detailNodeDemo)
        }

        this.detail.updateData('data', detail)
    }
}
export default new store

const detailNodeDemo = {
    front: {
        "id": "1",
        "beginDate": "",
        "endDate": "",
        "takeTimes": 0,
        "finishFlag": 0,
        "hostIp": "",
        "sourceIp": "",
        "tradeNo": "",
        "processId": "",
        "logFile": "",
        "content": "",
        "clusterSign": "front",
        "uuid": "",
        "snum": 0
    },
    online: {
        "id": "1",
        "beginDate": "",
        "endDate": "",
        "takeTimes": 0,
        "finishFlag": 0,
        "hostIp": "",
        "sourceIp": "",
        "tradeNo": "",
        "processId": "",
        "logFile": "",
        "content": "",
        "clusterSign": "online",
        "uuid": "",
        "snum": 0
    },
    ESB: {
        "id": "1",
        "beginDate": "",
        "endDate": "",
        "takeTimes": 0,
        "finishFlag": 0,
        "hostIp": "",
        "sourceIp": "",
        "tradeNo": "",
        "processId": "",
        "logFile": "",
        "content": "",
        "clusterSign": "ESB",
        "uuid": "",
        "snum": 0
    },
}



const frontLog = `2019-08-15 18:30:00,042 INFO  [THREAD-POOL-ICITICServer-25871]com.icitic.fusion.container.web.interceptor.LoggerInterceptor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - path:/mfe4nepcc/provider, request:{}
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

const onlineLog = `2019-08-15 18:30:00,113 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.alibaba.dubbo.rpc.filter.AccessLogFilter 7663224042502925 172.18.9.237  /mfe4nepcc/provider -  [DUBBO] [2019-08-15 18:30:00] 172.18.1.102:57254 -> 172.18.1.104:30903 - com.icitic.fusion.risk4nepcc.verify.api.IVerifyRiskProvider:1.0.0 verifyLimitAndAuthWithSerial(com.icitic.fusion.risk4nepcc.verify.vo.VerifyLimitAndAuthReqVo) [{"acctNo":"80010001321040198","busiKind":"01602","cardNo":"6217281382900649183","chlAlias":"TPS","chlBusiType":"11111000000000000000000000000000","chlDate":"20190815","chlName":"财付通","chlNo":"408017","chlSerial":"51773596164","corporationCode":"1308","dayAmtLimit":20000,"limitType":"2","monthAmtLimit":0,"platDate":"20190815","singleAmtLimit":20000,"tranAmt":1000.00}], dubbo version: 2.5.7, current host: 172.18.1.104
2019-08-15 18:30:00,113 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.verify.service.VerifyLimitAndAuthServiceExecutor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - 限额和权限认证开始，VerifyLimitAndAuthReqVo[VerifyLimitAndAuthReqVo{limitType='2', cardNo='6217281382900649183', acctNo='80010001321040198', corporationCode='1308', tranAmt=1000.00, singleAmtLimit=20000, dayAmtLimit=20000, monthAmtLimit=0, openBranch='null', platDate='20190815', chlNo='408017', chlDate='20190815', chlSerial='51773596164', busiKind='01602', chlName='财付通', chlAlias='TPS', chlBusiType='11111000000000000000000000000000'}]
2019-08-15 18:30:00,114 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.base.component.BaseComponent 7663224042502925 172.18.9.237  /mfe4nepcc/provider - >>>>>>>>>根据key[NCS4NEPCC:NCS.PLAT.PARA:PARA.INDEX:100001]从redis获取到平台日期platDate=[20190815]
2019-08-15 18:30:00,115 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.base.component.BaseComponent 7663224042502925 172.18.9.237  /mfe4nepcc/provider - >>>>>>>>>根据key[channelkey_2]从redis获取到渠道对象chlEnumResVo=[NcsChlInfo{ bankNo='900584000014' bankName='财付通（网联）' bankType='1' chlNo='2' chlAlias='TPS' chlName='财付通' chlStatus='1' chlBusiType='11111000000000000000000000000000' debitPrmptCd='3D' creditPrmptCd='8888' debitErrPrmpt='3J' creditErrPrmpt='null' riskTranCode='TC_PAY' changeDate ='20180702' remark='手工新增' memo1='null' memo2='null' memo3='null'}]
2019-08-15 18:30:00,115 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.verify.service.VerifyLimitAndAuthServiceExecutor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - 卡号[6217281382900649183]，渠道[财付通]的网上支付权限校验通过>>>>
2019-08-15 18:30:00,117 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.verify.service.VerifyLimitAndAuthServiceExecutor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - 卡号[6217281382900649183]，渠道[财付通]，交易金额[1000.00]的单笔交易限额校验通过>>>>
2019-08-15 18:30:00,121 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.verify.service.VerifyLimitAndAuthServiceExecutor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - 累计限额前，redisCardLimitTotKey[RISK4NEPCC:COUNT:TPS:6217281382900649183:201908],累计发生额对象redisLimitModel[RedisLimitModel{dayTotAmt=600.20, monthTotAmt=0.00, updateDate='20190805', updateDetailDate='20190805222531', machineTime='20190805222531', specialDayTotAmt=0.00, specialMonthTotAmt=0.00}]
2019-08-15 18:30:00,122 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.verify.service.VerifyLimitAndAuthServiceExecutor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - redis中累计限额的更新时间[20190805]与当前平台日期[20190815]不一致，日累计限额[600.20]重置为0>>>>
2019-08-15 18:30:00,122 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.verify.service.VerifyLimitAndAuthServiceExecutor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - 日限额校验通过，reqVo[VerifyLimitAndAuthReqVo{limitType='2', cardNo='6217281382900649183', acctNo='80010001321040198', corporationCode='1308', tranAmt=1000.00, singleAmtLimit=20000, dayAmtLimit=20000, monthAmtLimit=0, openBranch='null', platDate='20190815', chlNo='408017', chlDate='20190815', chlSerial='51773596164', busiKind='01602', chlName='财付通', chlAlias='TPS', chlBusiType='11111000000000000000000000000000'}]
2019-08-15 18:30:00,124 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.verify.service.VerifyLimitAndAuthServiceExecutor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - 累计发生额存入redis结束，key[RISK4NEPCC:COUNT:TPS:6217281382900649183:201908],value[RedisLimitModel{dayTotAmt=1000.00, monthTotAmt=0.00, updateDate='20190815', updateDetailDate='20190815183000', machineTime='20190815183000', specialDayTotAmt=0, specialMonthTotAmt=0.00}],有效期[2764800],单位秒>>>
2019-08-15 18:30:00,125 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.verify.service.VerifyLimitAndAuthServiceExecutor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - 限额认证交易信息存入redis结束，key[RISK4NEPCC:INFO:408017:20190815:51773596164],value[RedisOriLimitModel{busiClass='TPS', cardNo='6217281382900649183', txAmt='1000.00', chnNo='408017', chnDate='20190815', chnSeq='51773596164', platDate='20190815', redisCardLimitTotKey='RISK4NEPCC:COUNT:TPS:6217281382900649183:201908', machineTime='20190815183000', status='0'}],有效期[90000],单位秒>>>
2019-08-15 18:30:00,126 INFO  [DubboServerHandler-172.18.1.104:30903-thread-1493]com.icitic.fusion.risk4nepcc.verify.service.VerifyLimitAndAuthServiceExecutor 7663224042502925 172.18.9.237  /mfe4nepcc/provider - 限额和权限认证结束，result[Risk4nepccAvailabeResult{data=VerifyLimitAndAuthResVo{limitType='2', cardNo='6217281382900649183', corporationCode='1308', tranAmt=1000.00, singleAmtLimit=20000, dayAmtLimit=20000, monthAmtLimit=-1, openBranch='null', platDate='20190815', dayTotAmt=1000.00, monthTotAmt=0.00, chlNo='408017', chlDate='20190815', chlSerial='51773596164'}} BaseResult{returnCode='200', returnMsg='成功'}],耗时13ms`


const esbLog = `2019-08-16 09:38:17,059 [pool-FrameExecutor-in201] [com.dc.esb.container.service.ServiceIdentifyService] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - 服务识别 花费时间为: 0毫秒
2019-08-16 09:38:17,060 [pool-FrameExecutor-in201] [com.dc.esb.container.service.FlowLogService] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - 流水服务 花费时间为: 0毫秒
2019-08-16 09:38:17,068 [pool-FrameExecutor-in201] [com.dc.esb.container.databinding.baseService.MessageUnpackService] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - 拆包服务 花费时间为: 8毫秒
2019-08-16 09:38:17,068 [pool-FrameExecutor-in201] [com.dc.governance.metadata.impls.runtime.XMLParser] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - contextValues is {/service/SYS_HEAD/UsrLng=
 /service/SYS_HEAD/ChnlTp=
 /service/BODY/AlgrVerNo=FACE305
 /service/BODY/BrchNo=03241
 /service/BODY/BiologyTp=4
 /service/LOCAL_HEAD/HRsrvFldName2=
 /service/APP_HEAD/TlrPswd=
 /<?xml/version=1.0
 /service/SYS_HEAD/OrigTxnDt=
 /service/APP_HEAD/TlrTp=
 /service/SYS_HEAD/CnsmrSeqNo=ECTIP2019081609381700827068
 /service/APP_HEAD=
 /service/SYS_HEAD/SvcCd=60012000005
 /service/SYS_HEAD/TxnMd=
 /service/SYS_HEAD/CnsmrId=101028
 /service/APP_HEAD/AprvInd=
 /service/BODY/AccsAcctNo=zwbd
 /service/SYS_HEAD/TxnTm=
 /service/SYS_HEAD/MacNode=
 /service/BODY/AccsPwd=123456
 /service/BODY/ManufName=tc
 /service/BODY/ChanNo=2
 /service/SYS_HEAD/TxnDt=
 /service/SYS_HEAD/TmlCd=
 /service/BODY/CertTp=
 /service=
 /service/SYS_HEAD/OrigCnsmrId=101031
 /service/SYS_HEAD/SvcScn=01
 /<?xml/encoding=UTF-8
 /service/BODY/SubSysId=2
 /service/BODY/InterfaceName=/api/recog
 /service/BODY/BizNo=2
 /service/BODY/BiologyPrcssVal=FIaMD62DK2AAEaiBBAAAtBJqAABHwqugAADYV3AAAUqMsUAAAcLKQAAFWmDHAACmTHgAABQh4wQAAo0+pYAATWhsAAAKDSmAAAAkqS4AAAtG0bgAAGrj
 /service/LOCAL_HEAD/HCustTmIpCd=
 /service/SYS_HEAD/SvcVer=
 /service/BODY/SelfDefData=
 /service/SYS_HEAD/OrigTxnTm=
 /service/APP_HEAD/BrId=
 /service/APP_HEAD/TlrLvl=
 /service/LOCAL_HEAD=
 /service/SYS_HEAD/MacValue=
 /service/LOCAL_HEAD/HRsrvFldName=
 /service/APP_HEAD/AhrInd=
 /service/BODY/VerfFlg=true
 /service/SYS_HEAD/OrigCnsmrSeqNo=00120190816093817000013242173
 /service/BODY=
 /service/SYS_HEAD=
 /service/BODY/BiologyImgInfo=
 /service/BODY/CertName=
 /service/APP_HEAD/TlrNo=}
2019-08-16 09:38:17,068 [pool-FrameExecutor-in201] [com.dc.esb.container.databinding.baseService.MessageUnpackService] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - unpack request to sdo following finish:-->

******************SDO Start Content***********************
/sdoroot/sys_head/svcscn=01
/sdoroot/sys_head/cnsmrid=101028
/sdoroot/sys_head/txnmd=
/sdoroot/body/channo=2
/sdoroot/app_head/tlrno=
/sdoroot/sys_head/tmlcd=
/sdoroot/app_head/aprvind=
/sdoroot/sys_head/macnode=
/sdoroot/app_head/tlrpswd=
/sdoroot/sys_head/svcver=
/sdoroot/body/biologyimginfo=
/sdoroot/sys_head/cnsmrseqno=ECTIP2019081609381700827068
/sdoroot/body/certname=
/sdoroot/local_head/hrsrvfldname2=
/sdoroot/app_head/tlrtp=
/sdoroot/sys_head/chnltp=
/sdoroot/app_head/tlrlvl=
/sdoroot/sys_head/origtxndt=
/sdoroot/local_head/hrsrvfldname=
/sdoroot/sys_head/txndt=
/sdoroot/sys_head/origtxntm=
/sdoroot/body/subsysid=2
/sdoroot/sys_head/origcnsmrid=101031
/sdoroot/app_head/brid=
/sdoroot/body/bizno=2
/sdoroot/body/biologyprcssval=FIaMD62DK2AAEaiBBAAAtBJqAABHwqugAADYV3AAAUqMsUAAAcLKQAAFWmDHAACmTHgAABQh4wQAAo0+pYAATWhsAAAKDSmAAAAkqS4AAAtG0bgAAGrj
/sdoroot/body/biologytp=4
/sdoroot/body/brchno=03241
/sdoroot/app_head/ahrind=
/sdoroot/body/accsacctno=zwbd
/sdoroot/sys_head/txntm=
/sdoroot/sys_head/origcnsmrseqno=00120190816093817000013242173
/sdoroot/sys_head/macvalue=
/sdoroot/body/manufname=tc
/sdoroot/sys_head/svccd=60012000005
/sdoroot/body/accspwd=123456
/sdoroot/body/algrverno=FACE305
/sdoroot/body/certtp=
/sdoroot/local_head/hcusttmipcd=
/sdoroot/body/selfdefdata=
/sdoroot/sys_head/usrlng=
/sdoroot/body/interfacename=/api/recog
******************SDO End Content***********************

2019-08-16 09:38:17,118 [pool-FrameExecutor-in201] [com.dc.esb.container.service.ConsumerClientService] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - ConsumerClientService 花费时间为: 50毫秒
2019-08-16 09:38:17,125 [pool-FrameExecutor-in201] [com.dc.esb.container.databinding.baseService.MessagePackerService] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - 组包服务 花费时间为: 7毫秒
2019-08-16 09:38:17,126 [pool-FrameExecutor-in201] [com.dc.esb.container.service.FlowLogService] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - 流水服务 花费时间为: 0毫秒
2019-08-16 09:38:17,126 [pool-FrameExecutor-in201] [com.dc.esb.container.protocol.tcp.TCPDataHandler] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - 本地端口[9058]开始和远程socket[/96.0.51.240:58368]通讯
2019-08-16 09:38:17,126 [pool-FrameExecutor-in201] [com.dc.esb.container.protocol.tcp.TCPDataHandler] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - Write by length, length of written bytes is 1429
2019-08-16 09:38:17,126 [pool-FrameExecutor-in201] [com.dc.esb.container.adaptor.protocoladaptor.ProtocolFlowAdaptor] [INFO] AP2-20190816093817-115359 6001200000501 ECTIP  - 报文:
[<?xml version="1.0" encoding="UTF-8"?><service><SYS_HEAD><SvcCd>60012000005</SvcCd><SvcScn>01</SvcScn><SvcVer></SvcVer><CnsmrId>101028</CnsmrId><CnsmrSeqNo>ECTIP2019081609381700827068</CnsmrSeqNo><ChnlTp></ChnlTp><TmlCd></TmlCd><OrigCnsmrId>101031</OrigCnsmrId><OrigCnsmrSeqNo>00120190816093817000013242173</OrigCnsmrSeqNo><SplrId>408026</SplrId><SplrSeqNo>idm1565919497081</SplrSeqNo><TxnDt>20190816</TxnDt><TxnTm>093817</TxnTm><UsrLng></UsrLng><MacNode></MacNode><TxnSt>F</TxnSt><array><Ret><RetCd>BIT-3</RetCd><RetMsg>idm调用生物平台指纹认证接口返回消息：比对失败!</RetMsg></Ret></array></SYS_HEAD><APP_HEAD><TlrNo></TlrNo><BrId></BrId><TlrLvl></TlrLvl><TlrTp></TlrTp><AprvInd></AprvInd><array><AprvTlrInf><AprvTlrNo></AprvTlrNo><AprvBrId></AprvBrId><AprvTlrLvl></AprvTlrLvl><AprvTlrTp></AprvTlrTp></AprvTlrInf><AprvTlrInf><AprvTlrNo></AprvTlrNo><AprvBrId></AprvBrId><AprvTlrLvl></AprvTlrLvl><AprvTlrTp></AprvTlrTp></AprvTlrInf></array><AhrInd></AhrInd><array><AhrTlrInf><AhrTlrNo></AhrTlrNo><AhrBrId></AhrBrId><AhrTlrLvl></AhrTlrLvl><AhrTlrTp></AhrTlrTp></AhrTlrInf><AhrTlrInf><AhrTlrNo></AhrTlrNo><AhrBrId></AhrBrId><AhrTlrLvl></AhrTlrLvl><AhrTlrTp></AhrTlrTp></AhrTlrInf></array></APP_HEAD><BODY><CertNo></CertNo><CertTp></CertTp><CertName></CertName><SelfDefData></SelfDefData><BiologyTp></BiologyTp><AlgrVerNo></AlgrVerNo><ManufName></ManufName><IdData></IdData><IdResult></IdResult></BODY></service>]`