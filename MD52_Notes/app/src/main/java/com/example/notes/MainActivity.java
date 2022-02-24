package com.example.notes;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        SharedPreferences settings = getSharedPreferences("Notes", MODE_PRIVATE);


        Intent note_service = new Intent(this, NoteService.class);


        startForegroundService(note_service);

    }



}