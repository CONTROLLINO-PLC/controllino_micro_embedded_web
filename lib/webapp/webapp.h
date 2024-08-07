/*
 * Copyright (c) 2023 CONTROLLINO GmbH.
 *
 * SPDX-License-Identifier: MIT
 */

#pragma once

/**
 * \file webapp.h
 *
 * Web embedded application difinitions using mongoose
 * Based on mongoose device-dashboard example
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

void webAppInit(struct mg_mgr* mgr, mg_tcpip_if* mif);
void webAppRun(struct mg_mgr* mgr);

#ifdef __cplusplus
}
#endif
