package com.example.services;

import com.example.services.PlayService.PlayServiceBinder;

import androidx.appcompat.app.AppCompatActivity;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.view.View;
import android.widget.Button;

public class Playlist extends AppCompatActivity {
    PlayService playService;
    boolean service_connected;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_playlist);

        Button btnPlayNext = findViewById(R.id.button_playnext);
        Button btnUnbind = findViewById(R.id.button_unbind);

        Intent playService_intent = new Intent(this, PlayService.class);

        ServiceConnection mConnection = new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName className, IBinder service) {
                PlayServiceBinder binder = (PlayServiceBinder) service;
                playService = binder.getService();
                service_connected = true;
            }

            @Override
            public void onServiceDisconnected(ComponentName arg0) {
                service_connected = false;
            }
        };

        bindService(playService_intent, mConnection, BIND_AUTO_CREATE);

        //Следующий трек
        btnPlayNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                playService.playNext();
            }
        });

        btnUnbind.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (service_connected) {
                    unbindService(mConnection);
                    service_connected = false;
                }
            }
        });
    }
}