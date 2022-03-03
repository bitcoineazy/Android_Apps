package com.example.services;

import android.app.Service;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Binder;
import android.os.IBinder;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

public class PlayService extends Service {
    IBinder mBinder = new PlayServiceBinder();
    ArrayList<Integer> playlist;
    MediaPlayer mediaPlayer;
    Timer timer;
    //Счётчик песен
    int i = 0;

    public class PlayServiceBinder extends Binder {
        PlayService getService() {
            return PlayService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        //Массив с треками
        playlist = new ArrayList<>();
        playlist.add(R.raw.hiphopbeat);
        playlist.add(R.raw.afrobeat);
        playlist.add(R.raw.ambientbeat);
        playlist.add(R.raw.comedybeat);
        playlist.add(R.raw.knights_academy);
        playlist.add(R.raw.logopreview);
        playlist.add(R.raw.shortlogo);

        mediaPlayer = MediaPlayer.create(this, playlist.get(0));
        mediaPlayer.start();

        timer = new Timer();
        if (playlist.size() > 1) nextSong();
    }

    //Следующий трек по таймеру (после завершения предыдущего)
    public void nextSong() {
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                mediaPlayer.reset();
                mediaPlayer = MediaPlayer.create(PlayService.this, playlist.get(++i));
                mediaPlayer.start();
                if (playlist.size() > i+1) {
                    nextSong();
                }
            }
        }, mediaPlayer.getDuration());
    }

    //Следующий трек по кнопке
    public void playNext() {
        if (mediaPlayer.isPlaying())
            mediaPlayer.stop();
        timer.cancel();
        mediaPlayer.reset();
        if (playlist.size() > i+1) {
            Toast.makeText(PlayService.this.getApplicationContext(),
                    "Следующая композиция по кнопке",
                    Toast.LENGTH_SHORT).show();
            mediaPlayer = MediaPlayer.create(PlayService.this, playlist.get(++i));
            mediaPlayer.start();
            timer = new Timer();
            nextSong();
        } else {
            Toast.makeText(PlayService.this.getApplicationContext(),
                    "Композиции закончились",
                    Toast.LENGTH_SHORT).show();
            i = -1;
        }
    }

    @Override
    public void onDestroy() {
        if (mediaPlayer.isPlaying())
            mediaPlayer.stop();
        timer.cancel();
        super.onDestroy();
    }
}