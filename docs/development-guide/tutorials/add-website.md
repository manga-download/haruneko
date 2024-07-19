# Add Website

This document briefly describes how to add a new websites to HakuNeko.

::: warning WARN
When making requests to a website, only use the methods provided by _/src/engine/platform/FetchProvider.ts_, since it wraps some tricks to bypass certain restrictions.
:::

## About Decorators

The latest version of HakuNeko adds support for defining and using decorators.
Decorates can add one or more pre-defined behaviors to a class definition.
This is useful if the same behavior should be applied to multiple classes, such as opening an HTML page, find a certain `img` tag and extract its `src` attribute.

::: info TIP
All decorators are extensively documented.
In Visual Studio Code the documentation will be shown in an tooltip of a decorator.
:::

## Add a Manga Website

Each new wesbite must extend the `DecoratableMangaScraper` located in _/src/engine/providers/MangaPlugin.ts_.
Get started by creating a new typescript file in _/src/engine/websites_ based on the name of the website, e.g. _MySampleMangas.ts_.
Use the following boiler plate, but customize the constructor with appropriate arguments for the website:

- `identifier` a unique string to distinguish and identifiy this website implementation
- `name` a user friendly string that will be shown as the name of the website
- `url` the origin of the website
- `...tags` one or more comma seperated tags used to describe/categorize the content of the website

Afterwards, run `node ./scripts/website-index.js` to automatically update the import in _/src/engine/websites/_index.ts_ (otherwise the website will not be available in HakuNeko).

<details>
<summary>MySampleMangas.ts</summary>

```typescript
import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mysamplemangas', 'My Sample Mangas', 'https://my-sample-mangas.net', Tags.Media.Manga, Tags.Language.English);
    }
}
```

</details>

## Provide Icon (optional)

