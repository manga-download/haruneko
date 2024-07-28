# Concepts

...

## Components and Infrastructure

HakuNeko is a web application build to be run as desktop client on _Blink_ based engines such as _Electron_ or _NW.js_.
The desktop client is manually installed on the users computer and is bundled with a small platform specific part of the application.
The major part of the application with the platform independent business logic is hosted on a server and loaded during runtime.
This separation allows to deliver patches faster, without the need to update the desktop client everytime a new version is deployed.

<!-- Edit Image: https://app.diagrams.net/ -->
![](../public/assets/infrastructure.svg)

### Web-Application

...

### Desktop Client

...

## Technologies

- Written as desktop application based on web-technologies
- Written in TypeScript with partial JavaScript
- Uses NodeJS runtime and NPM packet manager
- Uses Vite for tooling
- Uses Puppeteer for automated end-to-end tests