.PHONY: build preview process-photos clean

build:
	node generate.js

preview:
	node generate.js
	@rm -rf /tmp/photos-preview && mkdir /tmp/photos-preview
	@ln -s $(CURDIR)/docs /tmp/photos-preview/photos
	npx --yes serve /tmp/photos-preview -l 8000

process-photos:
	bash process-photos-auto.sh

clean:
	rm -rf docs/
