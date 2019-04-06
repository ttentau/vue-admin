import axios from 'axios'
import store from '@/store'
import tools from './tools'
import Config from '../config/index'
import {CONSTANT} from '../utils/const_var'


const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? Config.PRODUCT_API_URL : Config.API_URL,
    timeout: 15000,
})

// request 拦截器
instance.interceptors.request.use(
    config => {
        // if (Cookies.get('token')) {
        //     config.headers['access_token'] = Cookies.get('token')
        //     if (config.method === 'post') {
        //         config.headers['access_token'] = Cookies.get('token')
        //     }
        // }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// respone 拦截器
instance.interceptors.response.use(
    response => {
        // console.log(response)
        // console.log(response.data)
        const data = response.data
        if (response.status !== 200) {
            tools.notify({
                type: 'error',
                message: response.statusText
            })
            if (data.resultCode === '000000') {
                // 接口自定义错误代码
                // 移除登陆token 显示接口错误消息
            }25
            return Promise.reject(data)
        } else {
            if (data === null) {
                return Promise.resolve({
                    resultCode: '009900',
                    resultMsg: '系统出现错误',
                    pageReturn: null
                })
            }
            // console.log(data.resultCode)
            if (data.resultCode === undefined) {
                if (data.msg !== undefined) {
                    return Promise.resolve({
                        resultCode: '009900',
                        resultMsg: data.msg,
                        pageReturn: null
                    })
                } else {
                    return Promise.resolve({
                        resultCode:'009900',
                        resultMsg: data.message!==null?data.message:'',
                        pageReturn: null
                    })
                }
            }
        }
        return Promise.resolve(data)
    },
    error => {
        // console.log(error.response.data)
        if (error.response === undefined && error.status === undefined) {
            return Promise.resolve({
                resultCode: '009900',
                resultMsg: '服务器响应超时',
                pageReturn: null
            })
        }
        if (error.response.status >= 500) {
            return Promise.resolve({
                resultCode: '009900',
                resultMsg: '服务器出现错误',
                pageReturn: null
            })
        } else if (error.response.status === 401) {
            return Promise.resolve({
                resultCode: '009900',
                resultMsg: '用户名或密码不正确',
                pageReturn: null
            })
        } else {
            let data = error.response.data
            if (data.resultCode !== undefined) {
                return Promise.resolve({
                    resultCode: data.resultCode,
                    resultMsg: data.resultMsg
                })
            }
            return Promise.resolve({
                resultCode: '009900',
                resultMsg: data.msg,
                pageReturn: null
            })
        }
    }
)

async function request(url, data = {}, params = {}, method = CONSTANT.POST, auth = false, version = Config.API_VERSION, headers = null) {
    if (params.noUserId === undefined || !params.noUserId) {
        if (params.userId === undefined || params.userId === null) {
            if (store.state.userInfo !== null) {
                params.userId = store.state.userInfo.userId || ''
            }
        }
    }
    delete params.noUserId
    if (auth) {
    } else {
        let result
        if (method === CONSTANT.POST) {
            result = await instance({
                url: version + url,
                method: method,
                data: data,
                params: params
            })
        } else if (method === CONSTANT.GET) {
            result = await instance({
                url: version + url,
                method: method,
                params: params
            })
        } else if (method === CONSTANT.PUT) {
            result = await instance({
                url: version + url,
                method: method,
                params: params,
                data: data
            })
        } else if (method === CONSTANT.PATCH) {
            result = await instance({
                url: version + url,
                method: method,
                params: params
            })
        } else if (method === CONSTANT.DELETE) {
            result = await instance({
                url: version + url,
                method: method,
                params: params
            })
        }
        return result
    }
}

export default request
