import React, { Component } from 'react'
import {observer, Provider} from 'mobx-react';
import store from '@/store/business/testing/result/Index'
import PageHeader from '@/components/PageHeader'
import '@/styles/business/rule-set/index.less'
import Details from "@/container/analysis/event/details/Index";

@observer
class TestingResult extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={ store }>
               <div>
                   <PageHeader meta={this.props.meta} />
                   <Details />
               </div>
            </Provider>
        )
    }
}

export default TestingResult