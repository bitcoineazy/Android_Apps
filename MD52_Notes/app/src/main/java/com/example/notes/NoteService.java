package com.example.notes;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;

import androidx.annotation.Nullable;
import androidx.core.app.RemoteInput;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import androidx.core.app.NotificationCompat;

public class NoteService extends Service {
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("SERVICE", "onStartCommand()");
        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        notificationManager.createNotificationChannel(new NotificationChannel("121", "SERVICE", NotificationManager.IMPORTANCE_DEFAULT));
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, "121");

        RemoteInput remoteInput = new RemoteInput.Builder("text_reply")
                .setLabel("reply_label")
                .build();

        Intent broadcast_receiver = new Intent(this, NotificationBroadcastReceiver.class);

        PendingIntent replyPendingIntent = PendingIntent.getBroadcast(this,
                100, broadcast_receiver, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Action action = new NotificationCompat.Action.Builder(R.mipmap.ic_launcher_round,
                "reply_label", replyPendingIntent)
                .addRemoteInput(remoteInput)
                .build();

        Notification notification = notificationBuilder.setOngoing(true)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Title")
                .setPriority(NotificationManager.IMPORTANCE_MIN)
                .setCategory(Notification.CATEGORY_SERVICE)
                .addAction(action)
                .build();
        startForeground(1, notification);
        return super.onStartCommand(intent, flags, startId);
    }


}
