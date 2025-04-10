#!/usr/bin/env bash

git pull --recurse-submodules
git submodule update --recursive --remote
rm -f site.tar.gz
mkdocs build
tar czvf site.tar.gz site