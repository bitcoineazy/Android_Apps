package com.example.notes;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

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

        CharSequence message = getReplyMessage(intent);
        int messageId = intent.getIntExtra("text_reply", 0);

        Toast.makeText(context, "Message ID: " + messageId + "\nMessage: " + message,
                Toast.LENGTH_SHORT).show();
    }
}