import axios from 'axios';

const requests = axios.create({
  // baseURL: "http://101.35.235.36:3000/",
  baseURL: "http://localhost:3000/",
  // baseURL: "https://netease-cloud-music-api-phi-silk.vercel.app/",

  // 代表请求超时的时间
  timeout: 6000,
});
//请求拦截器
requests.interceptors.request.use((config) => {
  //添加时间戳
  if (config.method == 'post') {
    config.data = {
      ...config.data,
      _t: Date.parse(new Date()) / 1000
    }
  } else if (config.method == 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }
  return config;
}, error => {
  console.log(error)
  return Promise.reject(error)
});

//响应拦截器
requests.interceptors.response.use((response) => {
  //成功的回调函数，服务器响应数据回来以后
  return response.data;
}, (error) => {
  console.log(error);
  return Promise.reject(new Error('faile'));
})


export default requests;
