FROM scratch
LABEL maintainer=David.buret@gmail.com 
EXPOSE 80
COPY staticwebserver  index.html images  js  style gist /
CMD ["staticwebserver"]
