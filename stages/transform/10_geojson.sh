#!/bin/bash -e
ogr2ogr -oo GEOM_POSSIBLE_NAMES=geom -oo KEEP_GEOM_COLUMNS=NO temp/myr.geojson temp/myr.csv
