#!/bin/bash

echo "[Credentials]
        endpoint = $1
        accessKeyID = $4
        accessKeySecret = $5
        " >> .ossutilconfig
ossutil -c .ossutilconfig cp -rf $2 $3
rm -rf dist/css dist/js dist/img
