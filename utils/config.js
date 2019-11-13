const env='prod'
let baseUrl=""
if (env=='dev'){
  baseUrl = "https://huruqing.cn:3009"
}else if(env=='prod'){
  baseUrl = "https://huruqing.cn:3009"
}
export {
  baseUrl
}