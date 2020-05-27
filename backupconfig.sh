#!/bin/bash
#This script backs up the config files.

NAME=Bozoid_Backup_Config_$(date +'%F_%T')
DIR=/home/montieyd/BozoidJS
mkdir $DIR/backup &> /dev/null
zip -r $DIR/backup/$NAME.zip $DIR/config
