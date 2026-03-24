# Documentation – Serveur Web Multi Applications 
## Zyad LAOUANI, Arthur DEMARCQ, Louis GODARD
Description du projet

Ce projet permet d’héberger plusieurs applications web sur un seul serveur, en utilisant des sous-domaines distincts et en assurant leur accessibilité via HTTPS.

L’objectif est de centraliser le déploiement d’applications développées avec différentes technologies, tout en garantissant sécurité, performance et simplicité d’administration.

### Objectifs du projet

Ce projet doit permettre d'héberger plusieurs applications sur un même serveur, d'utiliser un reverse proxy pour gérer les flux, de sécuriser les accès via HTTPS (certificats SSL/TLS), de gérer les sous-domaines pour chaque application et de faciliter l’ajout et la suppression d’applications

### Présentation du projet


### Prérequis:

Pour commencer, on a besoin de deux machines virtuelles (une qui va servir de routeur, une en host-only utilisée pour héberger le site web)  

Pour l'installation suivez ces étapes

### Manipulations pour Linux 

Tout d'abord, on va paramétrer le site web avec Nginx, on commence par l'installer avec

```
sudo apt install nginx
```

On va également avoir besoin de PHP car Nginx n'a pas de module intégré pour le gérer.

```
sudo apt install php-fpm php-mysql
```

Pour plus tard, on va devoir vérifier la version de PHP que l'on, on fait alors

```
ls /var/run/php/
```

<img src=img-doc/php-version.png>

Pour continuer, on va modifier le fichier de configuration qu'utilise Nginx pou
```
server {
    listen 80;
    server_name vm-roueur1.tail66b3dd.ts.net;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name vm-roueur1.tail66b3dd.ts.net;

    ssl_certificate /etc/ssl/certs/serveur.crt;
    ssl_certificate_key /etc/ssl/private/serveur.key;

    root /var/www/html;

    index index.html index.php;

    location / {
        try_files $uri $uri/ =404;
    }

    location /wordpress {
        try_files $uri $uri/ /wordpress/index.php?$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;

        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }

    location /nodejs_app/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

```

Une fois que la configuration a été verifiée avec `sudo nginx -t`, on peut relancer nginx `(sudo systemctl restart nginx)`


On ajoute les fichiers de notre site

<img src=img-doc/files.png>

Afin que l'on puisse se connecter depuis un autre ordinateur qui n'est pas sur le même réseau, on utilise ici Tailscale

On 

<img src=img-doc/tailscale.png>












Ensuite l'installation de Node.js avec:
sudo apt install nodejs npm

Vérification :

node -v
npm -v

4. (Recommandé) Installation de Nginx pour le Reverse Proxy
sudo apt install nginx
Configuration du Reverse Proxy

Exemple de configuration Nginx :

```
server {
    listen 80;
    server_name vm-routeur1.tail66b3dd.ts.net;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name vm-routeur1.tail66b3dd.ts.net;

    ssl_certificate /etc/ssl/certs/serveur.crt;
    ssl_certificate_key /etc/ssl/private/serveur.key;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

Ici :

Le port 3000 correspond à une app Node.js, vous pouvez changer selon vos applications

Sécurité HTTPS

Pour sécuriser les connexions il y a deux possibilités: La première : Let’s Encrypt (recommandé); pour se faire:

sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx

Sinon deuxième possibilité: Certificats manuels

Placer les fichiers ici :

/etc/ssl/certs/
/etc/ssl/private/
Gestion des applications

L’interface permet de gérer dynamiquement les applications :

Comment marche l'interface de gestion ?

Pour ajouter une application: Renseigner nom de l’application, URL ou port, Cliquer sur Ajouter

Pour supprimer une application: Sélectionner une application dans la liste, Cliquer sur Supprimer

Exemple de déploiement:

Application Node.js
npm install
node app.js

Accessible via :

https://node.mondomaine.com
Application WordPress

Installer Apache + PHP + MySQL

Déployer WordPress dans /var/www/html

Associer à un sous-domaine :

https://wordpress.mondomaine.com

Structure recommandée
/var/www/
  ├── wordpress/
  ├── node-app/
  └── static-site/

Documentation utilisateur

Pour ajouter une nouvelle application vous devez lancer l’interface, entrer le nom de l’app, entrer l’URL ou port, valider

Pour supprimer vous devez sélectionner l’application, cliquer sur supprimer

Pour les améliorations possibles vous devez faire un Load balancing (répartition de charge), Monitoring (Grafana, Prometheus),    Conteneurisation avec Docker, Authentification des accès (Basic Auth, OAuth), Détails techniques (Reverse Proxy / Sécurité / Routeur)


Ce projet permet de mettre en place une solution complète d’hébergement multi-applications, sécurisée et évolutive.

Il répond aux besoins suivants :

Centralisation des services

Sécurisation HTTPS

Gestion simplifiée des applications

Architecture moderne avec reverse proxy


## Ajout d'applications

Pour tester notre gestion d'applications, on va utiliser WordPress & NodeJS

### WordPress

Afin d'ajouter WordPress,
<img src=img-doc/wordpress.png>

### NodeJS

cd /var/www/html/nodejs_app
nano app.js

const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from Node.js!\n');
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

<img src=img-doc/nodejs.png>
