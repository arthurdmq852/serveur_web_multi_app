Documentation – Serveur Web Multi Applications
Description

Ce projet permet d’héberger plusieurs applications web sur un seul serveur, en utilisant des sous-domaines distincts et en assurant leur accessibilité via HTTPS.

L’objectif est de centraliser le déploiement d’applications développées avec différentes technologies (ex : WordPress, Node.js), tout en garantissant sécurité, performance et simplicité d’administration.

Objectifs

Ce projet doit permettre d'héberger plusieurs applications sur un même serveur, d'utiliser un reverse proxy pour gérer les flux, de sécuriser les accès via HTTPS (certificats SSL/TLS), de gérer les sous-domaines pour chaque application et de faciliter l’ajout et la suppression d’applications

Voici l'architecture du projet

L’architecture repose sur un serveur web (Apache2), un reverse proxy (recommandé : Nginx), Plusieurs applications (Node.js, WordPress), un système de certificats SSL (Tailscale).

Illustration de l’interface :

Prérequis:

Avant de commencer, assurez-vous d’avoir une machine virtuelle ou serveur Linux (Ubuntu recommandé), un accès root ou sudo, un nom de domaine ou sous-domaine (optionnel mais recommandé)

Ports ouverts : 80 (HTTP) et 443 (HTTPS)

Pour l'installation suivez ces étapes

Tous d'abord l'installation d’Apache2 avec:

sudo apt update
sudo apt install apache2

Ensuite l'installation de Node.js avec:
sudo apt install nodejs npm

Vérification :

node -v
npm -v
3. Configuration d’Apache

Le fichier principal de configuration se trouve ici :

/etc/apache2/apache2.conf

Tu peux également gérer les sites via :

/etc/apache2/sites-available/
4. (Recommandé) Installation de Nginx pour le Reverse Proxy
sudo apt install nginx
Configuration du Reverse Proxy

Exemple de configuration Nginx :

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