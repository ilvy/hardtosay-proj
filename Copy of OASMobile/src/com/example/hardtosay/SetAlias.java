package com.example.hardtosay;

import java.util.Set;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONException;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.util.Log;

import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;

public class SetAlias extends CordovaPlugin implements TagAliasCallback{
	
	CallbackContext callbackContext = null;
	
	@Override
	public boolean execute(String action, String rawArgs,
			CallbackContext callbackContext) throws JSONException {
		this.callbackContext = callbackContext;
    	if (action.equals("setAlias")) {
            this.setAlias(callbackContext, rawArgs.replaceAll("\"", "").replaceAll("\\.", "_"));
            return true;
        }
        return false;
	}

    private void setAlias(CallbackContext callbackContext, String rawArgs) {
    	JPushInterface.setAliasAndTags(this.cordova.getActivity().getApplicationContext(), rawArgs, null, this);
    	callbackContext.success("设置别名成功");
    }

	@Override
	public void gotResult(int code, String alias, Set<String> tags) {
		// TODO Auto-generated method stub
		String logs ;
		switch (code) {
		case 0:
			logs = "Set tag and alias success, alias = " + alias + "; tags = " + tags;
			Log.i("Set", logs);
			this.callbackContext.success("设置别名" + alias + "成功");
			break;
		
		default:
			logs = "Failed with errorCode = " + code + " " + alias + "; tags = " + tags;
			Log.e("Set", logs);
			this.callbackContext.error("设置别名失败"+logs);
		}
	}
}
