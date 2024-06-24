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
        id: 'm5veS4DOx5ioojYuUZ4Lr0YEz7JzmX',
        title: 'Chapter 185 - Side Story 10'
    },
    entry: {
        index: 0,
        size: 1_524_998,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());