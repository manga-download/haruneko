import Headers from './HeaderProcessor';

async function Wait(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

function Print(message: string) {
    console.log(message);
    let li = document.createElement('li');
    li.innerText = message;
    document.getElementById('events').appendChild(li);
}

export interface IPlayground {
    About: () => Promise<void>;
    FetchHeadersTest: () => Promise<void>;
}

export class Playground implements IPlayground {

    async About(): Promise<void> {
        let info = [
            'Platform: ' + process.platform,
            'NW.js: ' + process.versions['node-webkit']
        ].join('\n');
        alert(info);
    }

    async FetchHeadersTest(): Promise<void> {
        chrome.webRequest.onBeforeSendHeaders.addListener(details => {
            /* remove user agent header ...
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'User-Agent') {
                details.requestHeaders.splice(i, 1);
                break;
                }
            }
            */
            // [ { name: 'X-Referer', value: 'foo' }, { name: 'user-agent', value: 'bar' } ]
            /*
            let headers = details.requestHeaders.reduce((accumulator, item) => {
                accumulator[item.name.toLowerCase()] = item.value;
                return accumulator;
            }, {});
            */
           let headers = new Headers(details.requestHeaders);
           headers.SetHeader('User-Agent', 'Mozilla/5.0 (HakuNeko; Intel Mac OS X 10.15.3)');
           headers.SetHeader('Referer', 'https://hakuneko.download');
           headers.SetHeader('Origin', 'hakuneko.download');
           headers.SetHeader('Cookie', 'adult=1');
            console.log('HEADERS:', headers.Values);
            return {
                requestHeaders: headers.Values
            };
        }, { urls: [ '<all_urls>', '*://www.evil.com/*' ] }, [ 'blocking' /* sync request required for header modification */, 'requestHeaders', 'extraHeaders' /* allow change referer, origin, cookie */ ]);

        let response = await fetch('https://postman-echo.com/get', {
            method: 'GET',
            referrer: 'https://hakuneko.download',
            headers: {
                'user-agent': 'Mozilla/5.0 (HakuNeko; Intel Mac OS X 10.15.3)',
                //'referer': 'https://hakuneko.download',
                'origin': 'hakuneko.download',
                'cookie': 'adult=1',
                'x-foo': 'bar'
            }
        });
        let data = await response.json();

        // assertions
        if(data.headers['user-agent'] === 'Mozilla/5.0 (HakuNeko; Intel Mac OS X 10.15.3)'
            && data.headers['referer'] === 'https://hakuneko.download'
            && data.headers['origin'] === 'hakuneko.download'
            && data.headers['cookie'] === 'adult=1'
            && data.headers['x-foo'] === 'bar'
        ) {
            console.log('testFetchHeaders()', 'SUCCESS');
        } else {
            console.error('testFetchHeaders()', 'FAILED');
        }
        /*
        let data = await axios.get( 'https://postman-echo.com/get', {
            //url: 'https://postman-echo.com/get',
            headers: {
                'user-agent': 'Mozilla/5.0 (HakuNeko; Intel Mac OS X 10.15.3)',
                //'referer': 'https://hakuneko.download',
                'origin': 'hakuneko.download',
                'cookie': 'adult=1',
                'x-foo': 'bar'
            }
            // merge cookies... ?
        });
        console.log('testFetchHeaders()', data.data);
        */
    }
}