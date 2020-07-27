#!/usr/bin/env node
/* eslint-disable */
const { runCLI, handleError } = require('.')

runCLI().catch(handleError)
