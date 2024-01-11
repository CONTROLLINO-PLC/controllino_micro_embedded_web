/*
 * Copyright (c) 2023 CONTROLLINO GmbH.
 *
 * SPDX-License-Identifier: MIT
 */

#include "mongoose.h"

/**
 * \file syscalls.c
 *
 * Mocking syscalls for mongoose.
 *
 * \author Pedro Marquez @pmmarquez, CONTROLLINO Firmware Team
 */

int mkdir(const char *path, mode_t mode) {
  (void) path, (void) mode;
  return -1;
}
