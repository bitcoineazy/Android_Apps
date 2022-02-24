package com.example.notes;

import androidx.appcompat.app.AppCompatActivity;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;

public class MainActivity extends AppCompatActivity {
    SharedPreferences settings;
    ArrayList<String> notes;
    ArrayAdapter<String> adapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ListView lvNotes = findViewById(R.id.lvNotes);
        settings = getSharedPreferences("Notes", Context.MODE_PRIVATE);

        notes = new ArrayList<>();
        adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, notes);
        lvNotes.setAdapter(adapter);

        HashSet<String> saved_notes = new HashSet<>(settings.getStringSet("saved_notes", Collections.singleton("")));
        String[] saved_notes_array = saved_notes.toArray(new String[saved_notes.size()]);

        for (int i = 0; i < saved_notes.size(); i++) {
            notes.add(saved_notes_array[i]);
        }
        adapter.notifyDataSetChanged();

        registerReceiver(broadcastReceiver, new IntentFilter("NOTE_BROADCAST"));

        Intent note_service = new Intent(this, NoteService.class);
        startForegroundService(note_service);
    }

    BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            notes.add(0, settings.getString("note", ""));
            adapter.notifyDataSetChanged();
        }
    };

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d("SERVICE", "onDestroy()");
        SharedPreferences.Editor noteEditor = settings.edit();

        HashSet<String> addedNotes = new HashSet<>(notes);

        noteEditor.putStringSet("saved_notes", addedNotes);
        noteEditor.apply();

        unregisterReceiver(broadcastReceiver);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.note_menu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.menu_refresh){
            notes.clear();
            adapter.notifyDataSetChanged();
        }
        return super.onOptionsItemSelected(item);
    }
}