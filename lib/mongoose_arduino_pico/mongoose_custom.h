/*
 * Copyright (c) 2023 CONTROLLINO GmbH.
 *
 * SPDX-License-Identifier: MIT
 */

#pragma once

/**
 * \file mongoose_custom.h
 *
 * Mongoose custom definitions
 *
 * \author Pedro Marquez @pmmarquez, CONTROLLINO Firmware Team
 */

#define MG_ARCH MG_ARCH_RP2040
#define MG_ENABLE_SOCKET 0
#define MG_ENABLE_TCPIP 1

#define MG_ENABLE_PACKED_FS 1
#define MG_OTA MG_OTA_CUSTOM
#define MG_DEVICE MG_DEVICE_CUSTOM