package com.example.intentfilters;

import androidx.appcompat.app.AppCompatActivity;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.ImageDecoder;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import java.io.IOException;

public class CameraActivity extends AppCompatActivity {
    final int CAPTURE_PHOTO = 1;
    ImageView ivCaptured;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera);
        ivCaptured = findViewById(R.id.ivCaptured);
    }

    public void onClick(View view) {
        try {
            Intent captureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            startActivityForResult(captureIntent, CAPTURE_PHOTO);
        } catch (ActivityNotFoundException e) {
            String errorMessage = "Устройство не поддерживает фото-съёмку";
            Toast toast = Toast.makeText(this, errorMessage, Toast.LENGTH_SHORT);
            toast.show();
        }
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            if (requestCode == CAPTURE_PHOTO) {
                Bitmap bitmap = (Bitmap) data.getExtras().get("data");
                ivCaptured.setImageBitmap(bitmap);
            }
        }
    }
}