BIN = ./node_modules/.bin

#
# CLEAN
#

clean: ## Remove generated artifacts
	echo "> Cleaning ..."
	rm -rf cordova/www && mkdir -p cordova/www

mrproper: clean ## Remove all "non git" files
	echo "> Cleaning with mrproper ..."
	rm -rf node_modules/
	rm -rf vendor/phaser/dist/

#
# INSTALL
#

install: node_modules/ node_modules/phaser/ node_modules/devi-phaser/ ## Install all required dependencies

node_modules/: package.json
	echo "> Installing ..."
	npm --loglevel=error install > /dev/null
	touch $@

node_modules/phaser/: node_modules/pixi.js/ vendor/phaser/dist/phaser.js
	echo "> Creating $@ ..."
	cp vendor/phaser/dist/phaser.js $@/index.js
	echo '{"main":"index.js"}' > $@/package.json
	mkdir -p $@ && touch $@

node_modules/pixi.js/: vendor/phaser/dist/phaser.js
	echo "> Creating $@ ..."
	cp vendor/phaser/dist/pixi.js $@/index.js
	echo '{"main":"index.js"}' > $@/package.json
	mkdir -p $@ && touch $@

vendor/phaser/dist/phaser.js: vendor/phaser/dist/
	echo "> Building vendor/phaser ..."
	cd vendor/phaser \
		&& $(BIN)/grunt custom \
			--split true \
			--exclude p2,video,ninja,gamepad,creature,net \
			> /dev/null

vendor/phaser/dist/: vendor/phaser/package.json
	echo "> Installing vendor/phaser ..."
	cd vendor/phaser \
		&& npm --loglevel=error install --ignore-scripts > /dev/null \
		&& npm --loglevel=error install --ignore-scripts grunt-cli > /dev/null \
		&& rm -rf dist/modules
	mkdir -p $@ && touch $@

vendor/phaser/package.json:
	echo "> Fetching vendor/phaser ..."
	git submodule update --quiet --init vendor/phaser

# -- devi-phaser
node_modules/devi-phaser/: vendor/devi-phaser/build/index.js
	echo "> Creating $@ ..."
	cd node_modules && ln -s ../vendor/devi-phaser

vendor/devi-phaser/build/index.js: vendor/devi-phaser/package.json
	echo "> Building devi-phaser ..."
	cd vendor/devi-phaser \
		&& npm --loglevel=error install --ignore-scripts > /dev/null \
		&& make build

vendor/devi-phaser/package.json:
	echo "> Fetching vendor/devi-phaser ..."
	git submodule update --quiet --init vendor/devi-phaser

#
# BUILD
#

_build: clean install vendor/phaser/dist/phaser.js
	mkdir -p cordova/www
	cd cordova/www \
		&& ln -s ../../src/maps \
		&& ln -s ../../src/images \
		&& ln -s ../../src/game

build: _build ## Build project
	echo "> Building ($${NODE_ENV}) ..."
	$(BIN)/webpack --progress

build-watch: build ## Continuous build project
	# echo "> Patching JS source paths ..."
	# sed -i '' -e 's#src="js/#src="http://192.168.1.145:8080/js/#g' cordova/www/index.html
	echo "> Starting watch server ($${NODE_ENV}) ..."
	$(BIN)/webpack-dev-server

#
# MAKEFILE
#

help:
	echo "Available commands:"
	grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort --dictionary-order \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[35m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL = help

.PHONY: \
	clean mrproper \
	install \
	_build build build-watch

.SILENT:
