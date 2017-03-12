# Cours API Rest

expliquer node
installer dernier node LTS 
- Google node.js
- expliquer node manager
    - https://github.com/coreybutler/nvm-windows
    - https://github.com/creationix/nvm
- vérifier version de node
- lancer un script node hello world
- lancer un script fibonacci
- explication npm
    - Versioning package
    - Gestion des dépendences
    - Commandes

# Start to develop
cmd =>
- npm install
- npm run build:watch

# Références
- http://blog.xebia.fr/2014/03/17/post-vs-put-la-confusion/
- https://martinfowler.com/articles/richardsonMaturityModel.html

# Memo 
git tag -a v1.0 -m "http get sans body parser sans watch"
git tag -a v1.1 -m "http get sans body parser avec watch"


- GET http://localhost:8081/api/places => Liste toutes les places
- POST http://localhost:8081/api/places => Crée une place
- PUT http://localhost:8081/api/places/:id => Remplace une place (équivaut à mise à jour)
- DELETE http://localhost:8081/api/places/:id => Supprime une place
- PATCH http://localhost:8081/api/places/:id => Mise à jour partiel (uniquement propriété envoyée)