package com.example.notes;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.core.app.RemoteInput;

public class NotificationBroadcastReceiver extends BroadcastReceiver {

    private CharSequence getReplyMessage(Intent intent) {
        Bundle remoteInput = RemoteInput.getResultsFromIntent(intent);
        if (remoteInput != null) {
            return remoteInput.getCharSequence("text_reply");
        }
        return null;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        SharedPreferences settings = context.getSharedPreferences("Notes", Context.MODE_PRIVATE);
        SharedPreferences.Editor noteEditor = settings.edit();

        CharSequence message = getReplyMessage(intent);

        noteEditor.putString("note", (String) message);
        noteEditor.apply();

        context.sendBroadcast(new Intent("NOTE_BROADCAST"));
    }
}