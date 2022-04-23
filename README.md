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

Now run the image `nimi-backend`

```bash
docker run -d /
-p 3000:3000 /
-e TWITTER_API_V2_BEARER_TOKEN='<from-twitter>' /
-e MONGO_URI='mongodb://localhost:27017' /
nimi-backend
```