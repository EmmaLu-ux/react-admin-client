/* 用来根据老的state和指定的action生成并返回新的state的函数 */
import storageUtils from '../utils/storageUtils'
import {combineReducers} from 'redux'

import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from './action-types'

/* 用来管理头部标题的reducer函数 */
const initHeadTitle = '首页'
function headTitle(preState = initHeadTitle, action){
    const {type, data} = action
    switch (type) {
        case SET_HEAD_TITLE:
            return data
        default: 
        return preState
    }
}
/* 用来管理当前登录用户的reducer函数 */
const initUser = storageUtils.getUser() || {}
function user(preState=initUser, action){
    const {type, user, errorMsg} = action
    switch (type) {
        case RECEIVE_USER:
            return user
        case SHOW_ERROR_MSG:
            return {...preState, errorMsg}
        case RESET_USER:
            return {}
        default:
            return preState
    }
}
/* 默认向外暴露的是合并产生的reducer函数
管理的总的state的结构：
{
    headTitle: '首页',
    user: {}
} */
export default combineReducers({
    headTitle, user
})
