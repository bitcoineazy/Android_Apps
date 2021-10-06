package com.example.overwork_test;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //Отключаем темную тему приложения
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);

    }
    public void ShowResults (View v) {
        EditText question_3 = findViewById(R.id.heart_rate_lie);
        EditText question_6 = findViewById(R.id.heart_rate_stand);
        String pulse_lie = question_3.getText().toString();
        String pulse_stand = question_6.getText().toString();
        Intent intent = new Intent(this, Results.class);
        intent.putExtra("pulse_lie", pulse_lie);
        intent.putExtra("pulse_stand", pulse_stand);
        startActivity(intent);

    }
}