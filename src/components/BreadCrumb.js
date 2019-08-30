/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:50:51
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-07-24 15:50:51
 * @Description: 面包屑导航
 */
import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'


class BreadCrumb extends Component {
    componentDidMount() {
        // console.log(this.props.nav);
    }
    render() {
        // const nav = this.props.nav;
        // let navKeys = [];
        // nav.forEach(element => {
        //     Object.keys(element).forEach(key => navKeys.push(key));
        // });

        // function isHavePath(item, i) {
        //     if (item[navKeys[i]]) {
        //         return <Breadcrumb.Item key={i}><Link to={item[navKeys[i]]}>{navKeys[i]}</Link></Breadcrumb.Item>
        //     } else {
        //         return <Breadcrumb.Item key={i}>{navKeys[i]}</Breadcrumb.Item>
        //     }

        // }

        return (
            <Breadcrumb>
                {/* <Breadcrumb.Item><Link to="/business/home">策略中心</Link></Breadcrumb.Item> */}

                {
                    this.props.nav.map((item, i) =>
                    <Breadcrumb.Item>
                        {item.path?<Link to={item.path}>{item.name}</Link>:item.name}
                    </Breadcrumb.Item>
                    )}
            </Breadcrumb>
        )
    }
}
export default BreadCrumb