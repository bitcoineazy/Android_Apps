package com.example.notifications;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;
import android.widget.RemoteViews;

import androidx.core.app.NotificationCompat;

public class MyService extends Service {
    final IBinder myBinder = new MyServiceBinder();

    public class MyServiceBinder extends Binder {
        MyService getService() {
            return MyService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return myBinder;
    }


    private static final String NOTIFICATION_CHANNEL_ID = "121";

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("SERVICE", "onCreate() Service has started");

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        int counter = intent.getIntExtra("counter", 0);
        Log.d("SERVICE", "onStartCommand()");
        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        notificationManager.createNotificationChannel(new NotificationChannel(NOTIFICATION_CHANNEL_ID, "SERVICE", NotificationManager.IMPORTANCE_DEFAULT));


        Intent secondActivity = new Intent(this, SecondActivity.class);
        Intent thirdActivity = new Intent(this, ThirdActivity.class);

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID);

        PendingIntent secondPendingIntent = PendingIntent.getActivity(this,
                0,
                secondActivity,
                PendingIntent.FLAG_UPDATE_CURRENT);
        PendingIntent thirdPendingIntent = PendingIntent.getActivity(this,
                0,
                thirdActivity,
                PendingIntent.FLAG_UPDATE_CURRENT);

        RemoteViews mRemoteViews = new RemoteViews(getPackageName(), R.layout.custom_notification);
        mRemoteViews.setTextViewText(R.id.notif_title, "TITLE");
        mRemoteViews.setTextViewText(R.id.notif_content, "CONTENT");

        Notification notification = notificationBuilder.setOngoing(true)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Title")
                .setContentText("Amount of clicks: " + counter)
                .setContentIntent(secondPendingIntent)
                .setPriority(NotificationManager.IMPORTANCE_MIN)
                .setContent(mRemoteViews)
                .setCategory(Notification.CATEGORY_SERVICE)
                .addAction(R.drawable.ic_launcher_background,"Second activity", secondPendingIntent)
                .addAction(R.drawable.ic_launcher_background, "Third activity", thirdPendingIntent)
                .build();

        startForeground(1, notification);
        return super.onStartCommand(intent, flags, startId);
    }
}