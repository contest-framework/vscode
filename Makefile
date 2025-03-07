package:  # package the extension for local installation
	vsce package

publish-patch:  # publishes a new patch version
	vsce publish patch

publish-minor:  # publishes a new minor version
	vsce publish minor

publish-major:  # publishes a new major version
	vsce publish major

setup:  # prepare this code base for development
	npm install

test:  # runs all the tests
	${CURDIR}/node_modules/.bin/tsc -p .
	make --no-print-directory lint
	make --no-print-directory doc

update:  # updates all dependencies
	npx npm-check-updates -u
	npm install

.DEFAULT_GOAL := help
.SILENT:
