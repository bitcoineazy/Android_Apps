package com.example.intentfilters;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.Toast;

public class SystemActionActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_system_action);
    }

    @Override
    protected void onUserLeaveHint() {
        Toast toast = Toast.makeText(getApplicationContext(), "Нажата кнопка HOME", Toast.LENGTH_SHORT);
        toast.show();
        super.onUserLeaveHint();
    }
}