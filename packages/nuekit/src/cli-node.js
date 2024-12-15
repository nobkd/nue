#!/usr/bin/env bun

import esMain from 'es-main'

import { run } from './cli.js'

if (esMain(import.meta)) await run()
