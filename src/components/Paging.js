import React, { Component } from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types';
import '@/styles/paging'


class Paging extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPageSize: this.props.showPageSize,
            current: 1
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pageNum !== this.props.pageNum) {
            this.setState({
                current: nextProps.pageNum
            })
        }
        if (nextProps.showPageSize !== this.props.showPageSize) {
            this.setState({
                showPageSize: nextProps.showPageSize
            })
        }
    }

    /**
     *改变后的页码及每页条数
     */
    onChange = (page, pageSize) => {
        console.log(page);
        console.log(pageSize);
        this.setState({
            current: page
        })
        this.props.changePage(page, pageSize);
    }
    /**
     *改变后的当前页码及每页要显示的条数
     */
    onShowSizeChange = (current, size) => {
        console.log(current);
        console.log(size);
        this.setState({
            showPageSize: size
        })
        this.props.changePage(current, size);
    }
    render() {
        return (
            <div className="container">
                <p className="desc">共{this.props.total}条记录 第{this.props.pageNum}/{Math.ceil(this.props.total / this.state.showPageSize)}页</p>
                <Pagination size={this.props.size} pageSize={this.state.showPageSize} showSizeChanger showQuickJumper current={this.props.pageNum} total={this.props.total} className="page" onChange={this.onChange} onShowSizeChange={this.onShowSizeChange} />
            </div>
        )
    }
}
Paging.propTypes = {
    total: PropTypes.number.isRequired,
    changePage: PropTypes.func.isRequired,
    pageNum: PropTypes.number,
    showPageSize: PropTypes.number
}
Paging.defaultProps = {
    total: 50,
    pageNum: 1,
    showPageSize: 10
}
export default Paging;