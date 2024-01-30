#!/bin/bash

# Runs the tests scripted in the `run.mjs` file with an optional parameters which is the ID of the environment.
# If nothing is provided it will be assumed the the `local` environment is the one which should be run.
node run.mjs $1