package main

import (
	"log"
	"net/http"
)

func main() {

	http.Handle("/docgist", http.FileServer(http.Dir("/")))

	log.Fatal(http.ListenAndServe(":80", nil))
}
