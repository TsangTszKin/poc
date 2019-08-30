import React from 'react';
import { observer, inject } from 'mobx-react';
import common from '@/utils/common';
import publiUtils from '@/utils/publicUtils';
import { Collapse, Switch, Select, Row, Col } from 'antd';
import PermissionAssignmentCopy from '@/components/system/auth/group/PermissionAssignment';

@inject('store')
@observer
class PermissionAssignment extends React.Component {
    constructor(props) {
        super(props);
        this.mapToArray = this.mapToArray.bind(this);
    }
    mapToArray(map) {
        // console.log("map", map)
        let array = [];
        for (const key in map) {
            if (map.hasOwnProperty(key)) {
                const element = map[key];
                array.push({ label: element.label, name: element.name });
            }
        }
        // console.log("array", array)
        return array
    }
    render() {
        return (
            <Collapse  bordered={false} activeKey={['1']} >
                <Collapse.Panel
                    className={common.isEmpty(this.props.item.child) ? 'power-end' : ''}
                    header={
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                {this.props.item.name}
                                <p style={{ margin: '10px 0 0 0' }}>
                                    <Switch
                                        checked={this.props.store.checkIsAuthForSwitch(this.props.item.id)}
                                        onChange={(checked) => {
                                            this.props.store.changeAuthScope(this.props.item.id, checked);
                                        }} />
                                </p>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                {common.isEmpty(this.props.item.child) ?
                                    <div>
                                        <p style={{marginBottom: '5px'}}>可用功能</p>
                                        <Select
                                            mode="multiple"
                                            style={{ width: '200px' }}
                                            onChange={(value) => {
                                                // console.log(value)
                                                console.log(`selected ${value}`);
                                                this.props.store.changeAuthScopeAction(this.props.item.id, value);
                                            }}
                                            tokenSeparators={[',']}
                                            value={this.props.store.getMultiSelectValueForAuthScope(this.props.item.id)}
                                        >
                                            {
                                                this.mapToArray(this.props.item.actions).map((item, i) =>
                                                    <Select.Option key={i} value={item.label}>{item.name}</Select.Option>
                                                )
                                            }

                                        </Select>
                                    </div> : ''
                                }
                            </Col>
                        </Row>
                    }
                    key='1'
                >
                    {
                        common.isEmpty(this.props.item.child) ? ''
                            :
                            this.props.item.child.map((item, i) =>
                                <PermissionAssignmentCopy item={item} />
                            )
                    }
                </Collapse.Panel>
            </Collapse>
        )
    }
}
export default PermissionAssignment
