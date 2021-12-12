package com.example.overwork_test;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

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

        credentials = intent.getStringArrayExtra("credentials");
        String first_value = intent.getStringExtra("first_value");
        String second_value = intent.getStringExtra("second_value");

        // Формирование JSON даты для запроса
        JSONObject json_data = new JSONObject();
        try {
            json_data.put("day", "1");
            json_data.put("month", "1");
            json_data.put("year", "1995");
            json_data.put("sex", "1");
            json_data.put("first_value", first_value);
            json_data.put("second_value", second_value);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try {
            // Отправка POST запроса на локальный сервер http://localhost:80/ через https туннель ngrok
            overwork_api("https://02f7-46-138-193-85.ngrok.io/burnout/", json_data.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
    public static final MediaType JSON
            = MediaType.get("application/json; charset=utf-8");

    OkHttpClient client = new OkHttpClient();

    public void overwork_api(String url, String json) throws IOException {
        RequestBody body = RequestBody.create(json, JSON);
        Request request = new Request.Builder().url(url).post(body).build();
        // Поток отправки запроса и обработки ответа (обновляет tv при получении ответа 200)
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    String message = response.body().string();
                    String format_message = message.
                            replace("["+"\"", "").
                            replace("\""+"]", "");
                    Log.d("response", message);
                    // Обновление интерфейса при получении ответа
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            MetricsDescription.setText(format_message);
                            if (format_message.contains("отсутствию")) {
                                resultAwesome();
                            } else if (format_message.contains("небольшому")) {
                                resultGood();
                            } else if (format_message.contains("высокому")) {
                                resultBad();
                            } else if (format_message.contains("Error")) {
                                resultWorst();
                            }
                        }
                    });
                }
            }
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }
        });
    }

    public void resultAwesome() {
        ResultDescription.setText("Не забывайте о регулярном профессиональном медицинском осмотре!");
        Metrics_1.setImageResource(R.drawable.percent_100);
        Metrics_2.setImageResource(R.drawable.awesome_condition);

    }

    public void resultGood() {
        ResultDescription.setText("Вам необходимо отдохнуть и проконсультироваться со специалистом, если состояние не улучшится!");
        Metrics_1.setImageResource(R.drawable.percent_60);
        Metrics_2.setImageResource(R.drawable.good_condition);
    }

    public void resultBad() {
        ResultDescription.setText("Вам необходимо срочно отдохнуть и обратиться в мед учреждение для осмотра!");
        Metrics_1.setImageResource(R.drawable.percent_40);
        Metrics_2.setImageResource(R.drawable.bad_condition);
    }

    public void resultWorst() {
        ResultDescription.setText("Вам необходима срочная госпитализация и больничный режим!");
        Metrics_1.setImageResource(R.drawable.percent_0);
        Metrics_2.setImageResource(R.drawable.worst_condition);
    }
}
