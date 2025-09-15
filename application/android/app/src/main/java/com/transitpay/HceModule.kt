package com.transitpay

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.widget.Toast

class HceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "HceModule"
    }

    @ReactMethod
    fun sendPayload(payload: String) {
        val context = reactApplicationContext
        val intent = Intent(context, KHostApduService::class.java)
        intent.putExtra("ndefMessage", payload)
        context.startService(intent)

        Toast.makeText(context, "Payload sent to HCE: $payload", Toast.LENGTH_SHORT).show()
    }
}
