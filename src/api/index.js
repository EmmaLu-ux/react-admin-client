import ajax from "./ajax"
import jsonp from 'jsonp'
import { message } from "antd"

const BASE = '/api'
//用户登录
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

//获取一级/二级分类的列表
export const reqGetCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
//添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST')
//更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

//获取商品分页列表
export const reqProduct = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

//搜索商品分页列表(根据商品名称/描述)
/* searchType: 搜索的类型：productName/productDesc
searchName: 搜索的关键字
*/
export const reqSearchProduct = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search',
    {
        pageNum,
        pageSize,
        [searchType]: searchName
    })

//获取一个分类
export const reqACategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

//更新商品的状态(上架/下架)
export const reqUpdateProduct = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

//删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

//添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id?'update':'add'), product, 'POST')

// //更新商品
// export const reqUpdateAProduct = (product) => ajax('/manage/product/update', product, 'POST')

//获取所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

//更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

//获取用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

//删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, "POST")

// 获取天气
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        // const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p4 9MVra6urFRGOT9s8UBWr2`
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=65e76fc0f42384fc309cc50221644787`
        console.log('url')
        // debugger
        jsonp(url, {
            param: 'callback'
        }, (err, data) => {
            console.log(data)
            if (!err && data.status === "1") {
                const { weather, winddirection, windpower, humidity } = data.lives[0]
                console.log('text:', weather)
                resolve({weather, winddirection, windpower, humidity})
            } else {
                message.error('获取天气信息失败!')
            }

        })
    })
}
// reqWeather('北京')