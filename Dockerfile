FROM scratch
LABEL maintainer=David.buret@gmail.com 
EXPOSE 80
COPY godocgist /
COPY  index.html /
COPY images/ /images/
COPY js/  /js/ 
COPY style/ /style/
COPY /gists/ /gists/
CMD ["/godocgist"]
