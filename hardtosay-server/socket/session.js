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
 * @param user
 * @param auth
 */
Session.prototype.authority = function(user,auth){
    if(arguments.length == 2){

    }
}


exports.session = new Session();