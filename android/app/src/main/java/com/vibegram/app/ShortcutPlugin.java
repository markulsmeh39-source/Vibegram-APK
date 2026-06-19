package com.vibegram.app;

import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Icon;
import android.net.Uri;
import android.os.Build;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Shortcut")
public class ShortcutPlugin extends Plugin {

    @PluginMethod
    public void addShortcut(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            call.reject("Not supported on this Android version");
            return;
        }

        try {
            String id = call.getString("id");
            String title = call.getString("title");
            String url = call.getString("url");
            String iconUrl = call.getString("iconUrl");

            ShortcutManager shortcutManager = getContext().getSystemService(ShortcutManager.class);

            if (shortcutManager != null && shortcutManager.isRequestPinShortcutSupported()) {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                // Open app with deep link to shortcut url.
                // It opens full screen if we manage it in JS 
                intent.setData(Uri.parse(url));
                intent.setPackage(getContext().getPackageName());
                intent.setAction(Intent.ACTION_VIEW);

                ShortcutInfo.Builder shortcutBuilder = new ShortcutInfo.Builder(getContext(), id)
                        .setShortLabel(title)
                        .setIntent(intent);

                if (iconUrl != null && !iconUrl.isEmpty()) {
                    try {
                        URL iconLocation = new URL(iconUrl);
                        HttpURLConnection connection = (HttpURLConnection) iconLocation.openConnection();
                        connection.setDoInput(true);
                        connection.connect();
                        InputStream input = connection.getInputStream();
                        Bitmap bitmap = BitmapFactory.decodeStream(input);
                        shortcutBuilder.setIcon(Icon.createWithBitmap(bitmap));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                ShortcutInfo shortcutInfo = shortcutBuilder.build();
                shortcutManager.requestPinShortcut(shortcutInfo, null);
                
                call.resolve();
            } else {
                call.reject("Pinning shortcut not supported");
            }
        } catch (Exception e) {
            call.reject("Error: " + e.getMessage());
        }
    }
}
