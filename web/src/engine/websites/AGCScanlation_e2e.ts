import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'agcscanlation',
        title: 'AGCScanlation'
    },
    container: {
        url: 'http://www.agcscanlation.it/progetto.php?nome=Arifureta2',
        id: '/progetto.php?nome=Arifureta2',
        title: 'Arifureta Nichijou de Sekai Saikyou'
    },
    child: {
        id: '/readerr.php?nome=Arifureta2&numcap=1&nomecompleto=Arifureta%20Nichijou%20de%20Sekai%20Saikyou',
        title: 'Capitolo 1'
    },
    entry: {
        index: 0,
        size: 188_488,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());