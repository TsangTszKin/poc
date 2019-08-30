import React, {Component} from 'react';
import ScoreCardPanel from "@/components/common/ScoreCardPanel";
import FormButtonGroupCommon from '@/components/FormButtonGroupCommon';
import PageHeader from "@/components/business/strategy-package/page-header";
import {withRouter} from "react-router-dom";

@withRouter
class Detail extends Component {
    state = {
        currentId: '',
        versionList: [],
    }

    componentDidMount() {
        this.isResource = this.props.match.path === '/business/release/score-card/detail/:id';
        this.setState({
            currentId: this.props.match.params.id
        });

    }

    onGetVersionList = versionList => {
        // 策略包评分卡资源详情也是用这个组件显示，但不显示版本列表
        if (!this.isResource) this.setState({ versionList });
    }

    onGetSqlCallback = sqlCode => {
        this.setState({sqlCode});
    }

    onGetTest = inspectVarSet => {
        this.setState({inspectVarSet});
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.id !== prevState.currentId) {
            return {
                currentId: nextProps.match.params.id
            }
        }
        return null;
    }

    render() {
        return (
            <div className="panel">
                <PageHeader
                    testParams={ { scoreCardId: this.props.match.params.id } }
                    meta={this.props.meta}
                    versions={this.state.versionList}
                    changePath="/business/strategy/card/detail/"
                    sqlCode={this.state.sqlCode}
                    inspectVarSet={this.state.inspectVarSet}
                    // auth={{
                    //     test: publicUtils.isAuth("business:release:package:view"),
                    //     sql: publicUtils.isAuth("business:release:package:edit"),
                    //     version: publicUtils.isAuth("business:release:package:edit"),
                    // }}
                >
                    {/*<div className="header-status">*/}
                    {/*    <Status statusCode={this.state.result.status} />*/}
                    {/*    <Divider type="vertical" />*/}
                    {/*    <Status statusCode={this.state.result.auditStatus} />*/}
                    {/*</div>*/}
                </PageHeader>
                <div className="page-content">
                    <ScoreCardPanel id={this.state.currentId} from="scoreCardView"
                                    onGetVersionList={this.onGetVersionList} onGetSql={this.onGetSqlCallback}
                                    onGetTest={this.onGetTest}/>
                </div>
                <FormButtonGroupCommon
                    isShowSaveBtn={false}
                    cancelText="返回"
                    cancelCallBack={() => this.props.history.push("/business/strategy/card")}
                />
            </div>

        );
    }
}

export default Detail;