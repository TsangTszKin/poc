import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Spin } from 'antd'
import '@/styles/loading.less'

@withRouter
@inject('GlobalStore')
@observer
class Loading extends Component {
    componentDidUpdate() {
        if (this.props.GlobalStore.getIsLoading) {
            setTimeout(() => {
                this.props.GlobalStore.setIsLoading(false)
            }, 100)
        }
    }
    componentWillReceiveProps() {
        this.props.GlobalStore.setIsLoading(true)
        // console.log(process.env.NODE_ENV);
        // alert(process.env.NODE_ENV);
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.location.pathname != nextProps.location.pathname) {
            return true
        }
    }
    render() {
        return (
            <Spin tip='LOADING' wrapperClassName='Loading_wrap' spinning={this.props.GlobalStore.getIsLoading}>
                {this.props.children}
            </Spin>
        )
    }
}

export default Loading