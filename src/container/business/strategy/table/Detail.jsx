import React, { Component } from 'react';
import DecisionTablePanel from "@/components/common/DecisionTablePanel";
import FormButtonGroupCommon from '@/components/FormButtonGroupCommon';
import PageHeader from "@/components/business/strategy-package/page-header";
import { withRouter } from "react-router-dom";

@withRouter
class Detail extends Component {
    state = {
        currentId: '',
        versionList: [],
    };

    componentDidMount() {
        this.setState({
            currentId: this.props.match.params.id
        });

    }

    onGetVersionList = versionList => {
        this.setState({ versionList });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.id !== prevState.currentId) {
            return {
                currentId: nextProps.match.params.id
            };
        }
        return null;
    }

    onGetSqlCallback = sqlCode => {
        this.setState({ sqlCode });
    };

    onGetTest = inspectVarSet => {
        this.setState({ inspectVarSet });
    };

    render() {
        return (
            <div className="panel">
                <PageHeader
                    testParams={ {
                        decisionTableId: this.props.match.params.id,
                    } }
                    meta={ this.props.meta }
                    versions={ this.state.versionList }
                    changePath="/business/strategy/table/detail/"
                    sqlCode={ this.state.sqlCode }
                    inspectVarSet={ this.state.inspectVarSet }
                    // auth={{
                    //     test: publicUtils.isAuth("business:release:package:view"),
                    //     sql: publicUtils.isAuth("business:release:package:edit"),
                    //     version: publicUtils.isAuth("business:release:package:edit"),
                    // }}
                >
                    {/*<div className="header-status">*/ }
                    {/*    <Status statusCode={this.state.result.status} />*/ }
                    {/*    <Divider type="vertical" />*/ }
                    {/*    <Status statusCode={this.state.result.auditStatus} />*/ }
                    {/*</div>*/ }
                </PageHeader>
                <div className="page-content">
                    <DecisionTablePanel id={ this.state.currentId } from="scoreCardView"
                                        onGetVersionList={ this.onGetVersionList } onGetSql={ this.onGetSqlCallback }
                                        onGetTest={ this.onGetTest }/>
                </div>
                <FormButtonGroupCommon
                    isShowSaveBtn={ false }
                    cancelText="返回"
                    cancelCallBack={ () => this.props.history.push("/business/strategy/table") }
                />
            </div>

        );
    }
}

export default Detail;