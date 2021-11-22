# React Typescript & Graphql

### Install postgres

1. Install postgres _brew install postgresql_
2. start/stop postgres _brew services start/stop postgresql_
3. uninstall postgres _brew uninstall postgresql_
4. To remove startup configuration _rm ~/Library/LaunchAgents/homebrew.mxcl.postgres.plist_
5. To drop database _PGPASSWORD=your_password_here psql -h localhost -U your_usename;_

### Setup Mirkro-orm

1. _npm i_ @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations
2. _npm i_ @mikro-orm/postgresql pg
3. _createdb_ parhako
4. add mikro orm configuration in package.json
5. execute _npx mikro-orm migration:create_ to create migration script OR npm run create:migration

### Setup GraphQL

1. _npm i_ express apollo-server-express graphql type-graphql
2. _npm i_ npm i @types/express _--save-dev_
3. _npm i_ reflect-metadata
4. npm i cors @types/cors

### Setup Password hashing

- _npm i_ argon2

### Install Redis

1. Install Redis _brew install redis_
2. to start on computer start _ln -sfv /usr/local/opt/redis/\*.plist ~/Library/LaunchAgents_
3. start/stop redis _launchctl load/unload ~/Library/LaunchAgents/homebrew.mxcl.redis.plist_
4. to access redis cli _redis-cli_
5. to uninstall _brew uninstall redis_
6. rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist

### Setup session with redis

1. _npm i_ redis connect-redis express-session
2. _npm i_ @types/redis @types/connect-redis @types/express-session --save-dev

### Web UI next.js

1. npx create-next-app --example with-chakra-ui parhako-web
2. _npm i_ formik
3. _npm i_ urql graphql
4. _npm i_ @graphql-codegen/cli --save-dev
5. npx graphql-codegen init
6. _npm i_ @graphql-codegen/typescript-urql --save-dev
7. npm run gen --> to generate graphql type class
8. _npm i_ @urql/exchange-graphcache

## SSR

1. _npm i_ next-urql react-is urql graphql

## Nodemailer for sending emails

1. _npm i_ nodemailer

## Token generation

1. obsolete redis package install _npm i_ ioredis
2. For token generation _npm i_ uuid

## Install TypeORM

1. install type orm _npm i_ typeorm
2. Create Migration _npx_ typeorm migration:create -n FakePosts
