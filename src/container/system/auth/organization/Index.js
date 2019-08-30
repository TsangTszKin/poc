/*
 * @Author: zengzijian
 * @Date: 2019-01-14 09:21:51
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:35:32
 * @Description: 
 */
import React from 'react';
import { Row, Col } from 'antd';
import publicUtils from '@/utils/publicUtils';
import store from '@/store/system/auth/organization/Index';
import { observer, Provider } from 'mobx-react';
import PageHeader from '@/components/PageHeader';
import FormHeader from '@/components/FormHeader';
import Catalog from '@/components/system/auth/organization/Catalog';
import Info from '@/components/system/auth/organization/Info';
import AddAndSub from '@/components/AddAndSub';

@observer
class Organization extends React.Component {
    constructor(props) { super(props) }

    componentDidMount() {
        store.getTreeForApi();
    }

    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <FormHeader title="机构配置" >
                        </FormHeader>
                        <Row style={{ height: '100%', marginTop: '20px' }}>
                            <Col xs={12} sm={12} md={12} lg={7} xl={5} style={{ height: '100%' }} id="left">
                                {publicUtils.isAuth("system:organization:edit") ? <AddAndSub
                                    style={{ height: '20px', lineHeight: '20px', width: 'fit-content', padding: '0', margin: '0' }}
                                    type="add"
                                    add={() => { store.addOneMenu(0) }}
                                />
                                    : ''}
                                <Catalog />

                            </Col>
                            <Col xs={12} sm={12} md={12} lg={17} xl={19} style={{ height: '100%', borderLeft: '1px solid rgb(232, 232, 232)', marginTop: '-20px' }} id="right">
                                <Info />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Provider>
        )
    }
}
export default Organization