package com.example.hardtosay;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import cn.jpush.android.api.JPushInterface;

public class Newstip extends CordovaPlugin {
	public static String ACTION = "showNewstip";
	public Context context;
	public boolean execute(String action,JSONArray args,CallbackContext callbackContext){
		if(ACTION.equals(action)){
			try {
				this.showNewstip(args.getString(0), args.getString(1));
				this.callback("显示通知成功", callbackContext);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				this.callback(e.getMessage(), callbackContext);
				e.printStackTrace();
			}
		}
		return false;
	}
	public void showNewstip(String title,String message){
		this.context = this.cordova.getActivity().getApplicationContext();
		//消息通知栏
				//定义NotificationManager
				String ns = Context.NOTIFICATION_SERVICE;
				NotificationManager mNotificationManager = (NotificationManager) this.cordova.getActivity().getSystemService(ns);
				//定义通知栏展现的内容信息
				int icon = R.drawable.ic_launcher;
				CharSequence tickerText = title;
				long when = System.currentTimeMillis();
				Notification notification = new Notification(icon, tickerText, when);
				notification.flags = Notification.FLAG_AUTO_CANCEL;
				//定义下拉通知栏时要展现的内容信息
//				Context context = this.getApplicationContext();
				CharSequence contentTitle = title;
				CharSequence contentText = message;
				Intent notificationIntent = new Intent(context,TestActivity.class);
//				notificationIntent.putExtras(bundle);
				notificationIntent.addCategory(Intent.CATEGORY_LAUNCHER);
				notificationIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
				PendingIntent contentIntent = PendingIntent.getActivity(context, 0,
							notificationIntent, 0);
				notification.setLatestEventInfo(context, contentTitle, contentText,
						contentIntent);
				
				//用mNotificationManager的notify方法通知用户生成标题栏消息通知
				mNotificationManager.notify(1, notification);
	}
	private void callback(String message, CallbackContext callbackContext) {

//        if(message != null && message.length() > 0) {

                callbackContext.success(message);//这里的succsee函数，就是调用js的success函数

//        }else {
//                callbackContext.error("");
//        }
	}
}
