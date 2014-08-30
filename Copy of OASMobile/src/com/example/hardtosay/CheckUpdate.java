package com.example.hardtosay;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager.NameNotFoundException;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

public class CheckUpdate extends CordovaPlugin{

	private String newVerName = "";
	private float newVerCode = -1;
	private String updateContent = null;
	private String IP = "59.34.148.42:9997";
	private Activity mContext = null;
	private ProgressDialog pd = null;
	private String UPDATE_SERVERAPK = "OASMobile_1.1.0.apk";
    
    @Override
	public boolean execute(String action, String rawArgs,
			CallbackContext callbackContext) throws JSONException {
    	if (action.equals("update")) {
            mContext = this.cordova.getActivity();
            this.update(callbackContext);
            return true;
        }
        return false;
	}

    private void update(CallbackContext callbackContext) {
    	if (getServerVer()) {
    		float verCode = getVerCode(mContext);
    		if (newVerCode > verCode) {
    			doNewVersionUpdate();
    		} else {
    			notNewVersionUpdate();
    		}
    		callbackContext.success("更新");
    	} else {
    		callbackContext.error("检查更新失败，请稍后再尝试");
    	} 
    }
    
    //获得版本号
	private float getVerCode(Context context) {
		float verCode = -1;
		try {
			String packName = context.getPackageName();
			verCode = context.getPackageManager().getPackageInfo(packName, 0).versionCode;
		} catch (NameNotFoundException e) {
			Log.e("版本号获取异常", e.getMessage());
		}
		return verCode;
	}
	
	//获得版本名称
	private String getVerName(Context context) {
		String verName = "";
		try {
			String packName = context.getPackageName();
			verName = context.getPackageManager().getPackageInfo(packName, 0).versionName;
		} catch (NameNotFoundException e) {
			Log.e("版本名称获取异常", e.getMessage());
		}

		return verName;
	}
	
	//从服务器端获得版本号与版本名称
	private boolean getServerVer() {
		URL url;
		try {
			url = new URL("http://"+IP+"/Version.js");
			HttpURLConnection httpconnection = (HttpURLConnection) url
					.openConnection();
			
			httpconnection.setDoInput(true);
			httpconnection.setRequestMethod("GET");
			httpconnection.connect();
			InputStream is = httpconnection.getInputStream();
			InputStreamReader reader = new InputStreamReader(
					is);
			BufferedReader breader = new BufferedReader(reader);
			String verjson = breader.readLine();
			
			JSONArray array = new JSONArray(verjson);
			JSONObject jsonObj = array.getJSONObject(0);
			newVerCode = Float.parseFloat(jsonObj.getString("verCode"));
			newVerName = jsonObj.getString("verName");
			try {
				updateContent = jsonObj.getString("updateContent");
			} catch (Exception e) {
				updateContent = "";
			}
		} catch (Exception e) {
			newVerCode = -1;
			newVerName = "";
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public void doNewVersionUpdate() {
//		int verCode = this.getVerCode(mContext);
//		String verName = this.getVerName(mContext);
		StringBuffer sb = new StringBuffer();
//		sb.append("当前版本:");
//		sb.append(verName);
//		sb.append(" Code:");
//		sb.append(verCode);
//		sb.append(", 发现版本:");
//		sb.append(newVerName);
//		sb.append(" Code:");
//		sb.append(newVerCode);
//		sb.append(", 是否更新?");
		sb.append("发现新版本，更新内容：\n");
		sb.append(updateContent);
		sb.append("\n是否更新？");
		Dialog dialog = new AlertDialog.Builder(mContext)
				.setTitle("软件更新")
				.setMessage(sb.toString())
				.setPositiveButton("更新",
						new DialogInterface.OnClickListener() {
							@Override
							public void onClick(DialogInterface dialog,
									int which) {
								pd = new ProgressDialog(mContext);
								pd.setTitle("正在下载");
								pd.setMessage("请稍后...");
								pd.setProgressStyle(ProgressDialog.STYLE_SPINNER);
								downFile("http://"+IP+"/"+UPDATE_SERVERAPK);
//								downFile("http://" + IP + "/" + "example.apk");
							}
						})
				.setNegativeButton("暂不更新",
						new DialogInterface.OnClickListener() {
							public void onClick(DialogInterface dialog,
									int whichButton) {
							}
				 }).create();
		//显示更新狂
		dialog.show();
	}
	
	
	//不更新版本
	private void notNewVersionUpdate() {
//		int verCode = getVerCode(mContext);
//		String verName = getVerName(mContext);
		StringBuffer sb = new StringBuffer();
		sb.append("当前版本");
//		sb.append(verName);
//		sb.append(" Code:");
//		sb.append(verCode);
		sb.append("已是最新版本，无需更新。");
		Dialog dialog = new AlertDialog.Builder(mContext)
			.setTitle("软件更新")
			.setMessage(sb.toString())
			.setPositiveButton("确定",
					new DialogInterface.OnClickListener() {
						@Override
						public void onClick(DialogInterface dialog,
								int which) {
							//mContext.finish();
						}
			}).create();
        dialog.show();
	}
	
	//下载apk
	public void downFile(final String url) {
		pd.show();
		new Thread() {
			public void run() {
				HttpClient client = new DefaultHttpClient();
				HttpGet get = new HttpGet(url);
				HttpResponse response;
				try {
					response = client.execute(get);
					HttpEntity entity = response.getEntity();
					long length = entity.getContentLength();
					InputStream is = entity.getContent();
					FileOutputStream fileOutputStream = null;
					if (is != null) {
						File file = new File(
								Environment.getExternalStorageDirectory(),
								UPDATE_SERVERAPK);
						fileOutputStream = new FileOutputStream(file);
						byte[] buf = new byte[1024];
						int ch = -1;
						int count = 0;
						while ((ch = is.read(buf)) != -1) {
							fileOutputStream.write(buf, 0, ch);
							count += ch;
//							if (length > 0) {
//							}
						}
					}
					fileOutputStream.flush();
					if (fileOutputStream != null) {
						fileOutputStream.close();
					}
					down();
				} catch (ClientProtocolException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}.start();
	}
	
	Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			pd.cancel();
			update();
		}

	};
	
	//下载完成，通过handler将下载对话框取消
	public void down() {
		new Thread() {
			public void run() {
				Message message = handler.obtainMessage();
				handler.sendMessage(message);
			}
		}.start();

	}
	
	//安装应用
	public void update() {
		Intent intent = new Intent(Intent.ACTION_VIEW);
		intent.setDataAndType(Uri.fromFile(new File(Environment
				.getExternalStorageDirectory(), UPDATE_SERVERAPK)),
				"application/vnd.android.package-archive");
		mContext.startActivity(intent);
	}
}


