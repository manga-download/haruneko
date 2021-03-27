# HaruNeko

Prototype of HakuNeko based on NW.js + TypeScript

## Development

The application consists of two ...

### Installation

Make sure **git** and **NodeJS + NPM** are installed on your system.

```bash
# clone the repository
git clone https://github.com/manga-download/haruneko.git
# change into the project directory
cd harunkeo
# install dependencies
npm install
```

### Run

1. Build and serve the web-application on the local machine

    `npm run serve`

2. Build and run the client application that will open the web-application hosted on the local machine

    `npm start`

Use the console from the developer tools (F12) to investigate `HakuNeko` API, e.g.

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