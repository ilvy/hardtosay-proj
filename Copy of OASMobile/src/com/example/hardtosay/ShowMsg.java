package com.example.hardtosay;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONException;
import org.json.JSONObject;

public class ShowMsg extends CordovaPlugin {

	@Override
	public boolean execute(String action, String rawArgs,
			CallbackContext callbackContext) throws JSONException {
    	if (action.equals("showMsg")) {
            this.showMsg(callbackContext);
            return true;
        }
        return false;
	}

    private void showMsg(CallbackContext callbackContext) {
    	MainApplication app = (MainApplication)(this.cordova.getActivity().getApplication());
    	JSONObject obj = new JSONObject();
    	try {
			obj.put("title", app.getTitle());
			obj.put("content", app.getContent());
			callbackContext.success(obj);
		} catch (JSONException e) {
			callbackContext.error("显示不了推送消息");
			e.printStackTrace();
		}
    }

}
