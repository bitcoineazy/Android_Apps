package com.example.myapplication;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import java.util.Random;

public class MyService extends Service {
    final String DEBUG = "SERVICE";
    final IBinder mBinder = new MyBinder();



    public class MyBinder extends Binder {
        MyService getService() {
            return MyService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        Log.d(DEBUG, "onBind() Service binded");
        return mBinder;
    }

    public void onRebind(Intent intent) {
        super.onRebind(intent);
        Log.d(DEBUG, "MyService onRebind");
    }

    public boolean onUnbind(Intent intent) {
        Log.d(DEBUG, "MyService onUnbind");
        return super.onUnbind(intent);
    }


    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(DEBUG, "onCreate() Service has started");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(DEBUG, "onStartCommand: " + intent + flags + " startId: " + startId);
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(DEBUG, "onDestroy() Service has been destroyed!");
    }

    //Полезное действие
    public int genRandomNumber() {
        Random generator = new Random();
        int random_number = generator.nextInt(10000);
        while (random_number < 9999) {
            random_number = generator.nextInt(10000);
            Log.d(DEBUG, "genRandomNumber(): " + random_number);
        }
        return random_number;
    }
}