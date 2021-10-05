package com.example.md12_clicker;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.*;

public class MainActivity extends AppCompatActivity {
    private long score = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button resetBtn = findViewById(R.id.reset_btn);
        ImageView increase_image = findViewById(R.id.plus_image);
        ImageView decrease_image = findViewById(R.id.minus_image);
        increase_image.setOnClickListener(increaseListener);
        decrease_image.setOnClickListener(decreaseListener);
        resetBtn.setOnClickListener(resetListener);
    }

    View.OnClickListener increaseListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Log.d("Clicks", "Кнопка нажата: " + score + " " + getScoreAddition((int) score));
            score ++;
            TextView mainText = findViewById(R.id.mainTxt);
            String s = "Кнопка нажата " + score + " " + getScoreAddition((int) score);
            mainText.setText(s.toCharArray(), 0, s.length());
        }
    };

    View.OnClickListener decreaseListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Log.d("Clicks", "Кнопка нажата: " + score + " " + getScoreAddition((int) score));
            score --;
            TextView mainText = findViewById(R.id.mainTxt);
            String s = "Кнопка нажата " + score + " " + getScoreAddition((int) score);
            mainText.setText(s.toCharArray(), 0, s.length());
        }
    };

    View.OnClickListener resetListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            score = 0;
            TextView mainText = findViewById(R.id.mainTxt);
            String s = "Кнопка нажата 0 раз";
            mainText.setText(s.toCharArray(), 0, s.length());
        }
    };

    public String getScoreAddition(int num) {
        int preLastDigit = num % 100 / 10;
        if (preLastDigit == 1) {
            return "раз";
        }
        switch (num % 10) {
            case 2:
            case 3:
            case 4:
                return "раза";
            default:
                return "раз";
        }
    }
}

