Install docker
Install yarn

#### Build BE

```bash
cd BE-CA
docker-compose up -d (waiting for be running)
```

When everything is up, go to docker (dont care about "mongoinit" container, it just use to set up master-slave db )
--> go to customer, shopping and products restart again to create tables in database (because set up master-slave db, so it maybe create table is asynchronous so we need to restart service again)

#### Build ADMIN FE

```bash
cd Admin-UI
yarn install
yarn dev
```

#### Build Customer FE

```bash
cd FE-CA
yarn install
yarn dev
```

#### Admin account

admin@shop.com
admin123456

### MINIO admin

admin1234
123456789
.