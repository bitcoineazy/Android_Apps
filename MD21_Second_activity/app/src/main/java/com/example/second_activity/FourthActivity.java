package com.example.second_activity;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

public class FourthActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fourth);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_menu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case (R.id.menu_main):
                Intent intent_2 = new Intent(this, MainActivity.class);
                startActivity(intent_2);
                break;
            case (R.id.menu_third):
                Intent intent_3 = new Intent(this, ThirdActivity.class);
                startActivity(intent_3);
                break;
            case (R.id.menu_second):
                Intent intent_4 = new Intent(this, SecondActivity.class);
                startActivity(intent_4);
                break;
            case (R.id.menu_name):
                Intent intent_name = new Intent(this, NameActivity.class);
                startActivity(intent_name);
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}