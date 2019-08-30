
import { observable, action } from 'mobx'

/**
 * login 自己的store
 * 在 container 通过 Provider 渗透到所有子组件。
 * 在子组件内用 @inject('store')，将 store 注入到自己的 props 上。
 * @class loginStore
 */
class Store {
    /**
     *是否认证，页面加载前要先进行用户身份认证
     *
     * @memberof Store
     */
    @observable isAuthValidate = false;
    @action
    updateIsAuthValidate(value) {
        this.isAuthValidate = value;
    }
}

export default new Store