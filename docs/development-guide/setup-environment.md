# Setup Environment

## Requirements

- Install _git_
- Install _NodeJS 20_ with _NPM 10_
- All tools can be run directly from terminal (a.g., added to the _Path_ environment variable)

## Checkout Sources

1. Clone the repository from GitHub
```shell
git clone "https://github.com/manga-download/haruneko.git"
```
2. Open a terminal and change into the cloned repository
```shell
cd haruneko
```
3. Download and install all package dependencies
```shell
npm install
```

::: info NOTE
Perform `npm install` regulary after pulling code from the remote repository as a contributor may have changed some package dependencies
:::

## Project Structure

The repository contains four workspaces (projects)

- The web-application located in the `/web` folder
- An NW.js client in the `/app/nw` folder used to run the web-application on desktop
- An Electron client in the `/app/electron` folder used to run the web-application on desktop
- All related documentation for deployment to a public website in the `docs` folder

## Code Inspection

The project uses various tools to perform a static code analysis and detect compile time errors as well as code smells and formatting issues.

- Run code inspection for all projects (e.g., before pushing changes to the remote)
```shell
npm run check
```

## Test

- Run unit/component tests for all projects
```shell
npm run test
```
- Run end-to-end tests for all projects
```shell
npm run test:e2e
```
- Run website tests for one or more specific website names
```shell
npm run test:websites -- MangaDex
```

<!--
### Testing

To ensure the application behaves as expected, tests need to be added.
All tests are written side by side to their (logical) corresponding implementation directly in the source code directory.
Overall, there are two test categories.

#### Unit and Component Tests
Unit tests (file extension `⋆.test.ts`) are very lightweight within a limited scope (e.g. single method of a class).
Component tests (file extension `⋆.spec.ts`) can be more complex and test relations and coherences within a module (e.g. a composed UI control).
To start these tests, simply run
```sh
npm run test
```

#### End-To-End Tests
End-To-End tests (file extension `⋆.e2e.ts`) are performed by interacting with the (web-)application itself.
This includes tests which are consuming the engine API as well as tests that run against the UI.
The environment for these tests is a running instance of the NW.js production build, controlled by the tests through `puppeteer`.
To start these tests, simply run
```sh
npm run test:e2e
```

#### Website Tests
Website tests (file extension `⋆.e2e.ts` in _/src/engine/websites_) will run some basic checks for each website.
The environment for these tests is a running instance of the NW.js production build, controlled by the tests through `puppeteer`.
[WARNING]
Running all tests will take very very long and may use up a lot of your internet bandwidth.

To start these test(s), simply run
```sh
# Test all websites
npm run test:websites
# Test a certain website
npm run test:websites -- MangaDex
```
-->

## Launch

Run the application based on the current source code locally.

::: info NOTE
If you are on Apple Silicon (Arm64) and NW isn't starting, try:
```zsh
xattr -cr ./node_modules/nw/nwjs/nwjs.app
```
See: https://github.com/nwjs/nw.js/issues/8157
:::

### Development Mode

Hot-Reloading is not working correctly, but the web-application will reload automatically whenever a change is made to the source.
Changes made to the source code of the desktop clients while running however requires the corresponding desktop client to be closed and restarted.

1. Host the web-application locally at [localhost:3000](http://localhost:3000)
```shell
npm run serve:dev --workspace web
```
2. Either run the Electron or NW.js desktop client and connect it to the local hosted web-application
```shell
npm run launch:dev --workspace app/electron
```

### Production Mode

Changes to the source code are neither reflected in the web-application, nor in the desktop client.
Both needs to be restarted in order to apply source code changes.

1. Host the web-application locally at [localhost:5000](http://localhost:5000)
```shell
npm run serve:prod --workspace web
```
2. Either run the Electron or NW.js desktop client and connect it to the local hosted web-application
```shell
npm run launch:prod --workspace app/electron
```

## Debug

While running the desktop application, press the F12 key to open the developer tools.
Source code can be inspected and debugged from the _Source_ tab.
Code can directly be injected via the _Console_ tab for prototyping.

<details>
<summary>Sample Injection Script</summary>

```javascript
(async () => {
    const website = HakuNeko.PluginController.WebsitePlugins[0];
    console.log('Website:', website.Title);
    if(website.Entries.length === 0) {
        console.log('=>', 'Updating manga list (this may take some time ...)');
        await website.Update();
    } else {
        console.log('=>', 'Using manga list from local cache');
    }

    async function getPages(mangaIndex, chapterIndex) {

        const manga = website.Entries[mangaIndex]; // or with iterator: [...website][mangaIndex];
        console.log(' '.repeat(4), 'Manga:', manga.Title);
        if(manga.Entries.length === 0) {
            console.log(' '.repeat(4), '=>', 'Updating chapter list');
            await manga.Update();
        } else {
            console.log(' '.repeat(4), '=>', 'Use current chapter list');
        }
        
        const chapter = manga.Entries[chapterIndex]; // or with iterator: [...manga][chapterIndex];
        console.log(' '.repeat(8), 'Chapter:', chapter.Title);
        if(chapter.Entries.length === 0) {
            console.log(' '.repeat(8), '=>', 'Updating page list');
            await chapter.Update();
        } else {
            console.log(' '.repeat(8), '=>', 'Use current page list');
        }
        
        for(const page of chapter) {
            console.log(' '.repeat(12), 'Page:', page.SourceURL);
        }
    }

    await getPages(0, 0);
    await getPages(13, 7);
```

</details>