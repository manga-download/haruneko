import { TestFixture } from '../../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bot-check',
        title: '🔷 Bot-Check 🔷'
    },
    container: {
        url: 'https://www.browserscan.net/bot-detection',
        id: 'https://www.browserscan.net/bot-detection',
        title: 'BrowserScan: Robot Detection',
    },
    child: {
        id: 'https://www.browserscan.net/bot-detection',
        title: '✅ SUCCESS',
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'bot-check',
        title: '🔷 Bot-Check 🔷'
    },
    container: {
        url: 'https://cloudflare.bot-check.ovh/automatic',
        id: 'https://cloudflare.bot-check.ovh/automatic',
        title: 'Cloudflare: JavaScript Challenge',
    },
    child: {
        id: 'https://cloudflare.bot-check.ovh/automatic',
        title: '✅ SUCCESS',
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'bot-check',
        title: '🔷 Bot-Check 🔷'
    },
    container: {
        url: 'https://vercel.bot-check.ovh',
        id: 'https://vercel.bot-check.ovh',
        title: 'Vercel: Attack Challenge Mode',
    },
    child: {
        id: 'https://vercel.bot-check.ovh',
        title: '✅ SUCCESS',
    }
}).AssertWebsite();