var chartId = 1;
var definition = "";
var nodes = [];
var role = "owner";
var cateType = "flow";
var userId = "xxxx";
var userName = "admin";
var time = "1505873895344";
var dock = "metric";
var tutorial = false;
var locale = "zh";
var showToolbar = true;
var cstatus = "private";
var dateFormat = "yyyy-MM-dd hh:mm";
var showCommentIco = true;
var localRuntime = false;
var chartVersion = 2;
var conditionVODemo = {
	"relType": 0,
	"nodeType": 2,
	"conditions": [{
		"relType": 0,
		"expressionVO": {
			"varCategoryType": 1,
			"varTableAlias": "",
			"varType": '',
			"varDataType": "",
			"varCode": "",
			"varName": "",
			"varDefaultValue": "",
			"varValue": "",

			"optType": '',

			"valueCategoryType": 0,//固定值
			"valueTableAlias": "",
			"valueType": '',
			"valueDataType": "",
			"valueCode": "",
			"valueName": "",
			"valueDefaultValue": "",
			"value": ""
		},
		"nodeType": 1
	}
	]
}


var categorys = {
	'dataSource': {
		title: '数据源节点', child: [
			{
				name: 'start',
				title: '开始',
				icon: '<img class="icon" src="/static/strategy/img/node/start.png" style="height: 18px;">',
				selected: ['control', 'branch', 'rule', 'ruleSet', 'sql', 'scoreCard', 'decisionTable'],
				status: 0,
				fontStyle: {
					fontFamily: "微软雅黑",
					size: 13,
					color: "255,255,255",
					bold: false,
					italic: false,
					underline: false,
					textAlign: "center",
					vAlign: "middle",
					orientation: "vertical"
				},
				lineStyle: {
					lineWidth: 0,
					lineColor: "228,75,78",
					lineStyle: "solid"
				},
				fillStyle: {
					type: "solid",
					color: "228,75,78"
				},
				data: {
					"eventSourceId": "",
					"eventSourceName": "",
					"dimensionId": "",
					"dimensionName": "",
					"name": "开始",
					"code": "",
					"category": '',
					"categoryName": "",
					"description": "1",
				},
				path: [{
					actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
					{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
					{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
					{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "close" }]
				}]
			}
		]
	},
	'control': {
		title: '控制节点', child: [
			{
				name: 'control',
				title: '条件',
				icon: '<img class="icon" src="/static/strategy/img/node/control.png" style="height: 18px;">',
				selected: ['control', 'branch', 'query', 'rule', 'ruleSet', 'assign', 'sql', 'scoreCard', 'decisionTable', 'output'],
				status: 0,
				fontStyle: {
					fontFamily: "微软雅黑",
					size: 13,
					color: "24, 144, 255",
					bold: false,
					italic: false,
					underline: false,
					textAlign: "left",
					vAlign: "middle",
					orientation: "vertical"
				},
				lineStyle: {
					lineWidth: 0,
					lineColor: "24, 144, 255",
					lineStyle: "solid"
				},
				fillStyle: {
					type: "solid",
					color: "227,239,250"
				},
				data: {
					"conditionNodeVO": {
						'id': '',
						'name': '条件',
						'conditionVO': conditionVODemo,
						'script': '',
						'hitId': '',
						'elseId': '',
					},
					'assemblyId': '',
					'assemblyParentId': '',
					'type': 0,
					"actionType": 1
				},
				path: [{
					actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
					{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
					{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
					{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "close" }]
				}]
			},
			{
				name: 'branch',
				title: '分支',
				icon: '<img class="icon" src="/static/strategy/img/node/branch.png" style="height: 18px;">',
				selected: ['control', 'branch', 'query', 'rule', 'ruleSet', 'assign', 'sql', 'scoreCard', 'decisionTable', 'output'],
				status: 1,
				fontStyle: {
					fontFamily: "微软雅黑",
					size: 13,
					color: "24, 144, 255",
					bold: false,
					italic: false,
					underline: false,
					textAlign: "left",
					vAlign: "middle",
					orientation: "vertical"
				},
				lineStyle: {
					lineWidth: 0,
					lineColor: "24, 144, 255",
					lineStyle: "solid"
				},
				fillStyle: {
					type: "solid",
					color: "227,239,250"
				},
				data: {
					"branchNodeVO": {
						"name": "分支",
						"branchMap": {
							// "16bdfcf4915b3c": conditionVODemo
						},
						"sort": [
							// "16bdfcf4915b3c"
						]
					},
					'assemblyId': '',
					'assemblyParentId': '',
					"type": 1,
					"actionType": 1
				},
				path: [{
					actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
					{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
					{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
					{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "close" }]
				}]
			},
		]
	},

	'execute': {
		title: '执行节点', child: [
			{
				name: 'rule',
				title: '规则',
				icon: '<img class="icon" src="/static/strategy/img/node/rule.png" style="height: 18px;">',
				selected: ['control', 'branch', 'rule', 'ruleSet', 'sql', 'scoreCard', 'decisionTable', 'output'],
				status: 1,
				fontStyle: {
					fontFamily: "微软雅黑",
					size: 13,
					color: "228, 75, 78",
					bold: false,
					italic: false,
					underline: false,
					textAlign: "left",
					vAlign: "middle",
					orientation: "vertical"
				},
				lineStyle: {
					lineWidth: 0,
					lineColor: "228, 75, 78",
					lineStyle: "solid"
				},
				fillStyle: {
					type: "solid",
					color: "247,232,233"
				},
				data: {
					"ruleNodeVO": {
						"name": "规则",
						"ruleExeId": "",
						"description": "",
						"category": '',
						"ruleCode": ""
					},
					'assemblyId': '',
					'assemblyParentId': '',
					"type": 2,
					"actionType": 1
				},
				path: [{
					actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
					{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
					{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
					{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "close" }]
				}]
			},
			{
				name: 'ruleSet',
				title: '规则集',
				icon: '<img class="icon" src="/static/strategy/img/node/ruleSet.png" style="height: 18px;">',
				selected: ['control', 'branch', 'rule', 'ruleSet', 'sql', 'scoreCard', 'decisionTable', 'output'],
				status: 1,
				fontStyle: {
					fontFamily: "微软雅黑",
					size: 13,
					color: "228, 75, 78",
					bold: false,
					italic: false,
					underline: false,
					textAlign: "left",
					vAlign: "middle",
					orientation: "vertical"
				},
				lineStyle: {
					lineWidth: 0,
					lineColor: "228, 75, 78",
					lineStyle: "solid"
				},
				fillStyle: {
					type: "solid",
					color: "247,232,233"
				},
				data: {
					"ruleSetNodeVO": {
						"name": "规则集",
						"ruleSetId": "",
						"category": '',
						"ruleSetCode": "",
						"description": "",
						"sqlCode": ""
					},
					'assemblyId': '',
					'assemblyParentId': '',
					"type": 4,
					"actionType": 1
				},
				path: [{
					actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
					{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
					{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
					{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "close" }]
				}]
			},
			{
				name: 'scoreCard',
				title: '评分卡',
				icon: '<img class="icon" src="/static/strategy/img/node/scoreCard.png" style="height: 18px;">',
				selected: ['control', 'branch', 'rule', 'ruleSet', 'sql', 'scoreCard', 'decisionTable', 'output'],
				status: 1,
				fontStyle: {
					fontFamily: "微软雅黑",
					size: 13,
					color: "228, 75, 78",
					bold: false,
					italic: false,
					underline: false,
					textAlign: "left",
					vAlign: "middle",
					orientation: "vertical"
				},
				lineStyle: {
					lineWidth: 0,
					lineColor: "228, 75, 78",
					lineStyle: "solid"
				},
				fillStyle: {
					type: "solid",
					color: "247,232,233"
				},
				data: {
					"scoreCardNodeVO": {
						"name": "评分卡",
						"scoreCardId": "",
						"description": "",
						"category": '',
						"code": ""
					},
					'assemblyId': '',
					'assemblyParentId': '',
					"type": 7,
					"actionType": 1
				},
				path: [{
					actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
					{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
					{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
					{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "close" }]
				}]
			},
			{
				name: 'decisionTable',
				title: '决策表',
				icon: '<img class="icon" src="/static/strategy/img/node/decisionTable.png" style="height: 18px;">',
				selected: ['control', 'branch', 'rule', 'ruleSet', 'sql', 'scoreCard', 'decisionTable', 'output'],
				status: 1,
				fontStyle: {
					fontFamily: "微软雅黑",
					size: 13,
					color: "228, 75, 78",
					bold: false,
					italic: false,
					underline: false,
					textAlign: "left",
					vAlign: "middle",
					orientation: "vertical"
				},
				lineStyle: {
					lineWidth: 0,
					lineColor: "228, 75, 78",
					lineStyle: "solid"
				},
				fillStyle: {
					type: "solid",
					color: "247,232,233"
				},
				data: {
					"decisionTableNodeVO": {
						"name": "决策表",
						"decisionTableId": "",
						"description": "",
						"category": '',
						"code": ""
					},
					'assemblyId': '',
					'assemblyParentId': '',
					"type": 8,
					"actionType": 1
				},
				path: [{
					actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
					{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
					{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
					{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "close" }]
				}]
			},
			{
				name: 'sql',
				title: '脚本',
				icon: '<img class="icon" src="/static/strategy/img/node/sql.png" style="height: 18px;">',
				selected: ['control', 'branch', 'rule', 'ruleSet', 'sql', 'scoreCard', 'decisionTable', 'output'],
				status: 1,
				fontStyle: {
					fontFamily: "微软雅黑",
					size: 13,
					color: "228, 75, 78",
					bold: false,
					italic: false,
					underline: false,
					textAlign: "left",
					vAlign: "middle",
					orientation: "vertical"
				},
				lineStyle: {
					lineWidth: 0,
					lineColor: "228, 75, 78",
					lineStyle: "solid"
				},
				fillStyle: {
					type: "solid",
					color: "247,232,233"
				},
				data: {
					"scriptNodeVO": {
						"name": "脚本",
						"sqlCode": "",
						"scriptId": ""
					},
					'assemblyId': '',
					'assemblyParentId': '',
					"type": 5,
					"actionType": 1
				},
				path: [{
					actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
					{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
					{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
					{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "close" }]
				}]
			},
			{
				name: 'output',
				title: '输出',
				icon: '<img class="icon" src="/static/strategy/img/node/output.png" style="height: 18px;">',
				selected: [],
				status: 1,
				fontStyle: {
					fontFamily: "微软雅黑",
					size: 13,
					color: "255,255,255",
					bold: false,
					italic: false,
					underline: false,
					textAlign: "left",
					vAlign: "middle",
					orientation: "vertical"
				},
				lineStyle: {
					lineWidth: 0,
					lineColor: "228, 75, 78",
					lineStyle: "solid"
				},
				fillStyle: {
					type: "solid",
					color: "24,144,255"
				},
				data: {
					"outPutNodeVO": {
						"name": "输出",
						"parameters": [
							// {
							// 	"id": "402880f76b778601016b778d71c00000",
							// 	"tenantId": "1561422932914",
							// 	"name": "123",
							// 	"code": "123",
							// 	"type": 12,
							// 	"defaultValue": "123123",
							// 	"category": 2,
							// 	"quoteSum": 0,
							// 	"typeLabel": "字符串",
							// 	"key": "402880f76b778601016b778d71c00000"
							// }
						]
					},
					'assemblyId': '',
					'assemblyParentId': '',
					"type": 3,
					"actionType": 1
				},
				path: [{
					actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
					{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
					{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
					{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
					{ action: "close" }]
				}]
			}
		]
	}
};

$.each(categorys, function (k, v) {
	Schema.addCategory({
		name: k,
		text: v.title,
		dataAttributes: []
	});
	$.each(v.child, function () {
		var key = this.name;
		// if (this.name === 'start') {
		// 	Schema.addShape({
		// 		name: this.name,
		// 		title: this.title,
		// 		category: k,
		// 		icon: this.icon,
		// 		selected: this.selected,
		// 		fontStyle: this.fontStyle,
		// 		lineStyle: this.lineStyle,
		// 		fillStyle: this.fillStyle,
		// 		props: { w: 150, h: 40, },
		// 		path: [{
		// 			actions: [{ action: "move", x: "Math.min(w,h)/2.5", y: "0" },
		// 			{ action: "line", x: "w-Math.min(w,h)/2.5", y: "0" },
		// 			{ action: "curve", x1: "w+Math.min(w,h)/2.5/2.5", y1: "0", x2: "w+Math.min(w,h)/2.5/2.5", y2: "h", x: "w-Math.min(w,h)/2.5", y: "h" },
		// 			{ action: "line", x: "Math.min(w,h)/2.5", y: "h" },
		// 			{ action: "curve", x1: "-Math.min(w,h)/2.5/2.5", y1: "h", x2: "-Math.min(w,h)/2.5/2.5", y2: "0", x: "Math.min(w,h)/2.5", y: "0" },
		// 			{ action: "close" }]
		// 		}],
		// 		data: this.data,
		// 	});
		// } else {
		// 	Schema.addShape({
		// 		name: this.name,
		// 		title: this.title,
		// 		category: k,
		// 		icon: this.icon,
		// 		selected: this.selected,
		// 		fontStyle: this.fontStyle,
		// 		lineStyle: this.lineStyle,
		// 		fillStyle: this.fillStyle,
		// 		props: { w: 150, h: 40, },
		// 		path: [{
		// 			actions: [{ action: "move", x: "Math.min(w,h)/5/5", y: "0" },
		// 			{ action: "line", x: "w-Math.min(w,h)/5/5", y: "0" },
		// 			{ action: "curve", x1: "w+Math.min(w,h)/5/5", y1: "0", x2: "w+Math.min(w,h)/5/5", y2: "h", x: "w-Math.min(w,h)/5/5", y: "h" },
		// 			{ action: "line", x: "Math.min(w,h)/5/5", y: "h" },
		// 			{ action: "curve", x1: "-Math.min(w,h)/5/5", y1: "h", x2: "-Math.min(w,h)/5/5", y2: "0", x: "Math.min(w,h)/5/5", y: "0" },
		// 			{ action: "close" }]
		// 		}],
		// 		data: this.data,
		// 	});
		// }

		Schema.addShape({
			name: this.name,
			title: this.title,
			category: k,
			icon: this.icon,
			selected: this.selected,
			fontStyle: this.fontStyle,
			lineStyle: this.lineStyle,
			fillStyle: this.fillStyle,
			path: this.path,
			props: { w: 150, h: 40, },
			data: this.data,
		});

		var temp = $('#configure .template');
		var _div = temp.find('#temp_' + key);
		if (_div.length == 0 && this.formEL) {
			temp.append('<div id="temp_' + key + '"></div>');
			_div = temp.find('#temp_' + key);
			$.each(this.formEL, function () {
				var require = ' <font>*</font>', required = 'required', tipHtml = '<i title_pos="left" title="' + (this.tips || '') + '" class="fa fa-question-circle"></i>';
				if (this.hide) required = '';
				if (this.require == false) require = '';
				if (!this.tips) tipHtml = '';

				var startHtml = '<div class="layui-form-item ' + this.name + '">' + '<label class="layui-form-label">' + this.title + require + '</label>' + '<div class="layui-input-block">';
				var endHtml = '</div></div>';

				//title="'+this.title+'" 
				if (this.type == 'select') {
					_div.append(startHtml
						+ '<select name="' + this.name + '" lay-verify="' + required + '|' + this.name + '" lay-filter="' + (this.filter || '') + '"><option value="">请选择...</option></select>'
						+ tipHtml + endHtml);
					var select = _div.find('select[name="' + this.name + '"]');
					if (this.child)
						var nn = this.name;
					$.each(this.child, function () {
						select.append('<option value="' + this.value + '" xx="{{ d.' + nn + '==\'' + this.value + '\'?\'selected\':\'\' xx}}">' + this.text + '</option>');
					});
				} else if (this.type == 'textarea') {
					_div.append(startHtml
						+ '<textarea name="' + this.name + '" class="layui-textarea" lay-verify="' + required + '|' + this.name + '" placeholder="请输入' + this.title + '" class="layui-input">{{ d.' + this.name + '||\'\' }}</textarea>'
						+ tipHtml + endHtml);
				} else {
					var num = this.type;
					if (this.type != "number") num = '';
					_div.append(startHtml
						+ '<input type="' + this.type + '" name="' + this.name + '" value="{{ d.' + this.name + '||\'\' }}" lay-verify="' + required + '|' + (this.name + '|' + num) + '" placeholder="请输入' + this.title + '" class="layui-input" />'
						+ tipHtml + endHtml);
				}
				if (this.hide) {
					_div.find('.' + this.name).hide();
				}
			});
		}
	});
});

//把下面的layui的代码抽取出有用的出来
$("a.plus").click(function () {
	Designer.zoomIn()
})
$("a.minus").click(function () {
	Designer.zoomOut()
})
setTimeout(() => {
	// alert($(window).height())
	$('#canvas_container').height($(window).height());
}, 2000);

function nodeConf(node) {
	var nodeId = node.id, data = $('#' + nodeId).data('node') || {}, conf = $("#configure");
	var form = layui.form, laytpl = layui.laytpl;
	var temp = $('#temp_' + node.name).html();
	temp = temp.replaceAll('xx="{{', '{{');
	temp = temp.replaceAll('xx}}"', '}}');
	if (node.title && !data.name) {
		data.name = node.title;
	}
	$('#' + nodeId).find('.text_canvas').val(data.name);

	laytpl(temp).render(data, function (html) {
		conf.find('[name="nodeId"').val(nodeId);
		conf.find('[name="remark"').val(data.remark || '');
		conf.find('.layui-tab-content .layui-tab-item:eq(0)').html(html);
		form.render();
		conf.show();
		conf.find('.layui-tab-title li:first').click();
	});
}

function showMenu(m) {
	if ($('.layui-log').length > 0) {
		m.children().show();
		m.children('li[ac=log]').unbind('click').click(function () {
			layer.open({
				type: 1,
				title: false,
				offset: 'auto',
				area: ['80%', '500px'],
				content: '<pre class="layui-code layui-code-log" lay-title="日志"></pre>',
				btn: '关闭',
				btnAlign: 'c',
				shade: 0.1,
				move: 0,
				shadeClose: true,
				success: function () {
					$('.layui-code-log').append($('#log-demo').html());
					layui.use('code', function () {
						layui.code({
							title: '日志',
							about: false,
						});
					});
				}
			});
		});
	}
}


