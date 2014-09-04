/**
 * Created by Administrator on 14-9-2.
 */

var JPush = require('jpush-sdk');

var jpushclient = JPush.buildClient('f873491f324c8367d5823634','90afa9b6f9891f87b642fdb9');

jpushclient.push().setPlatform("android").setAudience(JPush.alias('Test2')).setMessage("jpush server sdk push","sdk test").send(
    function(err,res){
        if(err){
            console.log(err);
        }else{
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    }
);
jpushclient.push().setPlatform("android").setAudience(JPush.ALL)
    .setNotification(JPush.android("jpush sdk notification test","notification test"))
    .setMessage("jpush test content")
    .send(
    function(err,res){
        if(err){
            console.log("error:"+err.message);
        }else{
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    }
);