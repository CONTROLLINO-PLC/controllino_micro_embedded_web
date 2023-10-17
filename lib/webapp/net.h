/*
 * Copyright (c) 2023 CONTROLLINO GmbH.
 *
 * SPDX-License-Identifier: MIT
 */

#pragma once

/**
 * \file net.h
 *
 * Web embedded application difinitions using mongoose
 * Based on mongoose device-dashboard example (Copyright (c) 2023 Cesanta Software Limited)
 *
 * \author Pedro Marquez @pmmarquez, CONTROLLINO Firmware Team
 */

#include "mongoose.h"

#ifdef __cplusplus
extern "C" {
#endif

#if !defined(HTTP_URL)
#define HTTP_URL "http://0.0.0.0:80"
#endif

void webAppInit(void);
void webAppRun(void);

#ifdef __cplusplus
}
#endif
