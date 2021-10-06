package com.example.overwork_test;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

public class Results extends AppCompatActivity {
    TextView ResultDescription;
    TextView MetricsDescription;
    ImageView Metrics_1;
    ImageView Metrics_2;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_results);
        ResultDescription = findViewById(R.id.result_description);
        MetricsDescription = findViewById(R.id.metrics_description);
        Metrics_1 = findViewById(R.id.metrics_iv);
        Metrics_2 = findViewById(R.id.metrics_smile_iv);
        Intent intent = getIntent();
        int final_difference = intent.getIntExtra("final_difference", 0);
        Log.d("Difference","Final difference is: " + final_difference);

        int rank;
        if (final_difference > 0 && final_difference < 13) {
            resultAwesome();
        } else if (final_difference > 12 && final_difference < 19) {
            resultGood();
        } else if (final_difference > 18 && final_difference < 26) {
            resultBad();
        } else if (final_difference > 25) {
            resultWorst();
        }

    }

    public void resultAwesome() {
        ResultDescription.setText("Не забывайте о регулярном профессиональном медицинском осмотре!");
        MetricsDescription.setText("Введенные значения соответствуют отсутствию переутомления.");
        Metrics_1.setImageResource(R.drawable.percent_100);
        Metrics_2.setImageResource(R.drawable.percent_100);
    }

    public void resultGood() {

    }

    public void resultBad() {

    }

    public void resultWorst() {

    }
}