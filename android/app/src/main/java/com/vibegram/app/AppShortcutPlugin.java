package com.vibegram.app;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;

import androidx.core.content.pm.ShortcutInfoCompat;
import androidx.core.content.pm.ShortcutManagerCompat;
import androidx.core.graphics.drawable.IconCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.InputStream;
import java.net.URL;

@CapacitorPlugin(name = "AppShortcut")
public class AppShortcutPlugin extends Plugin {

    @PluginMethod
    public void createShortcut(PluginCall call) {
        String id = call.getString("id");
        String title = call.getString("title");
        String iconUrl = call.getString("icon");
        String data = call.getString("data");

        if (id == null || title == null) {
            call.reject("Must provide id and title");
            return;
        }

        Context context = getContext();
        if (ShortcutManagerCompat.isRequestPinShortcutSupported(context)) {
            AsyncTask.execute(() -> {
                try {
                    Bitmap bitmap = null;
                    if (iconUrl != null && !iconUrl.isEmpty()) {
                        InputStream in = new URL(iconUrl).openStream();
                        bitmap = BitmapFactory.decodeStream(in);
                    }

                    Intent intent = new Intent(context, MainActivity.class);
                    intent.setAction(Intent.ACTION_VIEW);
                    if (data != null && !data.isEmpty()) {
                       intent.setData(Uri.parse("com.vibegram.app://auth?miniapp=" + data));
                    }
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    
                    ShortcutInfoCompat.Builder builder = new ShortcutInfoCompat.Builder(context, id)
                            .setShortLabel(title)
                            .setIntent(intent);
                    
                    if (bitmap != null) {
                        builder.setIcon(IconCompat.createWithBitmap(bitmap));
                    }

                    ShortcutInfoCompat shortcutInfo = builder.build();
                    ShortcutManagerCompat.requestPinShortcut(context, shortcutInfo, null);
                    call.resolve();
                } catch (Exception e) {
                    call.reject("Error creating shortcut", e);
                }
            });
        } else {
            call.reject("Shortcuts not supported");
        }
    }
}
