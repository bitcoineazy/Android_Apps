package com.example.myapplication;

import com.example.myapplication.MyService.MyBinder;

import androidx.appcompat.app.AppCompatActivity;
import android.content.ComponentName;


import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;


public class MainActivity extends AppCompatActivity {
    MyService myService;
    boolean service_connected;
    final String ACTIVITY = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ServiceConnection mConnection = new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName className, IBinder service) {
                MyBinder binder = (MyBinder) service;
                myService = binder.getService();
                service_connected = true;
            }

            @Override
            public void onServiceDisconnected(ComponentName arg0) {
                service_connected = false;
            }
        };

        Button btnStartService = findViewById(R.id.btnStartService);
        Button btnBindService = findViewById(R.id.btnBindService);
        Button btnKillBindService = findViewById(R.id.btnKillBindService);
        Button btnBindServiceGenNumber = findViewById(R.id.btnBindGenNumber);
        Button btnStopService = findViewById(R.id.btnStopService);
        Intent service_intent = new Intent(this, MyService.class);
        Intent start_service = new Intent(MainActivity.this, MyService.class);

        btnStartService.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                startService(start_service);
            }
        });

        btnStopService.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                stopService(start_service);
            }
        });

        btnBindService.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                bindService(service_intent, mConnection, Context.BIND_AUTO_CREATE);
            }
        });

        btnKillBindService.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (service_connected) {
                    unbindService(mConnection);
                    service_connected = false;
                }
            }
        });

        btnBindServiceGenNumber.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int number = myService.genRandomNumber();
                Toast.makeText(MainActivity.this, "Number: " + number, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(ACTIVITY, "onResume()");
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(ACTIVITY, "onPause()");
    }

    @Override
    protected void onStop() {
        super.onStop();
        Log.d(ACTIVITY, "onStop()");
    }
}


