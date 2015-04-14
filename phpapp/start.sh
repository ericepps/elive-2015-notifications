#! /bin/bash
 
#INIFILE="$(pwd)/server/server.ini"
DOCROOT="$(pwd)/public"
ROUTER="$(pwd)/server/router.php"
HOST=library.bret.edu
PORT=8999
 
PHP=$(which php)
if [ $? != 0 ] ; then
    echo "Unable to find PHP"
    exit 1
fi
 
#$PHP -S $HOST:$PORT -c $INIFILE -t $DOCROOT $ROUTER
echo $PHP -S $HOST:$PORT -t $DOCROOT $ROUTER
$PHP -S $HOST:$PORT -t $DOCROOT $ROUTER
