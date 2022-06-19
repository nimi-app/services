# Nimi Backend Services

Provides a set of APIs for Nimi.eth dapp.

# Deploy

Dockerize the app by running

```bash
npm run dockerize
```

or

```bash
sh ./docker/build.sh
```

Create `.env` file

```shell
TWITTER_API_V2_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAA
MONGO_URI=mongodb+srv://nimi:nimi@localhost/
PINATA_API_KEY=<pinata-key>
PINATA_API_SECRET=<pinata-secret>
```

Now run the image `nimi-services`

```shell
docker run -d \
-p 3000:3000 \
--env-file ./.env \
nimi-services
```
