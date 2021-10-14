package com.example.md13;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.*;


import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    TextView mainTv;
    int random_number;
    boolean game_state = false;
    String game_mode = ""; // Режим игры (easy, medium, hard)

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mainTv = (TextView) findViewById(R.id.textView);

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.game_menu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        // Игрок может выбрать сложность только до начала игры
        // и может начать новую игру только после выбора сложности
        menu.setGroupVisible(R.id.group_modes, !game_state);
        menu.setGroupVisible(R.id.group_new_game, game_state);
        return super.onPrepareOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Проверяем какая сложность выбрана, генерируем случайное значение от 0 до 10, 50, 100
        // и обновляем глобальные переменные режима игры и статуса (game_mode, game_state)
        switch (item.getItemId()) {
            case (R.id.menu_easy):
                game_start("easy", 10);
                generate_random_number(10);
                return true;
            case (R.id.menu_medium):
                game_start("medium", 50);
                generate_random_number(50);
                return true;
            case (R.id.menu_hard):
                game_start("hard", 100);
                generate_random_number(100);
                return true;
            // Если выбрали пункт новая игра - сбрасываем глобальные переменные и предлагаем
            // пользователю начать новую игру, выбрав сложность
            case (R.id.menu_new_game):
                mainTv.setText(R.string.new_game);
                game_state = false;
                game_mode = "";
                return true;
            case (R.id.menu_exit):
                finish();
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public void game_start(String mode, int range) {
        game_state = true;
        game_mode = mode;
        mainTv.setText(String.format(Locale.ENGLISH,"Попробуйте угадать число!" +
                " \n\n Введите число от 0 до %d", range));
    }

    public void onClick(View v){
        EditText etInput = findViewById(R.id.editTextNumber);
        // Проверка на выбор сложности и пустой ввод
        if (!game_mode.equals("")) {
            if (etInput.getText().length() != 0) {
                int player_guess = Integer.parseInt(etInput.getText().toString());
                switch (game_mode) {
                    case "easy":
                        game_rules(player_guess, 10);
                        break;
                    case "medium":
                        game_rules(player_guess, 50);
                        break;
                    case "hard":
                        game_rules(player_guess, 100);
                        break;
                }
            } else {
                mainTv.setText(R.string.empty_error);
            }
        } else {
            mainTv.setText(R.string.error_diff);
        }
    }


    // Правила для всех режимов игры (easy, medium, hard)
    public void game_rules(int answer, int range) {
        if (0 <= answer && range >= answer) {
            if (answer > random_number) {
                mainTv.setText(R.string.ahead);
            }
            if (answer < random_number) {
                mainTv.setText(R.string.behind);
            }
            if (answer == random_number) {
                mainTv.setText(R.string.hit);
                game_state = false;
                game_mode = "";
            }
        }
        // Допустимый диапазон для всех режимов игры
        else {
            mainTv.setText(String.format(Locale.ENGLISH, "Число не находится" +
                    " в диапазоне от 0 до %d \n\n Повторите ввод", range));
        }
    }

    public void generate_random_number(int max) {
        int random_int = (int) (Math.random() * ++max);
        Log.d("Random", "Random number is: " + random_int);
        random_number = random_int;
    }

    // Завершить работу приложения
    public void destroyApp(View v) {
        finish();
    }
}