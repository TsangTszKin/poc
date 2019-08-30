import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as G2 from "@antv/g2/lib/index";
import common from '@/utils/common';
import { withRouter } from "react-router-dom";

const data11 = [{
    item: 'null',
    count: 0,
    percent: 0
}];

@withRouter
class AntVChartPie extends Component {
    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.props.data) {
            // console.log(nextProps.data);
            this.chart.changeData(nextProps.data);
        }
    }


    componentDidMount() {
        // 具体配置看官网doc
        // https://www.yuque.com/antv/g2-docs/api-chart
        const { total, data=data11 } = this.props;
        const chartConfig = {
            container: this.container,
            // width: 530,
            height: 350,
            forceFit: true,
            padding: { top: 0, right: 270, bottom: 10, left: 10 },
        };
        // console.log(chartConfig);
        this.chart = new G2.Chart(chartConfig);
        // if(common.isEmpty(data)) return ;
        this.chart.source(data, {
            percent: {
                formatter: function formatter(val) {
                    return `${val}%`;
                }
            }
        });
        this.chart.coord('theta', {
            radius: 1,
            innerRadius: 0.75
        });
        this.chart.tooltip({
            showTitle: false,
            // itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        // 辅助文本
        this.chart.guide().html({
            position: ['50%', '50%'],
            html: `<div style="text-align: center;width: 10em">
                       <div style="color:rgba(0,0,0,0.4);font-size: 14px;padding-bottom: 10px;">事件总数</div>
                       <span style="color:#272727;font-size:24px">${common.formatNumber(total)}</span>
                       <span style="font-size:16px;color:#6d6d6d">次</span>
                   </div>`,
            alignX: 'middle',
            alignY: 'middle'
        });
        // 设置图例
        // https://www.yuque.com/antv/g2-docs/tutorial-legend#z27raz
        this.chart.legend({
            position: 'right-top', // 设置图例的显示位置
            // itemGap: 20, // 图例项之间的间距
            offsetX: 15, // 这里设置会出现双倍offsetX，也许是useHtml的bug吧
            offsetY: 30,
            useHtml: true,
            containerTpl: `<div class="g2-legend">
                               <table class="g2-legend-list" style="list-style-type:none;margin:0;padding:0;"></table>
                           </div>`,
            itemTpl: (value, color, checked, index) => {
                const obj = data[index];
                checked = checked ? 'checked' : 'unChecked';
                return '<tr class="g2-legend-list-item item-' + index + ' ' + checked +
                    '" data-value="' + value + '" data-color=' + color +
                    ' style="cursor: pointer;font-size: 14px;height: 40px;">' +
                    '<td width="150" style="border: none;padding:0;"><i class="g2-legend-marker" style="width:10px;height:10px;display:inline-block;margin-right:10px;background-color:' + color + ';"></i>' +
                    `<span class="g2-legend-text" style="color: #5a5a5a;">${obj.name}</span>` +
                    '<span class="g2-legend-text" style="border-left: 1px solid #e9e9e9;margin-left: 8px;padding-left: 8px;color: rgba(0, 0, 0, 0.42)">' + obj.percent + '%</span></td>' +
                    '<td width="60" style="text-align: right;border: none;padding:0;color: rgba(0, 0, 0, 0.65)">' + common.formatNumber(obj.count) + '次</td>' +
                    '</tr>';

            },
            // 必须要有两个以上图例才会触发点击效果
            // https://www.yuque.com/antv/g2-docs/tutorial-chart-event
            // onClick: (e) => {
            //     let {checked, currentTarget, item} = e;
            //     console.log('e', e)
            // }
        });
        let interval = this.chart.intervalStack()
            .position('percent')
            .color('item')
            // .label('percent', {
            //     formatter: function formatter(val, item) {
            //         return item.point.item + ': ' + val;
            //     }
            // })
            .tooltip('item*percent', function (item, percent) {
                return {
                    name: item,
                    value: `${percent}%`
                };
            })
            .style({
                // 间隔距离
                lineWidth: 5,
                stroke: '#fff'
            });
        // 如果要点击饼图跳转
        // https://www.yuque.com/antv/g2-docs/tutorial-chart-event#8ce6ecb4
        this.chart.on('interval:click', e => {
            console.log(e);
            this.props.history.push(`/analysis/event/home/${e.data._origin.item}`);
        });
        this.chart.render();
        interval.setSelected(data[0]);
    }

    getRef = ref => this.container = ref;

    render() {
        return (
            <div ref={this.getRef}></div>
        );
    }
}

AntVChartPie.propTypes = {
    data: PropTypes.object.isRequired,
    total: PropTypes.number.isRequired
};

export default AntVChartPie;
