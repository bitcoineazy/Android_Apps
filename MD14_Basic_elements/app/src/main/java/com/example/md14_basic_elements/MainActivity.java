package com.example.md14_basic_elements;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.*;

import java.util.ArrayList;
import java.util.Comparator;

public class MainActivity extends AppCompatActivity{
    TextView mainTV;
    EditText mainEditText;
    ListView mainListView;
    ArrayAdapter mArrayAdapter;
    ArrayList mNameList = new ArrayList();
    Button mainButton, add_btn, reset_btn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mainButton = findViewById(R.id.update_tv_btn);
        mainTV = findViewById(R.id.main_tv);
        mainEditText = findViewById(R.id.main_edittext);
        mainListView = findViewById(R.id.main_listview);
        add_btn = findViewById(R.id.add_btn);
        reset_btn = findViewById(R.id.reset_btn);

        mainListView.setOnItemClickListener(arrayListener);
        mainButton.setOnClickListener(oclBtn);
        add_btn.setOnClickListener(oclBtn);
        reset_btn.setOnClickListener(oclBtn);

        mArrayAdapter = new ArrayAdapter(this,
                android.R.layout.simple_list_item_1,
                mNameList);
        mainListView.setAdapter(mArrayAdapter);
    }

    AdapterView.OnItemClickListener arrayListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
            Log.d("omg android", position + ": " + mNameList.get(position));
            String value = mNameList.get(position).toString()
                    + " is learning Android development!";
            mainTV.setText(value);
            // Удаление выделенных элементов списка
            mNameList.remove(position);
            mArrayAdapter.notifyDataSetChanged();
        }
    };

    View.OnClickListener oclBtn = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            switch (v.getId()) {
                case (R.id.update_tv_btn):
                    String greeting = mainEditText.getText().toString() + " is learning Android development!";
                    mainTV.setText(greeting);
                    Toast.makeText(getApplicationContext(), "Нажата кнопка Update TV",
                            Toast.LENGTH_LONG).show();
                    break;
                case (R.id.reset_btn):
                    // кнопка Cancel
                    mainTV.setText("Список очищен");
                    Toast.makeText(getApplicationContext(), "Нажата кнопка RESET",
                            Toast.LENGTH_LONG).show();
                    mNameList.clear();
                    mArrayAdapter.notifyDataSetChanged();
                    break;
                case (R.id.add_btn):
                    // кнопка ОК
                    Toast.makeText(getApplicationContext(), "Нажата кнопка ADD",
                            Toast.LENGTH_LONG).show();
                    String text_value = mainEditText.getText().toString();
                    // Условие добавления нового эл-та в список
                    boolean is_possible = true;
                    if (mNameList.size() > 0) {
                        // Проходимся в цикле по всем элементам списка и проверяем есть ли совпадение
                        for (int i=0; i < mNameList.size(); i++) {
                            if (text_value.equals(mNameList.get(i))) {
                                Log.e("Unique", "value: " + mNameList.get(i) + " already in array");
                                // Если нашли такой же элемент - создание нового такого же невозможно
                                is_possible = false;
                            }
                        }
                        // Если не встретили одинаковый элемент добавляем новый и сортируем список
                        if (is_possible) {
                            String value = "Значение: " +
                                    text_value + " добавлено в список.";
                            mainTV.setText(value);
                            mNameList.add(text_value);
                            // Сортируем все значения в списке по алфавиту
                            mNameList.sort(Comparator.naturalOrder());
                            mArrayAdapter.notifyDataSetChanged();
                        } else {
                            String value = "Значение: " +
                                    text_value + " уже существует в списке!";
                            mainTV.setText(value);
                        }
                        // Добавляем первый элемент в список
                    } else {
                        mNameList.add(text_value);
                        mArrayAdapter.notifyDataSetChanged();
                    }
                    break;
            }
        }
    };
}