SHELL = /bin/sh
PORT = 8090
REPO = https://github.com/digitalamati/AmatiML

install:
	git clone $(REPO)
	cd AmatiML && raco pkg install

update:
	cd AmatiML && git pull
	cd AmatiML && raco pkg update

run: 
	node server.js $(PORT)
