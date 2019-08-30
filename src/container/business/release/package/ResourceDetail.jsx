import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from 'store/business/release/package/ResourceDetail';
import { observer, Provider } from "mobx-react";
import { withRouter } from "react-router-dom";
import strategyService from "@/api/business/strategyService";
import publicUtils from "@/utils/publicUtils";
import SaveCount from "@/container/business/variable/derivation/SaveCount";
import SaveFunc from "@/container/business/variable/derivation/SaveFunc";
import SaveRegular from "@/container/business/variable/derivation/SaveRegular";


@withRouter
@observer
class ResourceDetail extends Component {
    state = {
        content: ''
    }

    componentDidMount() {
        this.id = this.props.match.params.id;
        this.resourceType = this.props.match.params.resourceType;
        console.log('this.resourceType', this.resourceType);
        let content;
        store.detail.setId(this.props.match.params.id);
        strategyService.getResourceDetail(this.id).then(res => {
            if (!publicUtils.isOk(res)) return ;
            console.log(res.data);
            if (String(this.resourceType) === '2') {
                const result = res.data.result;
                console.log('result', result);
                if (result.type === 0) {
                    console.log(0);
                    this.setState({
                        content: <SaveCount resource={ result } meta={ this.props.meta } />
                    });
                } else if (result.type === 1) {
                    console.log(111);
                    this.setState({
                        content: <SaveRegular resource={ result } meta={ this.props.meta } />
                    });
                } else if (result.type === 2) {
                    console.log(222);
                    this.setState({
                        content: <SaveFunc resource={ result } meta={ this.props.meta } />
                    });
                }
            }
        })
    }

    render() {

        return (
            <Provider resourceStore={ store }>
                <div>
                    { this.state.content }
                </div>
            </Provider>
        );
    }
}

ResourceDetail.propTypes = {};

export default ResourceDetail;
