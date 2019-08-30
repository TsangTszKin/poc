/*
 * @Author: zengzijian
 * @Date: 2019-04-11 16:30:20
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:58:18
 * @Description: 
 */
import { observable, toJS } from 'mobx';

class ControlStore {

    constructor() {

    }

    /**
     *控制节点的信息
     * @memberof ControlStore
     */
    @observable info = {
        name: '',
        id: '',
        type: '',//start, control, query, rule, ruleSet, assign , output

        isFinish: false,
        get getName() { return toJS(this.name) },
        get getType() { return toJS(this.type) },
        get getId() { return toJS(this.id) },
        get getIsFinish() { return toJS(this.isFinish) },
        setName(value) { this.name = value },
        setId(value) { this.id = value },
        setType(value) { this.type = value },
        setIsFinish(value) { this.isFinish = value }
    }
}

export default new ControlStore