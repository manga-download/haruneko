# Use Engine

This document briefly describes how to consume the HakuNeko engine, e.g. as a frontend developer.
Each section is focused on how to solve certain use cases by explained samples (instead of simply providing the technical API documentation).

The HakuNeko engine is globally exposed and can easily be scripted, so any sample found in this document that uses the engine may be directly run within the application itself.
After starting the application simply press `F12` to open the developer tools and switch to the `Console` tab.
Now everything is ready to start scripting.

:: info TIP
You may insert `debugger` statements at any line(s) when injecting scripts into the console to break for debugging.
```javascript
const today = new Date();
debugger // break into debugger
console.log(today);
```
:::

## Localization

Every text or error message that is going to be presented to the user should be localized.

### Add translated Entry

...

```javascript
//
import { GetLocale } from './i18n/Localization';
import { type ILocale, ResourceKey as R } from './i18n/ILocale';

```

### Use translated Entry

...

```javascript
//
```

### Update Translation

The localization may be changed at runtime, so it may be ncessary to perform some updates.

```javascript
//
```

## Settings

### Global

```javascript
// Get the global settings
const settings = HakuNeko.SettingsManager.OpenScope();
// Optionally an identifier may be provided to open a different setting scope
// e.g. HakuNeko.SettingsManager.OpenScope('frontend.classic')

// Iterate through all available settings
// NOTE: The `Label` as well as the `Description` properties are only localization keys
for(const setting of settings) {
    console.log('Setting:', setting.ID, '|', setting.Label, '=>', setting.Value);
}

// Get the setting for descrambling image quality by its corresponding `ID`
// NOTE: In production code use the `ID` provided by the `SettingsGlobal` module
//       import { Key } from './engine/SettingsGlobal';
//       const quality = settings.Get(Key.DescramblingQuality);
const quality = settings.Get('descrambling-quality');

// May also add a callback to get notified when a new value was assigned
const onImageQualityChanged = (value) => console.log('Quality Changed:', value);
quality.Subscribe(onImageQualityChanged);

// Our subscribers will be notified as soon as a new `Value` is assigned
quality.Value -= 1;

// Unsbscribing works as well ...
quality.Unsubscribe(onImageQualityChanged);

// Our subscribers will no longer be notified when resetting to the default value
quality.Value = quality.Default;
```

### Scoped

It is also possible to create and use different setting scopes.
This is useful in case settings that are not supposed to pollute the global settings should be stored.
Such a use case would be if a new frontend is added which shall provide some specific settings.

```javascript
import { Choice } from '../../engine/SettingsManager';

// Open a new named settings scope, or create one if not exist
const settings = HakuNeko.SettingsManager.OpenScope('my-frontend-settings');

// Add all the setting entries
await settings.Initialize(Theme, ...);

```

## Website Plugins

```javascript
// Get a list of all supported websites
const websites = HakuNeko.PluginController.WebsitePlugins;
console.log('Number of Websites:', websites.length);
```

### Website Settings

