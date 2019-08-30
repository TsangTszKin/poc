import React from 'react';
import { observer, inject } from 'mobx-react';
import { Transfer, Button } from 'antd';
import common from '@/utils/common';
import publiUtils from '@/utils/publicUtils';
import { element } from 'prop-types';

@inject('store')
@observer
class GroupMemberAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.getKey = this.getKey.bind(this);
    }


    handleChange = (targetKeys) => {
        // this.setState({ targetKeys });
        console.log("targetKeys", targetKeys);

        let select = [];
        this.props.store.memberAdmin.getAll.forEach(element => {
            if (targetKeys.indexOf(element.id) != -1) {
                select.push(element);
            }
        })

        this.props.store.memberAdmin.setSelect(select)
    }

    getKey(list) {
        let tempArray = [];
        list.forEach(element => {
            tempArray.push(element.id);
        })
        console.log("list",list);
        console.log("tempArray", tempArray)
        return tempArray
    }

    render() {

        return (
            <Transfer
                dataSource={this.props.store.memberAdmin.getAll}
                showSearch
                listStyle={{
                    width: 250,
                    height: 300,
                }}
                operations={['加入', '移出']}
                targetKeys={this.getKey(this.props.store.memberAdmin.getSelect)}
                onChange={this.handleChange}
                render={item => `${item.nickName}（${item.userName}）`}
            />
        )
    }
}
export default GroupMemberAdmin
