package com.example.hardtosay;

import org.apache.cordova.DroidGap;

import cn.jpush.android.api.JPushInterface;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

public class TestActivity extends DroidGap {
	
	private static final String TAG = "TestActivity";
	
	@Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
//        String title = ((MainApplication)getApplication()).getTitle();
//    	String content = ((MainApplication)getApplication()).getContent();
//    	Log.d(TAG, title + " " + content);
        
//        super.loadUrl(Config.getStartUrl());
        
        Intent intent = getIntent();
        if( null != intent ){
        	Bundle bundle = intent.getExtras();
        	String title = bundle.getString(JPushInterface.EXTRA_NOTIFICATION_TITLE);
        	String content = bundle.getString(JPushInterface.EXTRA_ALERT);
        	((MainApplication)getApplication()).setTitle(title);
        	((MainApplication)getApplication()).setContent(content);       	
        }
        super.loadUrl("file:///android_asset/www/index.html");
    }
}
