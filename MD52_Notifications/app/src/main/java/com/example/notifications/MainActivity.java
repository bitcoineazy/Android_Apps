package com.example.notifications;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;


public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final int[] counter = {0};
        setContentView(R.layout.activity_main);
        Button btnStartService = findViewById(R.id.btnStartService);
        Button btnClicker = findViewById(R.id.btnClicker);

        Intent start_service = new Intent(MainActivity.this, MyService.class);

        btnStartService.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                start_service.putExtra("flag", 1);
                startForegroundService(start_service);
            }
        });

        btnClicker.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                counter[0] += 1;
                start_service.putExtra("counter", counter[0]);
                startForegroundService(start_service);
            }
        });

    }
}