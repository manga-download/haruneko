import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'coloredmanga',
        title: 'Colored Manga'
    },
    container: {
        url: 'https://coloredmanga.net/manga/BvguMqKouwqnxtcAASsYG7mbE3bfLq',
        id: 'BvguMqKouwqnxtcAASsYG7mbE3bfLq',
        title: 'The Beginning After the End (Colour)'
    },
    child: {
        id: 'oVQ96zDSgqnRQxPhXYUr2MX33GnCg5',
        title: 'Chapter 001'
    },
    entry: {
        index: 1,
        size: 288_810,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());