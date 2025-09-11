package com.transitpay_application.hce

import android.nfc.cardemulation.HostApduService
import android.os.Bundle

class TransitPayHostApduService : HostApduService() {

  private val selectApduHeader = byteArrayOf(0x00, 0xA4.toByte(), 0x04, 0x00)
  private val statusSuccess = byteArrayOf(0x90.toByte(), 0x00)
  private val statusFailed = byteArrayOf(0x6F.toByte(), 0x00)

  override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
    if (commandApdu == null || commandApdu.size < 4) return statusFailed
    return if (commandApdu.copyOfRange(0, 4).contentEquals(selectApduHeader)) {
      // Minimal response APDU data; replace with wallet tokenized data
      ("TRANSITPAY".toByteArray(Charsets.UTF_8) + statusSuccess)
    } else {
      statusFailed
    }
  }

  override fun onDeactivated(reason: Int) {
    // No-op for now
  }
}


