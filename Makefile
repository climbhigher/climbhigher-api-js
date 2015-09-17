define RunSql
	PGPASSWORD=$(DB_PASS) psql -h $(DB_HOST) -d $(DB_NAME) -U $(DB_USER) -f $(1)
endef

NODE := $(shell which node)
NPM := $(shell which npm)
NPM_BIN := ./node_modules/.bin

DB_MIGRATIONS_DIR := ./db/migrations
DB_SEEDS_DIR := ./db/seeds
DB_MIGRATIONS := $(wildcard $(DB_MIGRATIONS_DIR)/*.sql)
DB_SEEDS := $(wildcard $(DB_SEEDS_DIR)/*.sql)

-include .env

bootstrap:
	$(NPM) install

test:
	CH_ENV=test $(NPM_BIN)/mocha ./test/climb-higher/*.js

deploy:
	git push heroku master

init-db:
	createuser -h $(DB_HOST) -s -e $(DB_USER)
	createdb -h $(DB_HOST) -U $(DB_USER) -e $(DB_NAME)

explore-db:
	PGPASSWORD=$(DB_PASS) psql -h $(DB_HOST) -d $(DB_NAME) -U $(DB_USER)

migrate:
	$(foreach sql, $(DB_MIGRATIONS), $(call RunSql, $(sql)))

seed:
	$(foreach sql, $(DB_SEEDS), $(call RunSql, $(sql)))

clean:
	@-dropdb -h $(DB_HOST) -U $(DB_USER) -e $(DB_NAME)
	@-dropuser -h $(DB_HOST) -e $(DB_USER)

server:
	./bin/server

.PHONY: bootstrap migrate seed test clean server
