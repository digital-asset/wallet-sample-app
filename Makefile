SDK_VERSION := $(shell grep 'sdk-version' daml.yaml | cut -d ' ' -f 2)

.PHONY: build
build: build-dars

#Dars

.PHONY: build-dars
build-dars:
	./build.sh

.PHONY: test
test:
	cd main/Tests && daml test --color

.PHONY: clean
clean: 
	./clean.sh

.PHONY: codegen
codegen:
	./codegen.sh

.PHONY: sandbox
sandbox:
	daml sandbox --dar main/Asset/asset.dar --dar main/User/user.dar --dar main/Account/account.dar --port-file ./canton-port.txt

.PHONY: server
server:
	daml json-api --config json-api-app.conf


.PHONY: everything
everything:
	make build
	make codegen

.PHONY: parties
parties:
	daml script --dar ./main/Account/account.dar --script-name Setup:setup --ledger-host localhost --ledger-port 6865


.PHONY: navigator
navigator:
	daml navigator server localhost 6865
