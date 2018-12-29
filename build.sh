set -x

# use netgo so we do not need any shared lib
GGO_ENABLED=0 GOOS=linux go build -a -tags netgo -ldflags "-w" .
# save space
strip godocgist

chmod 755 godocgist

sudo docker build -t registry.buret.cc/dburet/docgist .

sudo docker images
