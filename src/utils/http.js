
import axios from 'axios'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// import { getBasicAuthInfo, toLogin } from '@/common/utils'
import store from '@/store'
import router from '@/router'

let timer = 0

NProgress.configure({ showSpinner: false })
// const { lang = 'zh' } = store.state

const readBlobResponse = async (data) => {
    try {
        const ret = await data.text()
        return JSON.parse(ret)
    } catch (error) {
        return {}
    }
}

const httpCode = {
    zh: {
        0: '成功',
        101: 'RPC 操作失败',
        102: '未知错误',
        103: '用户名或密码错误',
        104: '空的用户名密码',
        105: '用户不存在',
        106: '不能删除管理员',
        107: '请求参数错误',
        108: '请求参数类型错误',
        109: '请求体不是 JSON',
        110: '插件当前已经启动',
        111: '插件当前已经停止',
        112: '客户端不在线',
        113: '用户已存在',
        114: '旧密码错误',
        115: '主题错误',
        4010: '权限错误',
        '-1': '需要登录',
        '-2': '相关插件未开启',
    },
    en: {
        0: 'Success',
        101: 'Bad RPC',
        102: 'Unknown Error',
        103: 'Username or password error',
        104: 'Empty username or password',
        105: 'User does not exist',
        106: 'Admin can not be deleted',
        107: 'Missing request parameter',
        108: 'Request parameter type error',
        109: 'Request parameter is not a json',
        110: 'Plugin has been loaded',
        111: 'Plugin has been unloaded',
        112: 'Client not online',
        113: 'User already exist',
        114: 'Old password error',
        115: 'Bad topic',
        4010: 'Permission Error',
        '-1': 'Login Required',
        '-2': 'Plugin not started',
    },
}

const httpMap = httpCode['zh']

const pluginPages = ['schemas', 'rules', 'resources', 'setting']

Object.assign(axios.defaults, {
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
    },
    baseURL: '/api/v1',
    timeout: 50000,
    auth: {},
})

axios.interceptors.request.use(
    (config) => {
        // const user = getBasicAuthInfo()
        config.params = config.params || {}
        // const {
        //     params: { _t: tokenRequired = true },
        // } = config
        // if (!user.username && tokenRequired) {
        //     toLogin()
        //     throw new Error(httpMap['-1'])
        // }
        config.auth.username = 'root'
        config.auth.password = '123456'

        //store.dispatch('LOADING', true)
        // lwm2m observe
        if (!config.url.includes('?msgType=observe&path=')) {
            NProgress.start()
        }
        return config
    },
    (error) => Promise.reject(error),
)

async function handleError(error) {
    console.log(error)
    clearTimeout(timer)
    timer = setTimeout(() => {
        NProgress.done()
    }, 300)
    if (error.response.data instanceof Blob) {
        error.response.data = await readBlobResponse(error.response.data)
    }
    if (!error.response) {
        return Promise.reject(error.message)
    }

    const {
        selfError,
        response: {
            status,
            data: { message },
            config: {
                params: { _m: showMessage = true },
            },
        },
    } = error
    if (selfError) {
        error.message = selfError
    } else if (message) {
        error.message = message
    }
    const { name: currentPage, fullPath } = router.history.current
    if (status === 401) {
        //toLogin()
    } else if (status === 404 && pluginPages.includes(currentPage)) {
        Message.error(httpMap['-2'])
    } else if (showMessage) {
        if (fullPath.includes('imei') && error.message.includes('500')) {
            return
        }
        if (error.message !== 'module_not_loaded') {
            Message.error(error.message)
        } else {
            Message.warning('Related module are not load')
        }
    }
    return Promise.reject(error.message)
}

axios.interceptors.response.use((response) => {
    let res = response.data
    if (response.config.url.includes('/data/file')) {
        const { file, filename, data } = response.data
        res.data = {
            file,
            filename,
            data,
        }
    }
    if (response.config.url.includes('/export_devices')) {
        const { file, filename, data } = response.data
        res.data = {
            file,
            filename,
            data,
        }
    }
    let error = ''
    let selfError = ''
    if (typeof res === 'object') {
        const { status } = response
        const { code = -100, meta, message } = response.data
        let { data } = response.data
        if (code !== 0) {
            selfError = httpMap[code]
            error = httpMap[code] || message
        }
        // pagination
        if (meta) {
            data = { items: data, meta }
        }
        res = { data, status }
    }

    clearTimeout(timer)
    timer = setTimeout(() => {
        //store.dispatch('LOADING', false)
        NProgress.done()
    }, 300)

    if (res === '' && response.status === 204) {
        return null
    }

    if (error) {
        response.status = 400
        return handleError({
            message: error,
            selfError,
            response,
        })
    }
    // for blob data
    if (response.request.responseType === 'blob') {
        return response
    }
    return res.data || {}
}, handleError)

export default axios
