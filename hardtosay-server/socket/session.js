/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-12
 * Time: 上午11:32
 * To change this template use File | Settings | File Templates.
 * desc:用户 socket Session管理
 */

function Session(){
    this.authorities = {};
}

/**
 * 管理用户session权限
 * @param userName
 * @param auth
 */
Session.prototype.authority = function(userName,auth){
    if(arguments.length == 2){
        this.authorities[userName] = auth;
    }else if(arguments.length == 1){
        return this.authorities[userName];
    }
}

/**
 * 删除session中的权限
 * @param userName
 */
Session.prototype.removeAuth = function(userName){
    if(this.authorities[userName]){
        delete this.authorities[userName];
    }
}

exports.session = new Session();