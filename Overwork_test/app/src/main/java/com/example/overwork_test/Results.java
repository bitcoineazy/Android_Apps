package com.example.overwork_test;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.Arrays;

public class Results extends AppCompatActivity {
    TextView ResultDescription;
    TextView MetricsDescription;
    ImageView Metrics_1;
    ImageView Metrics_2;
    String[] credentials;


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
        int pulse_lie = intent.getIntExtra("pulse_lie", 0);
        int pulse_stand = intent.getIntExtra("pulse_stand", 0);
        credentials = intent.getStringArrayExtra("credentials");
        Log.d("Difference","Final difference is: " + final_difference);
        Log.d("User credential", "date; month; year; gender " + Arrays.toString(credentials));

        if (pulse_lie < 140 && pulse_stand < 160) {
            if (final_difference >= 0 && final_difference < 13) {
                resultAwesome();
            } else if (final_difference > 12 && final_difference < 19) {
                resultGood();
            } else if (final_difference > 18 && final_difference < 26) {
                resultBad();
            } else if (final_difference > 25) {
                resultWorst();
            }
        } else { // Если пульс слишком высокий
            resultHospitalization();
        }

    }

    public void resultAwesome() {
        ResultDescription.setText("Не забывайте о регулярном профессиональном медицинском осмотре!");
        MetricsDescription.setText("Введенные значения соответствуют отсутствию переутомления.");
        Metrics_1.setImageResource(R.drawable.percent_100);
        Metrics_2.setImageResource(R.drawable.awesome_condition);

    }

    public void resultGood() {
        ResultDescription.setText("Вам необходимо отдохнуть и проконсультироваться со специалистом, если состояние не улучшится!");
        MetricsDescription.setText("Введенные значения соответствуют умеренному уровню переутомления");
        Metrics_1.setImageResource(R.drawable.percent_60);
        Metrics_2.setImageResource(R.drawable.good_condition);
    }

    public void resultBad() {
        ResultDescription.setText("Вам необходимо срочно отдохнуть и обратиться в мед учреждение для осмотра!");
        MetricsDescription.setText("Введенные значения соответствуют сильному уровню переутомления");
        Metrics_1.setImageResource(R.drawable.percent_40);
        Metrics_2.setImageResource(R.drawable.bad_condition);
    }

    public void resultWorst() {
        ResultDescription.setText("Вам необходима срочная госпитализация и больничный режим!");
        MetricsDescription.setText("Введенные значения соответствуют критическому уровню переутомления!");
        Metrics_1.setImageResource(R.drawable.percent_0);
        Metrics_2.setImageResource(R.drawable.worst_condition);
    }

    public void resultHospitalization() {
        ResultDescription.setText("У вас слишком высокий пульс!");
        MetricsDescription.setText("Введенные значения соответствуют критическому показателю пульса");
        Metrics_1.setImageResource(R.drawable.percent_0);
        Metrics_2.setImageResource(R.drawable.worst_condition);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        menu.setGroupVisible(R.id.exit_group, false);
        return super.onPrepareOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.menu_new_game) {
            finish();
        }
        return super.onOptionsItemSelected(item);
    }
}