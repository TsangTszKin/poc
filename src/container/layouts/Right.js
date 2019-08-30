/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:33:42
 * @Description: 
 */
import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import routerConfig from '@/config/routes';
import Loading from '@/components/loading';
import Top from './Top';
import PropTypes from 'prop-types';
import Error404 from '@/components/Error404';

@withRouter
@inject('GlobalStore')
@observer
class Right extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        // console.log("this.props.GlobalStore.menu.getTop layout right", this.props.GlobalStore.menu.getTop);
        return (

            <div className='right' style={this.props.style}>
                <Top topMenu={this.props.GlobalStore.menu.getTop} collapsed={this.props.collapsed} changeCollapsed={this.props.changeCollapsed}></Top>
                <div className='routeWrap'>

                    <Loading >
                        <Switch>
                            {routerConfig.map((item, i) =>
                                <Route key={i} path={item.path} exact render={() =>
                                    <item.component collapsed={this.props.collapsed} changeCollapsed={this.props.changeCollapsed} meta={item.meta} />
                                } >
                                </Route>
                            )}
                            <Route exact component={Error404}></Route>
                        </Switch>
                    </Loading>
                </div>
            </div >

        )
    }
}
Right.propTypes = {
    changeCollapsed: PropTypes.func,
    collapsed: PropTypes.bool
}
Right.defaultProps = {
    changeCollapsed: () => { },
    collapsed: false
}
export default Right