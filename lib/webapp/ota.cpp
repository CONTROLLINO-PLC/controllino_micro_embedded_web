#include <Updater.h>
#include <PicoOTA.h>
#include <pico_base/pico/ota_command.h>
#include "mongoose.h"

#define FW_INFO_FILE "fwinfo.bin"

typedef struct {
    int status;
    size_t size;
    uint32_t crc32;
    uint32_t timestamp;
} fw_info_t;

// 0: curren, 1: previous
static fw_info_t _fw_info[2];
static uint32_t _crc32;

#if MG_OTA == MG_OTA_CUSTOM

void _write_fw_info(void) {
    File f = LittleFS.open(FW_INFO_FILE, "w");
    f.write((uint8_t*)_fw_info, sizeof(_fw_info));
    f.close();
}

bool _read_fw_info(void) {
    File f = LittleFS.open(FW_INFO_FILE, "r");
    if (!f) {
        return false;
    }
    f.read((uint8_t*)_fw_info, sizeof(_fw_info));
    f.close();
    return true;
}

void _reset_fw_info(int fw) {
    _fw_info[MG_FIRMWARE_CURRENT].status = MG_OTA_UNAVAILABLE;
    _fw_info[MG_FIRMWARE_CURRENT].size = 0;
    _fw_info[MG_FIRMWARE_CURRENT].crc32 = 0;
    _fw_info[MG_FIRMWARE_CURRENT].timestamp = 0;
}

bool mg_ota_begin(size_t new_firmware_size) {
    _reset_fw_info(MG_FIRMWARE_CURRENT);
    _write_fw_info();
    _crc32 = 0xffffffff;
    return Update.begin(new_firmware_size);
}

bool mg_ota_write(const void* buf, size_t len) {
    // Update crc32
    uint8_t* data = (uint8_t*)buf;
    for (uint32_t i = 0; i < len; i++) {
        _crc32 ^= data[i];
        for (int j = 0; j < 8; j++) {
            if (_crc32 & 1) {
                _crc32 = (_crc32 >> 1) ^ 0xedb88320;
            }
            else {
                _crc32 >>= 1;
            }
        }
    }
    // Write
    if (Update.write((uint8_t*)buf, len) != len) {
        return false;
    }
    return true;
}

bool mg_ota_end(void) {
    // End Updater
    if (!Update.end()) {
        return false;
    }
    // Update fw info
    File f = LittleFS.open("firmware.bin", "r");
    if (!f) {
        return false;
    }
    _fw_info[MG_FIRMWARE_CURRENT].timestamp = f.getCreationTime();
    _fw_info[MG_FIRMWARE_CURRENT].size = f.size();
    _fw_info[MG_FIRMWARE_CURRENT].crc32 = _crc32;
    _fw_info[MG_FIRMWARE_CURRENT].status = MG_OTA_UNCOMMITTED;
    f.close();
    _write_fw_info();
    // Reset OTA comand page to avoid commited firmware.bin in Update.end()
    picoOTA.begin();
    picoOTA.commit();
    return true;
}

bool mg_ota_commit(void) {
    // Commit firmware.bin to OTA command page
    picoOTA.begin();
    if (!picoOTA.addFile("firmware.bin")) {
        return false;
    }
    if (!picoOTA.commit()) {
        return false;
    }
    // Change status to committed
    _fw_info[MG_FIRMWARE_CURRENT].status = MG_OTA_COMMITTED;
    return true;
}

int mg_ota_status(int fw) {
    if (fw == MG_FIRMWARE_CURRENT) {
        return _fw_info[MG_FIRMWARE_CURRENT].status;
    }
    return _fw_info[MG_FIRMWARE_PREVIOUS].status;
}

uint32_t mg_ota_crc32(int fw) {
    if (fw == MG_FIRMWARE_CURRENT) {
        return _fw_info[MG_FIRMWARE_CURRENT].crc32;
    }
    return _fw_info[MG_FIRMWARE_PREVIOUS].crc32;
}
uint32_t mg_ota_timestamp(int fw) {
    if (fw == MG_FIRMWARE_CURRENT) {
        return _fw_info[MG_FIRMWARE_CURRENT].timestamp;
    }
    return _fw_info[MG_FIRMWARE_PREVIOUS].timestamp;
}

size_t mg_ota_size(int fw) {
    if (fw == MG_FIRMWARE_CURRENT) {
        return _fw_info[MG_FIRMWARE_CURRENT].size;
    }
    return _fw_info[MG_FIRMWARE_PREVIOUS].size;
}

MG_IRAM void mg_ota_boot(void) {
    // Try get fw info
    LittleFS.begin();
    if (!_read_fw_info()) {
        // No fw info reset fw info
        _reset_fw_info(MG_FIRMWARE_CURRENT);
        _reset_fw_info(MG_FIRMWARE_PREVIOUS);
    }
    else {
        switch (_fw_info[MG_FIRMWARE_CURRENT].status)
        {
        case MG_OTA_COMMITTED:
            _fw_info[MG_FIRMWARE_CURRENT].status = MG_OTA_FIRST_BOOT;
            // Reset OTA command page to avoid delayed boot from now on
            picoOTA.begin();
            picoOTA.commit();
            break;
        case MG_OTA_FIRST_BOOT:
            // Copy firmware.bin to firmware.old.bin to set previous fw
            if (LittleFS.rename("firmware.bin", "firmware.old.bin")) {
                _fw_info[MG_FIRMWARE_PREVIOUS] = _fw_info[MG_FIRMWARE_CURRENT];
                _fw_info[MG_FIRMWARE_PREVIOUS].status = MG_OTA_COMMITTED;
            }
            // Reset current fw info
            _reset_fw_info(MG_FIRMWARE_CURRENT);
            break;
        }
    }
    _write_fw_info();
}

bool mg_ota_rollback(void) {
    // Rollback firmware.bin to firmware.old.bin
    LittleFS.remove("firmware.bin");
    if (!LittleFS.rename("firmware.old.bin", "firmware.bin")) {
        return false;
    }
    if (!mg_ota_commit()) {
        return false;
    }
    _fw_info[MG_FIRMWARE_CURRENT] = _fw_info[MG_FIRMWARE_PREVIOUS];
    _fw_info[MG_FIRMWARE_CURRENT].status = MG_OTA_COMMITTED;
    _reset_fw_info(MG_FIRMWARE_PREVIOUS);
    _write_fw_info();
    return true;
}

#endif