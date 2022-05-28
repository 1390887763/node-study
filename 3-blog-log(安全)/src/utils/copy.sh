#!/bin/sh
cd /Users/wangshaoyu/code/VSCodeProjects/flex布局练习/NodeJS/3-blog-log/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log