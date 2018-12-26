GGO_ENABLED=0 GOOS=linux go build -a -tags netgo -ldflags "-w" .
strip staticwebserver
chmod 755 staticwebserver
sudo docker build -t dburet/staticwebserver .
sudo docker images