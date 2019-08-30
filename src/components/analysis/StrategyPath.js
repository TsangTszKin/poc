/*
 * @Author: zengzijian
 * @Date: 2018-10-25 10:51:33
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:08:13
 * @Description: 
 */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import common from '@/utils/common';
import { toJS } from 'mobx';
const echarts = require('echarts');


@inject('store')
@observer
class StrategyPath extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data = toJS(this.props.store.drawerData.hitNodeTree)[0];
        formatUseTimesTree(data);

        function formatUseTimesTree(obj) {
            obj.collapsed = false;
            delete obj.id;
            obj.name = `${obj.name}${getType(obj.type, obj.secondType)}${obj.hit ? '（命中）' : ''}`;
            delete obj.type;
            delete obj.secondType;
            delete obj.hit;
            delete obj.mold;
            delete obj.parentId;
            delete obj.sort;
            if (!common.isEmpty(obj.nodes)) {
                obj.children = obj.nodes;
                delete obj.nodes;
                obj.children.forEach(element => {
                    formatUseTimesTree(element);
                })
            }
        }

        function getType(type) {
            if (type == 0) {//控制节点
            } else if (type === 1) {//执行节点
            }
            return ''
        }

        console.log("data", data);

        setTimeout(() => {

            var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                series: [
                    {
                        type: 'tree',

                        data: [data],

                        top: '5%',
                        left: '200px',
                        bottom: '1%',
                        right: '200px',

                        symbolSize: 10,

                        label: {
                            normal: {
                                position: 'left',
                                verticalAlign: 'middle',
                                align: 'right',
                                fontSize: 11
                            }
                        },

                        leaves: {
                            label: {
                                normal: {
                                    position: 'right',
                                    verticalAlign: 'middle',
                                    align: 'left'
                                }
                            }
                        },

                        expandAndCollapse: true,
                        animationDuration: 300,
                        animationDurationUpdate: 600
                    }
                ]
            });


        }, 100)




        return (
            <div id="main" style={{ minHeight: '300px' }}>

            </div>
        )
    }
}

StrategyPath.propTypes = {

}

StrategyPath.defalutProps = {

}

export default StrategyPath