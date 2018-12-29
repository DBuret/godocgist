FROM scratch
LABEL maintainer=David.buret@gmail.com 
EXPOSE 80
COPY godocgist  index.html images  js  style gists /
CMD ["godocgist"]