Each website may contain certain settings which can be used as described in [Settings](#settings).
But instead of accessing the settings through opening a scope, they can be accessed directly via the `Settings` property.

```javascript
// Find a website that has some settings
const website = HakuNeko.PluginController.WebsitePlugins.find(website => [...website.Settings].length > 0);
// Iterate through all available website settings
// NOTE: The `Label` as well as the `Description` properties are only localization keys
for(const setting of website.Settings) {
    console.log(`Setting['${setting.ID}']`, setting.Label, '=>', setting.Value);
}
```

### Working with Mangas

This section is focused on working with mangas, so lets start by getting a website which is known to contain mangas.

```javascript
// Find a specific manga website, e.g. by its `Identifier`
const toonily = HakuNeko.PluginController.WebsitePlugins.find(website => website.Identifier === 'toonily');
console.log('Website (Toonily):', toonily);
```

#### Get Manga(s)

In this section it is assumed that a reference to the `toonily` website as described in [Website Plugins](#website-plugins) was already created.

::: info NOTE
The manga list is cached locally, therefore updating may only be required when the cached list is empty or assumed to be outdated.
:::

```javascript
// First lets update the list of available mangas directly from the website
// NOTE: Depending on the number of mangas and server site rate limiting this may take a while ...
await toonily.Update();
// After that it will be possible to iterate over the mangas of the toonily website
for(const manga of toonily) {
    console.log('Manga:', manga.Title);
}
// Or directly access the list of mangas via the `Entries` property
console.log('Manga Count:', toonily.Entries.length);

// The next step would be to select a manga from the list, e.g. by its `Title`
const leviathan = toonily.Entries.find(manga => manga.Title === 'Leviathan');
console.log('Manga (Leviathan):', leviathan);
```

Another possibility is to get a manga by its url.
This is done by trying to get it for each website.

```javascript
// Provide a valid manga url (an invalid url will obviously not be found)
const url = 'https://toonily.com/webtoon/leviathan-0002/';
// Iterate through each website
for(const website of HakuNeko.PluginController.WebsitePlugins) {
    // Try to get the manga
    const manga = await website.TryGetEntry(url);
    if(manga) {
        // Success, we can break the search at this point
        console.log('Manga:', manga);
        break;
    }
}
```

#### Get Chapter(s)

In this section it is assumed that a reference to the `leviathan` manga as described in [Get Mangas](#get-mangas) was already created.

```javascript
// First lets update the list of available chapters directly from the website
// NOTE: Depending on the number of chapters and server site rate limiting this may take a while ...
await leviathan.Update();
// After that it will be possible to iterate over the chapters of the leviathan manga
for(const chapter of leviathan) {
    console.log('Chapter:', chapter.Title);
}
// Or directly access the list of chapters via the `Entries` array
console.log('Chapter Count:', leviathan.Entries.length);

// The next step would be to select a chapter from the list, e.g. by its `Title`
const prologue = leviathan.Entries.find(chapter => chapter.Title.includes('Prologue'));
console.log('Chapter (0 - Prologue):', prologue);
```

#### Get Image(s)

In this section it is assumed that a reference to the `prologue` chapter as described in [Get Chapters](#get-chapters) was already created.

```javascript
// First lets update the list of available pages directly from the website
// NOTE: Depending on the number of pages and server site rate limiting this may take a while ...
await prologue.Update();
// After that it will be possible to iterate over the pages of the prologue chapter
for(const page of prologue) {
    console.log('Page:', page);
}
// Or directly access the list of chapters via the `Entries` array
console.log('Page Count:', prologue.Entries.length);

// The next step would be to select a page from the list, e.g. by its index
const page = prologue.Entries[0];
// And get its image data with high priority.
// An additional abort controller provides the ability to cancel the download and free the internal queue, in cases such as the user navigates away from the image viewer
const controller = new AbortController();
const blob = await page.Fetch('high', controller.signal);
console.log('Raw Image Data:', blob);

// It is likely that the image should be used as a background image or as source of an `Image` element, therefore creating an object URL makes sense
const imageURL = URL.createObjectURL(blob);
console.log('Image Object URL:', imageURL);
// Don't forget to free the resources when done to prevent memory leaks
URL.revokeObjectURL(imageURL);
```

### Working with Animes

...

### Working with Novels

...

## Managing Bookmarks

...

```javascript
// Get a website plugin
const sheepscanlations = HakuNeko.PluginController.WebsitePlugins.find(plugin => plugin.Identifier.includes('sheep'));
// Update manga list
await sheepscanlations.Update();
// Get a manga from the list that shall be bookmarked
const manga = await sheepscanlations.Entries[0];
// Update chapter list
await manga.Update();
// Remove a chapter to pretend the list is outdated
manga.Entries.pop();
// Add manga with outdated chapter list to bookmark
await HakuNeko.BookmarkPlugin.Add(manga);
// Get a handle to the bookmark
const bookmark = HakuNeko.BookmarkPlugin.Entries[0];
// Set the current chapter list as "known" chapters (e.g. may be done everytime the user reads the chapter list ...)
await bookmark.ApplyEntriesAsKnownEntries();
// Check for new chapters => this contains the chapter we pretended to not be in the previous list
await bookmark.GetNewEntries();
// Can remove bookmark since it was only for testing purposes ...
await HakuNeko.BookmarkPlugin.Remove(bookmark);
```

See also: https://github.com/manga-download/haruneko/issues/41

### Tracker Information

Each bookmark may be linked with a tracker (e.g. Kitsu) to get media information and optionally update the status (in case the user has a corresponding account for the tracker).

## Performing Downloads

...
