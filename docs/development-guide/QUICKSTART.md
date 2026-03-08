# Running HaruNeko from Source

Requires Node.js >= 22.13 and npm >= 10.9.

## Install dependencies

```sh
npm install
```

## Run the desktop app (Electron)

Two terminals needed:

**Terminal 1** - start the web dev server:

```sh
npm run serve:dev --workspace=web
```

**Terminal 2** - build and launch Electron:

```sh
npm run launch:dev --workspace=app/electron
```

## Production build

Build all workspaces:

```sh
npm run build --workspaces
```

Create a distributable Electron bundle:

```sh
npm run bundle --workspace=app/electron
```
