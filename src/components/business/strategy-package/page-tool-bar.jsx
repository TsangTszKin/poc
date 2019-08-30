import React, {Component} from "react";
import {Button, Input, Select} from "antd";
import common from "@/utils/common";
import {withRouter} from "react-router-dom";

@withRouter
class PageToolBar extends Component {
    state = {
        keyword: ''
    };

    constructor(props) {
        super(props);

    }

    handleSearch = () => {
        this.props.handleSearch(this.state.keyword);
    };

    render() {
        return (
            <div className="pageToolBar-container">
                <div className="search">
                    <Input.Search
                        placeholder={this.props.searchPlaceholder}
                        onSearch={value => this.handleSearch()}
                        onChange={(e) => {
                            this.setState({
                                keyword: common.stripscript(e.target.value)
                            })
                        }}
                        value={this.state.keyword}
                        style={{ marginTop: '5px' }}
                        onPressEnter={this.handleSearch}
                    />
                </div>
                {
                    this.props.btnStr ? (
                            <div className="add-btn-container">
                                <Button type="primary" onClick={this.props.btnCallBack} htmlType="button">{this.props.btnStr}</Button>
                            </div>
                        ): ''
                }
                {
                    this.props.children
                }
            </ div>
        );
    }
}

export default PageToolBar;

PageToolBar.prototype = {

};