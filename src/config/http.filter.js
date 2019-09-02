/*
 * @Author: zengzijian
 * @Date: 2019-06-10 14:28:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 10:24:04
 * @Description: 请求过滤器
 */
import axios from 'axios';
import GlobalStore from '@/store/GlobalStore';

const httpFilter = axios.create({
  // timeout: 1000 * 30, //gateway超时设置放在后端控制
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': localStorage.token//设置默认的token到请求头
  }
})


/**
 * 请求拦截
 */
httpFilter.interceptors.request.use(config => {
  config.headers['Authorization'] = localStorage.token // 请求头带上token
  try {
    if (config.url.indexOf('/api/auth/login') != -1)
      delete config.headers.Authorization//登录接口不带token到请求头
    else {
      if (config.headers['Authorization'] !== localStorage.token)
        config.headers['Authorization'] = localStorage.token;//刷新token，以本地为准
    }
  } catch (e) { window.throwError(e) }
  return config
})

/**
 * 响应拦截
 */
httpFilter.interceptors.response.use(response => {
  if (response.headers.newtoken)
    localStorage.token = response.headers.newtoken;
  if (response.headers.tokenexptimems) {
    // console.warn("have tokenexptimems", response.headers.tokenexptimems);
    GlobalStore.setTokenExpTimeMsValue(response.headers.tokenexptimems);
  }
  return response
})

export default httpFilter
