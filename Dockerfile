FROM 369181834085.dkr.ecr.ap-east-1.amazonaws.com/openresty:1.19.3.1-1-centos
MAINTAINER mang <mang@mang.com>
ADD ./dist /usr/local/openresty/nginx/html
