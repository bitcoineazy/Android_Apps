package com.example.intentfilters;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void onClick(View v) {
        Intent intent;

        switch(v.getId()) {
            case (R.id.btnTime):
                intent = new Intent("com.example.intent.action.showtime");
                startActivity(intent);
                break;
            case (R.id.btnDate):
                intent = new Intent("com.example.intent.action.showdate");
                startActivity(intent);
                break;
        }
    }

}