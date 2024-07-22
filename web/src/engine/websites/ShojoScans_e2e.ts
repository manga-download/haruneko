import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'shojoscans',
        title: 'Shojo Scans',
    },
    container: {
        url: 'https://shojoscans.com/comics/couple-how-far-you-can-go/',
        id: '/comics/couple-how-far-you-can-go/',
        title: 'Couple, How Far You Can Go?'
    },
    child: {
        id: '/couple-how-far-you-can-go-chapter-10/',
        title: 'Chapter 10'
    },
    entry: {
        index: 2,
        size: 606_244,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());