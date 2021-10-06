package com.example.overwork_test;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;

import java.lang.reflect.Array;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //Отключаем темную тему приложения
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);

        Spinner birth_year_sp = findViewById(R.id.birth_year_spinner);


        String[] birth_years = new String[100];
        int start_year = 2021;
        for (int i=0; i < 100; i++) {
            birth_years[i] = String.valueOf(start_year - i);
            Log.d("Spinner","Birth year:" + birth_years[i]);
        }
        ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, birth_years);
        spinnerArrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        birth_year_sp.setAdapter(spinnerArrayAdapter);
    }
    public void ShowResults (View v) {
        EditText question_3 = findViewById(R.id.heart_rate_lie);
        EditText question_6 = findViewById(R.id.heart_rate_stand);
        int pulse_lie = Integer.parseInt(question_3.getText().toString());
        int pulse_stand = Integer.parseInt(question_6.getText().toString());
        Intent intent = new Intent(this, Results.class);
        int final_difference = pulse_lie - pulse_stand;



        intent.putExtra("final_difference", final_difference);
        startActivity(intent);

    }
}