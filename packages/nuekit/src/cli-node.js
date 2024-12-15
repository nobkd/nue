#!/usr/bin/env bun

import { pathToFileURL } from 'node:url'

import { run } from './cli.js'

if (import.meta.url === pathToFileURL(process.argv[1]).href) await run()
