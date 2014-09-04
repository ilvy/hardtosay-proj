package com.example.hardtosay;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class docPlugin  extends CordovaPlugin {


	 public static final String ACTION = "showMac";
	 
	 public static String deviceMac = "" ;
	 
	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		
		
		 String deviceMacstr = "";
         if(ACTION.equals(action)) {
                 String message = args.getString(0);
                 deviceMacstr= this.showMac(message);
                 
                 this.callback(deviceMacstr,callbackContext);
                 if(deviceMacstr.length() > 0) {
                         return true;
                 }
         }
         return false;
		
	}
	
	public String showMac(String str) {
		
		return deviceMac;
	}
	
	public void GetdeviceMAc(String value)
	{
		deviceMac  = value;
	}
	
	private void callback(String message, CallbackContext callbackContext) {

        if(message != null && message.length() > 0) {

                callbackContext.success(message);//这里的succsee函数，就是调用js的success函数

        }else {
                callbackContext.error("获取Mac地址失败");
        }
	}
	
    
}
