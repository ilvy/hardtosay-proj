/**
 * Created by Administrator on 14-10-14.
 */

var dbOperator = require("../db/dbOperator");

exports.selectRelatives = function(host_name,cb){
    dbOperator.select("relative",{host_name:host_name},cb);
}
