package com.transitpay_application.hce

import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import java.nio.charset.StandardCharsets
import java.util.*

class TransitPayHostApduService : HostApduService() {

    private val SELECT_AID = byteArrayOf(
        0x00.toByte(), 0xA4.toByte(), 0x04.toByte(), 0x00.toByte(), 0x05.toByte(),
        0xF0.toByte(), 0x12.toByte(), 0x34.toByte(), 0x56.toByte(), 0x78.toByte()
    )

    private val STATUS_SUCCESS = byteArrayOf(0x90.toByte(), 0x00.toByte())
    private val STATUS_FAILED = byteArrayOf(0x6F.toByte(), 0x00.toByte())

    override fun processCommandApdu(commandApdu: ByteArray, extras: Bundle?): ByteArray {
        return if (Arrays.equals(commandApdu, SELECT_AID)) {
            val response = "HelloPN532".toByteArray(StandardCharsets.UTF_8)
            response + STATUS_SUCCESS
        } else {
            STATUS_FAILED
        }
    }

    override fun onDeactivated(reason: Int) {
        // Handle deactivation if needed
    }
}
