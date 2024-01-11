/*
 * Copyright (c) 2023 CONTROLLINO GmbH.
 *
 * SPDX-License-Identifier: MIT
 */

#include <Arduino.h>
#include "mongoose.h"

/**
 * \file device.cpp
 *
 * Custom mongoose device implementation based on arduino-pico resources
 *
 * \author Pedro Marquez @pmmarquez, CONTROLLINO Firmware Team
 */


#if MG_DEVICE == MG_DEVICE_CUSTOM

void* mg_flash_start(void) {
    return NULL;
}

size_t mg_flash_size(void) {
    return 0;
}

size_t mg_flash_sector_size(void) {
    return 0;
}

size_t mg_flash_write_align(void) {
    return 0;
}

int mg_flash_bank(void) {
    return 0;
}

bool mg_flash_erase(void* location) {
    (void)location;
    return false;
}

bool mg_flash_swap_bank(void) {
    return true;
}

bool mg_flash_write(void* addr, const void* buf, size_t len) {
    (void)addr, (void)buf, (void)len;
    return false;
}

void mg_device_reset(void) {
    rp2040.reboot();
}

#endif