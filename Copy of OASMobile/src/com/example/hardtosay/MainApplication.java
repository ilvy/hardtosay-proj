package com.example.hardtosay;

import cn.jpush.android.api.JPushInterface;
import android.app.Application;
import android.util.Log;

public class MainApplication extends Application {
	
	private String title = null;
	private String content = null;

    @Override
    public void onCreate() {    	     
         super.onCreate();
         JPushInterface.setDebugMode(true); 	//设置开启日志,发布时请关闭日志
         JPushInterface.init(this);     		// 初始化 JPush
    }

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
