import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'funmanga',
        title: 'FunManga'
    },
    container: {
        url: 'https://www.funmanga.com/Tales-of-Demons-and-Gods',
        id: '/Tales-of-Demons-and-Gods',
        title: 'Tales of Demons and Gods'
    },
    child: {
        id: '/Tales-of-Demons-and-Gods/427.1/all-pages',
        title: '427.1'
    },
    entry: {
        index: 1,
        size: 345_820,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());