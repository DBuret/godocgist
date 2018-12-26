# use netgo so we do not need any shared lib
GGO_ENABLED=0 GOOS=linux go build -a -tags netgo -ldflags "-w" .
# save space
strip staticwebserver

chmod 755 staticwebserver

sudo docker build -t dburet/docgist .

sudo docker images