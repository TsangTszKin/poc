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
        const { data = data11 } = this.props;
        const chartConfig = {
            container: this.container,
            // width: 530,
            height: 350,
            forceFit: true,
            padding: { top: 10, right: 270, bottom: 20, left: 0 },
        };
        // console.log(chartConfig);
        this.chart = new G2.Chart(chartConfig);
        // if(common.isEmpty(data)) return ;
        this.chart.source(data, {
            percent: {
                formatter: function formatter(val) {
                    return `${ (val * 100).toFixed(2) }%`;
                }
            }
        });
        this.chart.coord('theta');
        this.chart.tooltip({
            showTitle: false
        });
        let interval = this.chart.intervalStack()
            .position('percent')
            .color('item')
            .label('percent', {
                offset: -40,
                // autoRotate: false,
                textStyle: {
                    textAlign: 'center',
                    shadowBlur: 2,
                    shadowColor: 'rgba(0, 0, 0, .45)'
                }
            })
            .tooltip('item*percent', function (item, percent) {
                return {
                    name: item,
                    value: `${ (percent * 100).toFixed(2) }%`
                };
            })
            .style({
                lineWidth: 1,
                stroke: '#fff'
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
                    `<span class="g2-legend-text" style="color: #5a5a5a;">${obj.item}</span>` +
                    '<span class="g2-legend-text" style="border-left: 1px solid #e9e9e9;margin-left: 8px;padding-left: 8px;color: rgba(0, 0, 0, 0.42)">' + obj.percentText + '%</span></td>' +
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
        // 如果要点击饼图跳转
        // https://www.yuque.com/antv/g2-docs/tutorial-chart-event#8ce6ecb4
        // this.chart.on('interval:click', e => {
        //     console.log(e);
        //     this.props.history.push(`/analysis/event/home/${e.data._origin.item}`);
        // });
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
    data: PropTypes.object.isRequired
};

export default AntVChartPie;
