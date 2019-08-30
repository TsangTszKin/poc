import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as G2 from "@antv/g2/lib/index";

let scaleConfig = {
    time: {
        alias: '时间',
    },
    count: {
        alias: '请求次数'
    }
};

class AntVChart extends Component {
    state = {
        data: this.props.data,
    };

    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.props.data) {
            // console.log('nextProps.data', nextProps.data);
            this.chart.changeData(nextProps.data);
            // this.chart.render();
        }
    }


    componentDidMount(config) {
        // 具体配置看官网doc
        // https://www.yuque.com/antv/g2-docs/api-chart
        this.chartConfig = {
            container: this.container,
            // width: 730,
            height: 270,
            forceFit: true,
            padding: { top: 20.5, right: 10, bottom: 50, left: 40 },
        };
        // console.log(chartConfig);
        let { data = [] } = this.props;
        this.chart = new G2.Chart(this.chartConfig);
        this.chart.source(data, this.props.scaleConfig);
        this.chart.axis('count', {
            grid: {
                lineStyle: {
                    stroke: '#e8e8e8',
                    lineWidth: 1,
                    lineDash: [ 10, 4 ]
                }
            }
        });
        // 使用矩形或者弧形，用面积来表示大小关系的图形，一般构成柱状图、饼图等图表。
        // https://www.yuque.com/antv/g2-docs/tutorial-geom
        this.chart.interval()
            .position('time*count')
            .color('#e44b4e')
        ;
        this.chart.render();
    }

    getRef = ref => this.container = ref;

    render() {
        return (
            <div ref={this.getRef}></div>
        );
    }
}

AntVChart.propTypes = {};

export default AntVChart;
