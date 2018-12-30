package main

import (
	"log"
	"net/http"
)

func main() {

	var basepath = "/docgist/"

	http.Handle(basepath, http.StripPrefix(basepath,(http.FileServer(http.Dir("/") ))))

	log.Fatal(http.ListenAndServe(":80", nil))
}