Each website may provide an icon to make it easier for users to identify the website (e.g. in the user interface).
After finding or creating an icon, store it along the previously created file (e.g. as _MySampleMangas.webp_) and use _WEBP_ with a quality of _50%_ and size of _64x64_, to ensure it size is below [4 KB](https://vitejs.dev/config/build-options.html#build-assetsinlinelimit).
In the existing implementation import the icon and override the `Icon` property.

<details>
<summary>MySampleMangas.ts</summary>

```typescript
import { Tags } from '../Tags';
import icon from './MySampleMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mysamplemangas', 'My Sample Mangas', 'https://my-sample-mangas.net', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon(): string {
        return icon;
    }
}
```

</details>

## Implement Copy & Paste Support

A common use case is that a user has an URL for a manga from a website and wants to open it in HakuNeko.
Therefore each website will be asked if it supports the given URL and if true, to load it.
To support this mechanism, the following two methods must be implemented:

- `ValidateMangaURL` to determine if a given URL is supported
- `FetchManga` to extract information from a given URL

Make sure to use an appropriate identifier for the `Manga`, e.g. the path of its URL since this is the only clue when scraping the chapters for this manga (see [Implement Chapter List](#implement-chapter-list)).

### Using Methods

The native approach overrides both methods directly.

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    /* Other Implementations */

    public override ValidateMangaURL(url: string): boolean {
        return url.startsWith(this.URI + '/manga/');
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        // Get the id/title based on the given URL (e.g. from the website)
        const id = new URL(url).pathname;
        const title = 'Unknown Manga';
        return new Manga(this, provider, id, title);
    }
}
```

</details>

### Using Decorator

If the website is generic without any bells and whistles, the odds are high that an existing decorator can be used to extend the class with both methods.
The `MangaCSS` decorator from _/src/engine/websites/decorators/Common.ts_ may work out of the box:

- Use a regex to match an URL
- Use a CSS selector to extract the manga title from an URL
- Use the pathname from an URL as manga identifier

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import * as Common from './decorators/Common';

@Common.MangaCSS(/https?:\/\/my-sample-mangas\.net\/manga\/[^/]+\/$/, 'div.info p.title')
export default class extends DecoratableMangaScraper {
    /* Other Implementations */
}
```

</details>

## Implement Manga List

In this use case the user wants to get a list of all mangas that are available on the website.
This can be achieved by overriding the method `FetchMangas`.

Make sure to use an appropriate identifier for each `Manga`, e.g. the path of its URL since this is the only clue when scraping the chapters for any `manga` (see [Implement Chapter List](#implement-chapter-list)).

### Using Method

The native approach overrides the method directly.
Utilize the field `this.URI` to get the website URL.

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    /* Other Implementations */

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        // Scrape the website to extract all mangas ...
        return [
            new Manga(this, provider, '/manga/naruto', 'Naruto'),
            new Manga(this, provider, '/manga/one-piece', 'One Piece'),
        ];
    }
}
```

</details>

### Using Decorator

If the website is generic without any bells and whistles, the odds are high that an existing decorator can be used to extend the class with the method.
The `MangasMultiPageCSS` decorator from _/src/engine/websites/decorators/Common.ts_ for example iterates over multiple web pages (incrementing page number) and extract all mangas matching an CSS selector:

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import * as Common from './decorators/Common';

/* Other Decorators */
@Common.MangasMultiPageCSS('/list/page/{page}/', 'div#mangalist div.manga-entry a', 1)
export default class extends DecoratableMangaScraper {
    /* Other Implementations */
}
```

</details>

## Implement Chapter List

This chapter describes how to implement the functionality to get the list of chapters for a given `Manga`.
This can be achieved by overriding the method `FetchChapters`.

Make sure to use an appropriate identifier for each `Chapter`, e.g. the path of its URL since this is the only clue when scraping the pages for any `Chapter` (see [Implement Page List](#implement-page-list)).

### Using Method

The native approach overrides the method directly.
Utilize the field `this.URI` and `manga.Identifier` to get the chapter URL for scraping.

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import { DecoratableMangaScraper, Manga, Chapter } from '../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    /* Other Implementations */

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        // Scrape the website to extract all chapters ...
        return [
            new Chapter(this, manga, '/manga/naruto/001', 'Chapter 001'),
            new Chapter(this, manga, '/manga/naruto/002', 'Chapter 002'),
        ];
    }
}
```

</details>

### Using Decorator

If the website is generic without any bells and whistles, the odds are high that an existing decorator can be used to extend the class with the method.
The `ChaptersSinglePageCSS` decorator from _/src/engine/websites/decorators/Common.ts_ may be a good choice by extracting all chapter identifiers and titles based on a given CSS selector:

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import * as Common from './decorators/Common';

@Common.ChaptersSinglePageCSS('div.list div.chapter a')
export default class extends DecoratableMangaScraper {
    /* Other Implementations */
}
```

</details>

## Implement Page List

Whats left is to add the functionality to extract all pages for a given `Chapter`.
Instead of getting a list of images, the method `FetchPages` will provide a list of pages, with each `Page` describing the way of how to get the raw image data.
For plain images this is quite simple by using the `Page.Link` and `Page.Referer` properties.
However, images might be scrambled, encrypted or authorized, in this case the `Page.Parameters` can be used to store additional information, such as decryption keys or tokens.

### Using Method

The native approach overrides the method directly.
Utilize the field `this.URI` and `chapter.Identifier` to get the URL for scraping.

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import { DecoratableMangaScraper, Manga, Chapter, Page } from '../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    /* Other Implementations */

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return [
            new Page(this, chapter, new URL('/manga/naruto/001/01.jpg', this.URI)),
            new Page(this, chapter, new URL('/manga/naruto/001/02.jpg', this.URI)),
        ];
    }
}
```

</details>

### Using Decorator

If the website is generic without any bells and whistles, the odds are high that an existing decorator can be used to extend the class with both methods.
The `PagesSinglePageCSS` decorator from _/src/engine/websites/decorators/Common.ts_ could be a good fit by extracting all image links from the chapter's website based on a given CSS selector:

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import * as Common from './decorators/Common';

@Common.PagesSinglePageCSS('div.images img')
export default class extends DecoratableMangaScraper {
    /* Other Implementations */
}
```

</details>

## Implement Image Grabber

The last method that needs to be implemented is `FetchImage`, which get the raw image data based on a given `Page`.

### Using Method

The native approach overrides the method directly.
This is a little bit more complex then just fetching the image and returning the data.
To prevent to many concurrent requests leading to performance drop or IP ban, the download job must be queued on the task pool for this website.

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import { DecoratableMangaScraper, Manga, Chapter, Page } from '../providers/MangaPlugin';
import { Fetch } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';

export default class extends DecoratableMangaScraper {

    /* Other Implementations */

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const request = new Request(page.Link.href, {
                signal: signal,
                headers: {
                    Referer: page.Parameters?.Referer || page.Link.origin
                }
            });
            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);
    }
}
```

</details>

### Using Decorator

If the website is generic without any bells and whistles, the odds are high that an existing decorator can be used to extend the class with both methods.
In case the page describes just a simple image, the `ImageAjax` or `ImageElement` decorator can be used to add the download ability.

<details>
<summary>MySampleMangas.ts</summary>

```typescript
/* Other Imports */
import * as Common from './decorators/Common';

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    /* Other Implementations */
}
```

</details>

## Write and Run Test

TBD