import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as G2 from "@antv/g2/lib/index";
import common from "@/utils/common";



class AntVLine extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data || nextProps.dataType !== this.props.dataType) {
            this.chart.changeData(nextProps.data);
        }
    }


    componentDidMount() {
        // 具体配置看官网doc
        // https://www.yuque.com/antv/g2-docs/api-chart
        let { data, config } = this.props;
        // console.log(config);
        const chartConfig = {
            container: this.container,
            // width: 810,
            // height: 530,
            forceFit: true,
            padding: { top: 20.5, right: 20, bottom: 45, left: 40 },
        };
        // console.log(chartConfig);
        // console.table(data);
        this.chart = new G2.Chart(chartConfig);
        this.chart.source(data, {
            time: {
                alias: '时间'
            },
            count: {
                alias: config.count
            }
        });
        this.chart.axis('count', {
            grid: {
                lineStyle: {
                    stroke: '#e8e8e8',
                    lineWidth: 1,
                    lineDash: [ 10, 4 ]
                }
            }
        });
        this.chart.scale({
            time: {
                alias: config.time
            },
            count: {
                alias: config.count
            },
        })
        this.chart.tooltip({
            crosshairs: {
                type: 'line'
            }
        });
        this.chart.line()
            .position('time*count')
            .color('#ff6600')
            // .tooltip(`time*count`, (time, count) => {
            //     return {
            //         name: config.count,
            //         value: count,
            //     };
            // })
        ;
        // 显示节点
        // chart.point().position('year*value').size(4).shape('circle').style({
        //     stroke: '#fff',
        //     lineWidth: 1
        // });
        this.chart.render();
    }

    getRef = ref => this.container = ref;

    render() {
        return (
            <div ref={this.getRef}></div>
        );
    }
}

AntVLine.propTypes = {};

export default AntVLine;
