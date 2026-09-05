# themoviedb-discovery-app-demo-2026-2027

## Documentation API

En environnement local ou de test, l'interface Swagger est disponible a l'adresse
[`http://localhost:3000/api-docs`](http://localhost:3000/api-docs). La specification OpenAPI JSON est exposee
sur [`http://localhost:3000/api-docs/openapi.json`](http://localhost:3000/api-docs/openapi.json).

Ces routes de documentation ne sont volontairement pas exposees lorsque `NODE_ENV=production`.

Les schemas Swagger sont generes a partir des schemas Zod du backend. Ces schemas constituent egalement la source
des types TypeScript utilises par les endpoints, afin d'eviter de maintenir deux definitions concurrentes.
