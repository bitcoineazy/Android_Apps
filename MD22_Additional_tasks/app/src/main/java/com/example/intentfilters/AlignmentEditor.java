package com.example.intentfilters;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

public class AlignmentEditor extends AppCompatActivity {
    Spinner spAlignments;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_alignment_editor);
        spAlignments = findViewById(R.id.spAlignment);

        String[] textAlignments = {"По правому краю", "По центру", "По левому краю"};

        ArrayAdapter<String> spinnerArrayAlignments = new ArrayAdapter<String>(
                this, android.R.layout.simple_spinner_item, textAlignments);
        spinnerArrayAlignments.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spAlignments.setAdapter(spinnerArrayAlignments);
    }

    public void onClick(View v) {
        Intent intent = new Intent();
        intent.putExtra("alignment", spAlignments.getSelectedItem().toString());
        setResult(RESULT_OK, intent);
        finish();
    }
}