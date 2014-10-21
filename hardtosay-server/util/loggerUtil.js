/**
 * Created with JetBrains WebStorm.
 * User: darcon.Wang
 * Date: 14-4-2
 * Time: 下午12:02
 * To change this template use File | Settings | File Templates.
 */


var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        {
            type: 'file',
            absolute: true,
            filename: __dirname + '/../logs/access.log',
            maxLogSize: 1024 * 1024,
            backup: 3
//            category: 'normal'
        },
        {
            type: 'file',
            absolute: true,
            filename: __dirname + '/../logs/error.log',
            maxLogSize: 1024 * 1024,
            backup: 3,
            category: 'errorLog'
        }
    ],
    replaceConsole: true
});

exports.logger = function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
};