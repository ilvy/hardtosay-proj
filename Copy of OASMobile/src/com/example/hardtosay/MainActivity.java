/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

/*package org.apache.cordova.example;

 import android.app.AlertDialog;
 import android.app.Dialog;
 import android.content.Context;
 import android.net.wifi.WifiInfo;
 import android.net.wifi.WifiManager;
 import android.os.Bundle;
 import org.apache.cordova.*;


 public class example extends DroidGap
 {
 @Override
 public void onCreate(Bundle savedInstanceState)
 {
 super.onCreate(savedInstanceState);
 super.loadUrl("file:///android_asset/www/index.html");
 docPlugin.deviceMac = getLocalMacAddress();
 }

 public String getLocalMacAddress() {
 WifiManager wifiMgr = (WifiManager)getSystemService(Context.WIFI_SERVICE);
 WifiInfo info = (null == wifiMgr ? null : wifiMgr.getConnectionInfo());
 if (null != info) {
 return (info.getMacAddress());
 }
 return "";
 }

 }
 */

package com.example.hardtosay;

import org.apache.cordova.DroidGap;
import org.apache.cordova.api.LOG;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.StrictMode;
import android.view.KeyEvent;

import com.example.hardtosay.R;


public class MainActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		LOG.d("MainActivity", "MainActivity start");
		StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder()
				.detectDiskReads().detectDiskWrites().detectNetwork()
				.penaltyLog().build());
		StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder()
				.detectLeakedSqlLiteObjects().penaltyLog().penaltyDeath()
				.build());
		super.onCreate(savedInstanceState);
		docPlugin.deviceMac = getLocalMacAddress();
		super.setIntegerProperty("splashscreen", R.drawable.splash);
		super.loadUrl("file:///android_asset/www/index.html", 1500);
	}

	// 获得MAC地址
	public String getLocalMacAddress() {
		WifiManager wifiMgr = (WifiManager) getSystemService(Context.WIFI_SERVICE);
		WifiInfo info = (null == wifiMgr ? null : wifiMgr.getConnectionInfo());
		if (null != info) {
			return (info.getMacAddress());
		}
		return "";
	}
	
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			moveTaskToBack(false);
			return true;
		}
		return super.onKeyDown(keyCode, event);
	}
}
