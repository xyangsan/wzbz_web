/* eslint-disable */
import axios from 'axios'
/**
 * 定义请求常量
 */
// export const baseUrl = "http://192.168.0.21:8080/api/update.ashx";
// export const baseUrl = "http://iwzlp/demo1/php%E4%BB%A3%E7%A0%81/";  //问真罗盘本地服务器地址
export const baseUrl = "https://bzapi2.iwzbz.com/";     //问真八字服务器n级地址
export const baseUrl2 = "https://bzpp2.iwzbz.com/api/v1.1/";
export const baseUrl3 = "https://bzpp.zhulusoft.com/api/v1.1/";
// 请求超时时间
axios.defaults.timeout = 10000;

//静态请求实例
// const instance = axios.create({
//     baseUrl,
//     timeout: 2000,
// })
// axios.defaults.baseURL = baseUrl

// 请求拦截
axios.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 响应拦截
axios.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        let { data } = response;
        return Promise.resolve(data)
    },
    error => {
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)

// 封装请求,默认get请求

export function fetch(requestUrl, params = '', baseFlag = 0, method = 'get') {
    switch (baseFlag) {
        case 0:
            switch (method) {
                case 'get':
                    return axios({
                        url: baseUrl + requestUrl + params,
                        method,
                    })
                case 'post':
                    return axios({
                        url: baseUrl + requestUrl,
                        method,
                        data: {
                            params
                        }
                    })
            }
            break
        case 1:
            switch (method) {
                case 'get':
                    var geturl = baseUrl2 + requestUrl + params
                    //debugger
                    return axios({
                        url: geturl,
                        method,
                    })
                case 'post':
                    return axios({
                        url: baseUrl2 + requestUrl,
                        method,
                        data: {
                            params
                        }
                    })
            }
            break
        case 2:
            console.log("请求地址：",baseUrl2 + requestUrl);
            switch (method) {
                case 'get':
                    return axios({
                        url: baseUrl2 + requestUrl,
                        method,
                        data: params

                    });
                case "post":
                    return axios({
                        url: baseUrl2 + requestUrl,
                        method,
                        data: params
                    });
            }
            break
        case 3:
            switch (method) {
                case 'get':
                    return axios({
                        url: baseUrl3 + requestUrl,
                        method,
                        data: params

                    });
                case "post":
                    return axios({
                        url: baseUrl3 + requestUrl,
                        method,
                        data: {
                            params
                        }
                    });
            }
            break
        case 4:
            switch (method) {
                case 'get':
                    return axios({
                        url: requestUrl,
                        method,
                        data: params

                    })
                case 'put':
                    return axios({
                        url: requestUrl,
                        method,
                        data: params
                    })
                case 'post':
                    return axios({
                        url: requestUrl,
                        method,
                        data: {
                            params
                        }
                    })
            }
    }
}

    //封装请求二：
    //创建实例的作用是，可以让将baseUrl拼接在url的前面，给axios设置默认值
    //  const instance = axios.create({
    //     baseUrl,
    //     timeout: 2000
    // })

    // export function get(url, params) {
    //     return instance.get({
    //         url: url,
    //         params: params
    //     })
    // }
    // export function post(url, params) {
    //     return instance.post({
    //         url: url,
    //         data: params
    //     })
    // }