import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scanmanga',
        title: 'ScanManga'
    },
    container: {
        url: 'https://www.scan-manga.com/12522/Desire-Realization-App.html',
        id: '/12522/Desire-Realization-App.html',
        title: 'Desire Realization App'
    },
    child: {
        id: '/lecture-en-ligne/Desire-Realization-App-Chapitre-34-FR_409765.html',
        title: 'Chapitre 34'
    },
    entry: {
        index: 0,
        size: 658_994,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());