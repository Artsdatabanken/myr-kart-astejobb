#!/bin/bash -e
ogr2ogr -oo GEOM_POSSIBLE_NAMES=geom -oo KEEP_GEOM_COLUMNS=NO myr.geojson myr.csv
