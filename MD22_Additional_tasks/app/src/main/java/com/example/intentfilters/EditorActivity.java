package com.example.intentfilters;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class EditorActivity extends AppCompatActivity {
    Button btnColorEditor;
    Button btnAlignmentEditor;
    TextView tvEditor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_editor);
        btnColorEditor = findViewById(R.id.btnColorEditor);
        btnAlignmentEditor = findViewById(R.id.btnAlignmentEditor);
        tvEditor = findViewById(R.id.tvEditorText);

    }

    public void onClick (View v) {
        switch (v.getId()) {
            case (R.id.btnColorEditor):
                Intent colorEditor = new Intent(this, ColorEditor.class);
                startActivityForResult(colorEditor, 1);
                break;
            case (R.id.btnAlignmentEditor):
                Intent alignmentEditor = new Intent(this, AlignmentEditor.class);
                startActivityForResult(alignmentEditor, 2);
                break;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (data == null) {return;}
        Log.d("Request code", "Request code is: " + requestCode);
        switch (requestCode) {
            case 1:
                String color = data.getStringExtra("color");
                Log.d("Color", "color is: " + color);
                switch (color) {
                    case "Красный":
                        tvEditor.setTextColor(Color.RED);
                        break;
                    case "Синий":
                        tvEditor.setTextColor(Color.BLUE);
                        break;
                    case "Жёлтый":
                        tvEditor.setTextColor(Color.YELLOW);
                        break;
                    case "Зелёный":
                        tvEditor.setTextColor(Color.GREEN);
                        break;
                    case "Чёрный":
                        tvEditor.setTextColor(Color.BLACK);
                        break;
                    case "Розовый":
                        tvEditor.setTextColor(Color.parseColor("#DF00FF"));
                        break;
                }
                break;
            case 2:
                String alignment = data.getStringExtra("alignment");
                Log.d("Alignment", "alignment is: " + alignment);
                switch (alignment) {
                    case "По правому краю":
                        tvEditor.setTextAlignment(View.TEXT_ALIGNMENT_TEXT_START);
                        break;
                    case "По центру":
                        tvEditor.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
                        break;
                    case "По левому краю":
                        tvEditor.setTextAlignment(View.TEXT_ALIGNMENT_TEXT_END);
                        break;
                }
                break;
        }
    }
}