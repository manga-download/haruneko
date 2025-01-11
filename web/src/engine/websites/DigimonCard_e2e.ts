import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'digimoncard',
        title: 'DigimonCard'
    },
    container: {
        url: 'https://digimoncard.com/digimon_liberator/en/comic/',
        id: '/digimon_liberator/en/comic/',
        title: 'DIGIMON LIBERATOR'
    },
    /* url param "param" is random
    child: {
        id: '/digimon_liberator/viewer/index.php?cgi=/digimon_liberator/api/diazepam_hai.php&param=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ=',
        title: 'Episode 07 [Pt.1]'
    },
    entry: {
        index: 2,
        size: 550_521,
        type: 'image/png'
    }*/
};

new TestFixture(config).AssertWebsite();