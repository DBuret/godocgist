FROM scratch
ADD staticwebserver /
ADD index.html /
ADD images /
ADD js /
ADD style /
ADD gist /
CMD ["staticwebserver"]
