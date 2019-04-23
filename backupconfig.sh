#!/bin/bash
NAME=Bozoid_Backup_Config_$(date +'%F_%T')
DIR=/home/ubuntu/BozoidJS
mkdir $DIR/../BozoidJS_Backup &> /dev/null
cp -r $DIR/config $DIR/../BozoidJS_Backup/$NAME
