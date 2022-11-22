/* 进行local数据存储管理的工具模块 */
import store from 'store'

const USER_KEY = 'user_key'

export default {
    saveUser(user){
    //     localStorage.setItem(USER_KEY, JSON.stringify(user))
    return store.set(USER_KEY, user)
    },
    
    getUser(){
    //     return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    return store.get(USER_KEY)
    },
    deleteUser(){
    //     localStorage.removeItem(USER_KEY)
    return store.remove(USER_KEY)
    },
    saveProduct(product){
        return store.set('product_key', product)
    },
    getProduct(){
        return store.get('product_key')
    }
}