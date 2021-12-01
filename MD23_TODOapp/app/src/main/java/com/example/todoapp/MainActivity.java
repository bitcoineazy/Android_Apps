package com.example.todoapp;

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
        switch (v.getId()) {
            case (R.id.btnFirst):
                Intent first_category = new Intent(this, Category.class);
                first_category.putExtra("category", "ПЕРВАЯ КАТЕГОРИЯ");
                startActivity(first_category);
                break;
            case (R.id.btnSecond):
                Intent second_category = new Intent(this, Category.class);
                second_category.putExtra("category", "ВТОРАЯ КАТЕГОРИЯ");
                startActivity(second_category);
                break;
            case (R.id.btnThird):
                Intent third_category = new Intent(this, Category.class);
                third_category.putExtra("category", "ТРЕТЬЯ КАТЕГОРИЯ");
                startActivity(third_category);
                break;
            case (R.id.btnFourth):
                Intent fourth_category = new Intent(this, Category.class);
                fourth_category.putExtra("category", "ЧЕТВЕРТАЯ КАТЕГОРИЯ");
                startActivity(fourth_category);
                break;
            case (R.id.btnFifth):
                Intent fifth_category = new Intent(this, Category.class);
                fifth_category.putExtra("category", "ПЯТАЯ КАТЕГОРИЯ");
                startActivity(fifth_category);
                break;
        }
    }
}