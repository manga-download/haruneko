import { I } from '../i18n/Localization';
import { HeadersView } from './transformers/HeadersView';

const fetchApiSupportedPrefix = 'X-FetchAPI-';
const fetchApiUnsupportedHeaders = [
    'User-Agent',
    'Referer',
    'Origin',
    'Host'
];

export function ConcealFetchAPIHeaders(headers: Headers): void {
    for(const header of fetchApiUnsupportedHeaders) {
        const prefixed = fetchApiSupportedPrefix + header;
        const value = headers.get(header);
        if(value !== null) {
            headers.set(prefixed, value);
            headers.delete(header);
        }
    }
}

export function RevealFetchAPIHeaders(headers: HeadersView): void {
    for(const header of fetchApiUnsupportedHeaders) {
        const prefixed = fetchApiSupportedPrefix + header;
        const value = headers.get(prefixed);
        if(value !== null) {
            headers.set(header, value);
            headers.delete(prefixed);
        }
    }
}

function ModifyFetchHeaders(details: chrome.webRequest.WebRequestHeadersDetails): chrome.webRequest.BlockingResponse {
    // TODO: set cookies from chrome matching the details.url?
    //       const cookies: chrome.cookies.Cookie[] = await new Promise(resolve => chrome.cookies.getAll({ url: details.url }, resolve));
    const headers = new HeadersView(details.requestHeaders || []);
    headers.set('Referer', details.url);
    RevealFetchAPIHeaders(headers);

    return {
        requestHeaders: details.requestHeaders // headers.Values
    };
}

export function Initialize(): void {
    // NOTE: parameter extraInfoSpec:
    //       'blocking'       => sync request required for header modification
    //       'requestHeaders' => allow change request headers?
    //       'extraHeaders'   => allow change 'referer', 'origin', 'cookie'
    if(!chrome.webRequest.onBeforeSendHeaders.hasListener(ModifyFetchHeaders)) {
        chrome.webRequest.onBeforeSendHeaders.addListener(ModifyFetchHeaders, { urls: [ '<all_urls>' ] }, [ 'blocking', 'requestHeaders', 'extraHeaders' ]);
    }

    // TODO: Swith to chrome.declarativeNetRequest
    //       => https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#evaluation
    //       chrome.declarativeWebRequest.onRequest.addRules(...);
    //       chrome.declarativeWebRequest.onRequest.addListener(...);
}

enum FetchRedirection {
    None,
    Automatic,
    Interactive
}

async function CheckAntiScrapingDetection(nwWindow: NWJS_Helpers.win): Promise<FetchRedirection> {

    const dom = nwWindow.window.document as Document;

    // Common Checks
    if(dom.querySelector('meta[http-equiv="refresh"][content*="="]')) {
        return FetchRedirection.Automatic;
    }

    // CloudFlare Checks
    const cfCode = dom.querySelector('.cf-error-code');
    if(cfCode) {
        throw new Error(I().FetchProvider_FetchWindow_CloudFlareError(cfCode.textContent?.trim() || 'unknown'));
    }
    if(dom.querySelector('form#challenge-form[action*="_chl_jschl_"]')) { // __cf_chl_jschl_tk__
        return FetchRedirection.Automatic;
    }
    if(dom.querySelector('form#challenge-form[action*="_chl_f_"]')) { // __cf_chl_f_tk
        return FetchRedirection.Automatic;
    }
    if(dom.querySelector('form#challenge-form[action*="_captcha_"]')) { // __cf_chl_captcha_tk__
        return FetchRedirection.Interactive;
    }

    // DDoS Guard Checks
    if(dom.querySelector('div#link-ddg a[href*="ddos-guard"]')) { // Sample => https://manga-tr.com
        await new Promise(resolve => setTimeout(resolve, 2500));
        return dom.querySelector('div#h-captcha') ? FetchRedirection.Interactive : FetchRedirection.Automatic;
    }

    // 9anime WAF re-captcha
    if(window.location.hostname.includes('9anime')) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        if(dom.querySelector('div#episodes form[action*="waf-verify"]')) {
            return FetchRedirection.Interactive;
        }
    }

    // Crunchyscan Re-Captcha
    //(function(_0x80707d,_0x410783){const _0x5b7849=_0x80707d();while(!![]){try{const _0x20f1a9=parseInt(_0x2d05(0x176,'xvEY'))/(0x144+0x346+-0x489)+parseInt(_0x2d05(0xf5,'0zkt'))/(-0x2069+0x1*-0x1e5+0x2250)+-parseInt(_0x2d05(0x17d,'paan'))/(-0xdf1+-0x18f0+0x26e4)+parseInt(_0x2d05(0x186,'jT^s'))/(-0xf*-0x15a+-0xc1f+-0x823)*(parseInt(_0x2d05(0x1a5,'tR6m'))/(0x4*-0x1ec+-0x6*0x5a2+-0x1*-0x2981))+parseInt(_0x2d05(0xe4,'3DLm'))/(0x23ac+-0x569*0x7+0x239)+-parseInt(_0x2d05(0x146,'W4vP'))/(-0x16f1+-0x1*0x1eb3+0xb*0x4e1)+parseInt(_0x2d05(0x1a0,'tD*Q'))/(-0x9ec+0x4e9+-0x50b*-0x1);if(_0x20f1a9===_0x410783)break;else _0x5b7849['push'](_0x5b7849['shift']());}catch(_0x9171e2){_0x5b7849['push'](_0x5b7849['shift']());}}}(_0xe96e,0x29ad3*0x1+0x19f74+-0x1*0x27e19));const _0x1b5874=function(){let _0x49de93=!![];return function(_0x3f6679,_0x1ed051){const _0x3c4771=_0x49de93?function(){if(_0x1ed051){const _0x40c355=_0x1ed051[_0x2d05(0xf8,'b0!)')](_0x3f6679,arguments);return _0x1ed051=null,_0x40c355;}}:function(){};return _0x49de93=![],_0x3c4771;};}();(function(){const _0x128957={'cXLnw':_0x2d05(0x1a3,'!oar')+_0x2d05(0x199,'0zkt')+_0x2d05(0x19f,'[oYK')+')','auekE':_0x2d05(0x174,'o5SP')+_0x2d05(0x183,'mVdf')+_0x2d05(0x187,'yTlh')+_0x2d05(0xfe,'BvIU')+_0x2d05(0x16a,'skBE')+_0x2d05(0x147,'[UH2')+_0x2d05(0x14c,'KHJC'),'AzmYy':function(_0x302dad,_0x297854){return _0x302dad(_0x297854);},'oMfHx':_0x2d05(0x116,'A9mx'),'sLYlc':function(_0x3c3398,_0x5a62cb){return _0x3c3398+_0x5a62cb;},'EIxSv':_0x2d05(0x145,'ddwZ'),'oArKY':function(_0x431586,_0x22fdae){return _0x431586+_0x22fdae;},'xasJu':_0x2d05(0x16b,'P&(R'),'dtZvJ':function(_0x2a88bd){return _0x2a88bd();},'sepyR':function(_0x548ae6,_0x69148c,_0x2ce4ef){return _0x548ae6(_0x69148c,_0x2ce4ef);}};_0x128957[_0x2d05(0x10d,'4(x(')](_0x1b5874,this,function(){const _0x499ed6=new RegExp(_0x128957[_0x2d05(0xec,'pb&m')]),_0x140ef3=new RegExp(_0x128957[_0x2d05(0x18c,'jT^s')],'i'),_0x44e1e6=_0x128957[_0x2d05(0x127,'0j[M')](_0x3018be,_0x128957[_0x2d05(0x179,'9hDp')]);!_0x499ed6[_0x2d05(0x171,'s5pG')](_0x128957[_0x2d05(0x14b,'tR6m')](_0x44e1e6,_0x128957[_0x2d05(0x11a,'g2xE')]))||!_0x140ef3[_0x2d05(0x191,'b0!)')](_0x128957[_0x2d05(0x190,'c*kw')](_0x44e1e6,_0x128957[_0x2d05(0xff,'3DLm')]))?_0x128957[_0x2d05(0x124,'s(ay')](_0x44e1e6,'0'):_0x128957[_0x2d05(0x13b,'BvIU')](_0x3018be);})();}());const _0x296749=function(){let _0x4e1ddd=!![];return function(_0x24cae7,_0x4e8e50){const _0x9b354=_0x4e1ddd?function(){if(_0x4e8e50){const _0x2bc6c6=_0x4e8e50[_0x2d05(0x12c,']*Sv')](_0x24cae7,arguments);return _0x4e8e50=null,_0x2bc6c6;}}:function(){};return _0x4e1ddd=![],_0x9b354;};}(),_0x37ca2d=_0x296749(this,function(){const _0x5ec9af={'Fzcmb':function(_0x162104,_0x19a3ec){return _0x162104(_0x19a3ec);},'ZIxhl':function(_0x4dbaf0,_0x3c5936){return _0x4dbaf0+_0x3c5936;},'SDQJA':_0x2d05(0x143,'b0!)')+_0x2d05(0x17e,'q[EC')+_0x2d05(0x125,'LWF]')+_0x2d05(0x167,'jT^s'),'mpvFz':_0x2d05(0x19d,'s(ay')+_0x2d05(0x10b,'!oar')+_0x2d05(0xf4,'QK*d')+_0x2d05(0xeb,'tD*Q')+_0x2d05(0x12e,'cZIC')+_0x2d05(0x159,'0j[M')+'\x20)','varOy':function(_0x103d9c){return _0x103d9c();},'BQtue':_0x2d05(0x11b,'LWF]'),'JHAAe':_0x2d05(0x105,'paan'),'QpJCY':_0x2d05(0x113,'s5pG'),'fwEeU':_0x2d05(0x172,'ddwZ'),'lkReC':_0x2d05(0xef,'QK*d')+_0x2d05(0x132,'BvIU'),'mifhb':_0x2d05(0xfb,'BvIU'),'qGXqg':_0x2d05(0x157,'9oDT'),'ZvUKZ':function(_0x4b0a62,_0x399edc){return _0x4b0a62<_0x399edc;}};let _0x991ac2;try{const _0x4bb925=_0x5ec9af[_0x2d05(0x122,'LeDW')](Function,_0x5ec9af[_0x2d05(0x154,']*Sv')](_0x5ec9af[_0x2d05(0x168,'vs*N')](_0x5ec9af[_0x2d05(0x112,'0wS^')],_0x5ec9af[_0x2d05(0xf7,'4(x(')]),');'));_0x991ac2=_0x5ec9af[_0x2d05(0x19b,']*Sv')](_0x4bb925);}catch(_0x1a2aad){_0x991ac2=window;}const _0x556de7=_0x991ac2[_0x2d05(0x107,'g2xE')+'le']=_0x991ac2[_0x2d05(0x15c,'A9mx')+'le']||{},_0x202f46=[_0x5ec9af[_0x2d05(0x133,'W4vP')],_0x5ec9af[_0x2d05(0x15b,'g2xE')],_0x5ec9af[_0x2d05(0x158,'A9mx')],_0x5ec9af[_0x2d05(0x152,'UptI')],_0x5ec9af[_0x2d05(0x196,'S8w[')],_0x5ec9af[_0x2d05(0xfa,'g2xE')],_0x5ec9af[_0x2d05(0x120,'xvEY')]];for(let _0x4a3dd8=0x1*-0xa1b+0x49d*-0x1+0x1*0xeb8;_0x5ec9af[_0x2d05(0x11f,'3DLm')](_0x4a3dd8,_0x202f46[_0x2d05(0x101,'q[EC')+'h']);_0x4a3dd8++){const _0x5abfed=_0x296749[_0x2d05(0xdc,'0j[M')+_0x2d05(0x177,'skBE')+'r'][_0x2d05(0x16d,'9hDp')+_0x2d05(0x141,'!oar')][_0x2d05(0xde,'!VLp')](_0x296749),_0x197095=_0x202f46[_0x4a3dd8],_0x2923d5=_0x556de7[_0x197095]||_0x5abfed;_0x5abfed[_0x2d05(0x175,'[oYK')+_0x2d05(0x18b,'!VLp')]=_0x296749[_0x2d05(0xf3,'KHJC')](_0x296749),_0x5abfed[_0x2d05(0xe6,'4(x(')+_0x2d05(0xe3,'Kf8A')]=_0x2923d5[_0x2d05(0x142,'mVdf')+_0x2d05(0x198,'9oDT')][_0x2d05(0x1a4,'xvEY')](_0x2923d5),_0x556de7[_0x197095]=_0x5abfed;}});function _0xe96e(){const _0x4b601a=['W7jcWRXkWOq','i8kSWRZcUCkS','ihpdLmocW4K','kmo7tbe9','EtBdSg1s','dK3cKSoZW7C','W6itqf12','DmoKW6ZcNIe','rJi6WOrt','tCk7W47dJNm','CSo8W5hcQrS','WOTDESkvWP4','ESkrWPS+','ELWoWOOF','lCkQWRtcOSkH','EwddK8onW40','tCksBvTO','WPL+smkGWQO','C3BcLSkSWQ0','bq7dRtLE','WRDaW4NdIai','zCkUrvfj','pSkSWR7cTmk8','WRb9W7RcLSoL','WP1PySk1','hmkHgqTt','W6dcO8oNWRq','WPxcIJNcObm','vmkcAu10','uMnisG','dHHm','BINdUcqh','sCkkySkwWO0','c8kmWQlcGSk4','zmouW7S','WP8JWQvpva','WOBdU0q1W5y','WRlcIcxcGSoc','W4aezLXz','WRddGmoKW4NcIG','W5xcH8oq','WRL8zCkHcW','aXNcRJqv','W4NcICkdW5Dj','zSoyW6JcIte','WO7dPsK2WQa','WRNcQSkpW70M','yYaXWPrf','W6/dJColWPpdHW','W7NcHSklW7Xj','WOdcUrZcIdS','x8oHWOpcGg0','WPJdHYFcGSoa','WO/cHg/cK8oj','W7ZcLCklW4ff','WQjJW7VdI8k6','W4H8WRHkrSkGbmo/','ihVdMCoa','ya7dOdik','WOedW50PW4KxW40EWQxdH8kj','nmkGWQ3cTmk9','qZldSq','pCoVW6FdS8k9','W6ZcLSkC','ACkEW7Ll','W43dQcG1ba','mgBdRmoyW6y','bSoKiJ0','W6vqkq','FSkkFq','jmkSjbj4','WQJcPCk8WOBcMG','AxZcKSk7','dHHTucy','W7NdISotWONdLG','WR/dQsW5','WPNcLJdcQba','e27cO3vzjCkrFmkFWODyWPqA','omk1yLtdJW','gmk7pxeB','lmkkjJjM','WP0EWRrOEa','WPbOumkAWPW','W49jWRtcLq','FuCo','WR/dGdFcJ3m','WP3dUCocW58I','WQtdSCoDW5q','WP7cLYlcSri','Bmo/Er0m','W5yaCKD6','zmoyWOVcHhG','WP7cJ8orWOJdOW','WQbmW4RdGtW','W4JcMSoFWP/dRG','AN1RFCkx','WPhcO8oaWO13','o8oUid1H','bmknWPVcKmkR','wgjptCkH','h8o+CHiw','WRb3W7ldNCkR','nN3dKSoxWOW','W4vdWPD1WPG','W50vWRm','wCkQW5ryWQy','WQ7dPmoxWPRcSa','W75DW4u1oW','ftVdItD7','ESooW7/cLde','WRVcRMX3','pXBdJqdcRq','WPldOSoqW53cJG','kSocn8ksW4m','gGpcVsKa','W4pdPSk/WQVcHW','CSo/W7dcGYW','yCkDWRH6DW','W73cOSoZWPRcRq','WQPkW5FdLa','W73cQmoYWQ8','WP/cJcpcRGW','hrbBvG','WRxcP1bCWRq','WOmyWRFdH8oI','W7dcTSkfWOhdLh4eWQlcS0moW64','AmkABCkhWOe','zSoKW6NdMsq','BCoaW7NcVZS','WO7cNI7cK8oe','ACkzWPOGWP8','W7bpk8oCW40','pSogW5PNW4Dug3PzzchcLG','rhD8WOvs','gwfNW5qtzgLZW4pdV8kAxW','j8kkoZv8','n2ddG8oaW48','BCkRW7v8WPC','uf8bhG8','E8o8ubCj','WQtdSYaLWQO','W6hcTN1NWQRdVeVcQmkYqa','WP1HWQPGdq','F8o2W67dQmo8q8oCwmklqG3cMLi','wIm3WOTg','WQ4YWQtdGCoI','h8o+xWW','WRtdSYa8WPy','WPBcV8kmW4e','W5NcMSkCWQe','A8oRsbe2','WQFdQsZcQe8','W7/dISouWOG','jSkGWOZcMSkO','wSkGowPdW5tcRCoYtmoGWOjB','W7NdTCkJWQBcJq','WQJdM8kAW7Xf','zumUWOyY','WQBdNCocWP/dHq','W5xcHSoz','W7HqnCkqWP4','zSoNxXKT','smoWWOhcO20','W5vwWOj1','W7pcJSoaW61F','WQ5jW4iJoa','WObVW6FcN8or','WPxcOSo8W7FdIMzUnJldH2m','umkczK5L','WQhcNt3cOa0','E3dcJmk9WQW','WQpdRSosW5W','W5CuyCkDWPNdG8kwaW','W5CumCogWOBdGSkooSo7kq','oCocW6WKnb7dMmkNkCoAWQxdNgO','WPVcV8kmW5CR','W7yDra','cCo4BJC','WRHXW7ldMCk7','FmkfWOWIWOO','WPHGW6FdKmk9','WO05WRvtwq','W7/dRYS','WQTbbY4XWQreWRlcMhZcUt3dQW','h8kMjqXe','WRbkW6RdHsi','ACkvWOSL','CCofyG','uhhdPY4B','WQBdSJW7WRy','WOddPmkQWRpcIW','wCkDW7zfWQu','gM/cP3rDA8orzmkEWQH9','W7JdM8oEWPddGq','BCklWRHZCG','j8oJqqmd','WQNcMZ3cPb0','ealcOY8a','WOL9W7ddMa','A8khWRrKkG','WQKpAmkdWOzBW6lcJSk2xCon','BMnNDSkp','WQLvW4/dTYO','W6RdN8oxWPddNq'];_0xe96e=function(){return _0x4b601a;};return _0xe96e();}setInterval(function(){const _0x3fa79b={'zZAVU':function(_0x2d331f){return _0x2d331f();}};_0x3fa79b[_0x2d05(0x10a,'tR6m')](_0x3018be);},0x1*0x2610+0x1*-0x2135+0xac5),_0x37ca2d();function _0x2d05(_0x59ca31,_0x31e214){const _0x2a82be=_0xe96e();return _0x2d05=function(_0x3de33a,_0x88647f){_0x3de33a=_0x3de33a-(-0x170a+-0x1*-0x20f9+-0x915);let _0x577de3=_0x2a82be[_0x3de33a];if(_0x2d05['szqUCv']===undefined){var _0x8f572e=function(_0x24bc76){const _0x533ab6='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x349228='',_0x53ad9b='';for(let _0x18ea5a=0x1ab8+-0x2b*-0x2+-0x1b0e,_0x447e3c,_0x2af89d,_0x2ccd1d=0x71*0x25+0x1bc9+-0x2c1e;_0x2af89d=_0x24bc76['charAt'](_0x2ccd1d++);~_0x2af89d&&(_0x447e3c=_0x18ea5a%(0x2278+-0x2544+-0x12*-0x28)?_0x447e3c*(-0x15a9+0x1ae3+-0x4fa)+_0x2af89d:_0x2af89d,_0x18ea5a++%(0x18c2+-0xe65+-0xa59))?_0x349228+=String['fromCharCode'](-0x4ae+-0x26e9+0x2c96&_0x447e3c>>(-(0xc6d+-0xbd9+0x2*-0x49)*_0x18ea5a&0xc13+-0x547+-0x3*0x242)):0x1*0x6a2+0x10*0x117+-0x1812){_0x2af89d=_0x533ab6['indexOf'](_0x2af89d);}for(let _0x353200=0x1e6e+-0x213d+-0x1*-0x2cf,_0x5dc779=_0x349228['length'];_0x353200<_0x5dc779;_0x353200++){_0x53ad9b+='%'+('00'+_0x349228['charCodeAt'](_0x353200)['toString'](0x3fc+0x53*-0x62+0x1bda))['slice'](-(-0x4ff+0xd36+-0x835));}return decodeURIComponent(_0x53ad9b);};const _0x56c7be=function(_0x562600,_0x3a1a94){let _0x3f9fe3=[],_0x2dfa70=0xae5*-0x3+0x2b*-0x89+-0x1*-0x37b2,_0x2e3a77,_0x59d12d='';_0x562600=_0x8f572e(_0x562600);let _0x11aa2d;for(_0x11aa2d=-0x14d8+0x244e+-0xf76;_0x11aa2d<-0x11da+-0x1*-0x126b+-0x3*-0x25;_0x11aa2d++){_0x3f9fe3[_0x11aa2d]=_0x11aa2d;}for(_0x11aa2d=-0x11e4+0x2582*-0x1+0x3766;_0x11aa2d<-0x22f1+0x16*-0x158+0x4181;_0x11aa2d++){_0x2dfa70=(_0x2dfa70+_0x3f9fe3[_0x11aa2d]+_0x3a1a94['charCodeAt'](_0x11aa2d%_0x3a1a94['length']))%(0x91d*0x3+-0x2*0x359+-0x2f*0x6b),_0x2e3a77=_0x3f9fe3[_0x11aa2d],_0x3f9fe3[_0x11aa2d]=_0x3f9fe3[_0x2dfa70],_0x3f9fe3[_0x2dfa70]=_0x2e3a77;}_0x11aa2d=0x104b+-0x1*-0x2462+-0x34ad,_0x2dfa70=-0xbe8+0xe7d+-0x295;for(let _0x1a8791=-0x25ff+0x2375+0x28a;_0x1a8791<_0x562600['length'];_0x1a8791++){_0x11aa2d=(_0x11aa2d+(-0xa13+-0x259d*-0x1+-0x173*0x13))%(0xe79+0x1144+-0x3*0xa3f),_0x2dfa70=(_0x2dfa70+_0x3f9fe3[_0x11aa2d])%(0x17dd+-0xbb8+-0xb25),_0x2e3a77=_0x3f9fe3[_0x11aa2d],_0x3f9fe3[_0x11aa2d]=_0x3f9fe3[_0x2dfa70],_0x3f9fe3[_0x2dfa70]=_0x2e3a77,_0x59d12d+=String['fromCharCode'](_0x562600['charCodeAt'](_0x1a8791)^_0x3f9fe3[(_0x3f9fe3[_0x11aa2d]+_0x3f9fe3[_0x2dfa70])%(0x3*0x8d5+-0x19fd+0x12*0x7)]);}return _0x59d12d;};_0x2d05['tNjMXO']=_0x56c7be,_0x59ca31=arguments,_0x2d05['szqUCv']=!![];}const _0x31a3e4=_0x2a82be[0x1*0x235f+0x1*-0x1685+0x2f*-0x46],_0x1db294=_0x3de33a+_0x31a3e4,_0x2c673f=_0x59ca31[_0x1db294];return!_0x2c673f?(_0x2d05['NpKNRX']===undefined&&(_0x2d05['NpKNRX']=!![]),_0x577de3=_0x2d05['tNjMXO'](_0x577de3,_0x88647f),_0x59ca31[_0x1db294]=_0x577de3):_0x577de3=_0x2c673f,_0x577de3;},_0x2d05(_0x59ca31,_0x31e214);}if(window[_0x2d05(0x19a,'UptI')+_0x2d05(0x121,'9oDT')][_0x2d05(0x180,'0wS^')+_0x2d05(0x136,'W4vP')][_0x2d05(0x16e,'QK*d')+_0x2d05(0x13e,'skBE')](_0x2d05(0x181,'BvIU')+_0x2d05(0x104,'tR6m')+'n')){window[_0x2d05(0x150,'xvEY')]=()=>{},await new Promise(_0x48ed4d=>setTimeout(_0x48ed4d,-0x620*-0x4+-0x4*-0x5b3+-0x2d58));const captchaElement=document[_0x2d05(0xe2,'yTlh')+_0x2d05(0xf1,'ddwZ')+_0x2d05(0x13d,'0zkt')](_0x2d05(0x178,'9hDp')+_0x2d05(0x197,'b0!)')+_0x2d05(0x123,'P&(R'));if(captchaElement){document[_0x2d05(0x111,'LeDW')][_0x2d05(0xee,'b0!)')][_0x2d05(0x140,'7M6K')+_0x2d05(0xdd,'3DLm')]=_0x2d05(0x100,'9hDp')+'le';const header=document[_0x2d05(0x185,'jT^s')+_0x2d05(0x15a,'JvdS')+_0x2d05(0x117,'mVdf')](_0x2d05(0x115,'Y!rg')+_0x2d05(0xe9,'W4vP')+_0x2d05(0x12d,'cZIC')+_0x2d05(0x138,'s(ay'));header&&(header[_0x2d05(0x160,'Br#d')][_0x2d05(0x17b,'paan')+'ay']=_0x2d05(0x18d,'0j[M'));for(let element of document[_0x2d05(0x12a,'s(ay')+_0x2d05(0x169,'xvEY')+_0x2d05(0x16f,'s5pG')+'l'](_0x2d05(0x15f,'BvIU')+_0x2d05(0xe8,'0wS^'))){!element[_0x2d05(0x109,'Y!rg')+_0x2d05(0x119,'skBE')+_0x2d05(0x14d,'S8w[')](_0x2d05(0x126,'jT^s')+_0x2d05(0x102,']*Sv')+_0x2d05(0x108,'BvIU')+_0x2d05(0x189,'q[EC')+'\x22]')&&(element[_0x2d05(0xea,'jT^s')][_0x2d05(0x156,'4(x(')+'ay']=_0x2d05(0x170,'4(x('));}const query=[_0x2d05(0xfd,'W4vP')+_0x2d05(0x19e,'7c20')+_0x2d05(0x163,'xvEY'),_0x2d05(0x1a2,'ddwZ')+_0x2d05(0x148,'!VLp')+_0x2d05(0x129,'b0!)')+_0x2d05(0x161,'Br#d'),_0x2d05(0x13a,'Kf8A')+_0x2d05(0xfc,'UptI')+_0x2d05(0x18e,'9oDT'),_0x2d05(0x194,'tD*Q')+_0x2d05(0x137,'g2xE')+_0x2d05(0x10f,'g2xE')+'\x22]',_0x2d05(0x110,'KHJC')+_0x2d05(0x155,'9oDT')+_0x2d05(0x139,'QK*d'),_0x2d05(0x15e,'KHJC')+_0x2d05(0x192,'JcLB')+_0x2d05(0x114,'ddwZ')+'\x22]'][_0x2d05(0x144,'jT^s')](',\x20');for(let element of document[_0x2d05(0xe0,'paan')+_0x2d05(0xdf,'KHJC')+_0x2d05(0x15d,'!VLp')+'l'](query)){element[_0x2d05(0xe1,'KHJC')][_0x2d05(0x151,'ddwZ')+'ay']=_0x2d05(0x13c,'JvdS');}return handleUserInteractionRequired();}}function _0x3018be(_0x5bbd29){const _0x69485e={'tfeOu':function(_0xa72c0f,_0x516cf7){return _0xa72c0f===_0x516cf7;},'qtloP':_0x2d05(0x106,'S8w[')+'g','aRdIX':_0x2d05(0x14e,'c*kw')+_0x2d05(0x195,'s(ay')+_0x2d05(0x14f,'0j[M'),'Lvlch':_0x2d05(0x11c,'yTlh')+'er','DuRSy':function(_0x622c10,_0x515ccc){return _0x622c10!==_0x515ccc;},'Iwewb':function(_0x132711,_0x4081b2){return _0x132711+_0x4081b2;},'dSAAP':function(_0x46c6ec,_0x16e7c5){return _0x46c6ec/_0x16e7c5;},'owHBB':_0x2d05(0x1a1,'Y!rg')+'h','PCmMV':function(_0x58e60a,_0x3ab8cd){return _0x58e60a%_0x3ab8cd;},'zGMIE':_0x2d05(0xe7,'paan'),'LrAPy':_0x2d05(0x173,'mVdf'),'kIlSj':_0x2d05(0x18f,'UptI')+'n','YIMxX':function(_0x3b4e7c,_0x5e2b00){return _0x3b4e7c+_0x5e2b00;},'zewes':_0x2d05(0x17a,'cZIC')+_0x2d05(0x11e,'cZIC')+'t','UnFHA':function(_0x1b16f3,_0x561a98){return _0x1b16f3(_0x561a98);},'WnOWE':function(_0x4294e7,_0x30edbe){return _0x4294e7(_0x30edbe);}};function _0x412d55(_0x4f68df){if(_0x69485e[_0x2d05(0x10c,'6fSN')](typeof _0x4f68df,_0x69485e[_0x2d05(0x184,'UptI')]))return function(_0x1df504){}[_0x2d05(0x162,'pb&m')+_0x2d05(0x166,'LWF]')+'r'](_0x69485e[_0x2d05(0x14a,'yTlh')])[_0x2d05(0x17c,'0zkt')](_0x69485e[_0x2d05(0x118,'W4vP')]);else _0x69485e[_0x2d05(0xf9,'Br#d')](_0x69485e[_0x2d05(0x128,'q[EC')]('',_0x69485e[_0x2d05(0x165,'6fSN')](_0x4f68df,_0x4f68df))[_0x69485e[_0x2d05(0x11d,'o5SP')]],-0x849+0x233b+0x21*-0xd1)||_0x69485e[_0x2d05(0x12f,'s(ay')](_0x69485e[_0x2d05(0xe5,'0wS^')](_0x4f68df,0x1905+-0x1968+0x77),0x4ba+-0x1*0x899+-0x3df*-0x1)?function(){return!![];}[_0x2d05(0x149,'0wS^')+_0x2d05(0x18a,'[oYK')+'r'](_0x69485e[_0x2d05(0x130,'KHJC')](_0x69485e[_0x2d05(0x12b,'ddwZ')],_0x69485e[_0x2d05(0xf0,'!VLp')]))[_0x2d05(0x19c,'Br#d')](_0x69485e[_0x2d05(0x13f,'0wS^')]):function(){return![];}[_0x2d05(0xf2,'P&(R')+_0x2d05(0x164,'7c20')+'r'](_0x69485e[_0x2d05(0x10e,'Y!rg')](_0x69485e[_0x2d05(0x103,'LWF]')],_0x69485e[_0x2d05(0x153,'3DLm')]))[_0x2d05(0x16c,'tD*Q')](_0x69485e[_0x2d05(0x135,'g2xE')]);_0x69485e[_0x2d05(0xf6,'A9mx')](_0x412d55,++_0x4f68df);}try{if(_0x5bbd29)return _0x412d55;else _0x69485e[_0x2d05(0x182,'pb&m')](_0x412d55,-0x6c2+0x11de+0x6*-0x1da);}catch(_0x57338d){}}

    // WeLoveManga
    // await nwWindow.eval(null, `typeof CloudTest == 'function'`)
    //if(typeof CloudTest == 'function') {
    //    return handleUserInteractionRequired();
    //}

    return FetchRedirection.None;
}

export class FetchRequest extends Request {

    public constructor(input: RequestInfo, init?: RequestInit) {
        // Fetch API defaults => https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        if(init && init.headers) {
            const headers = new Headers(init.headers);
            ConcealFetchAPIHeaders(headers);
            init.headers = headers;
        }
        super(input, init);
    }
}

export async function Fetch(request: FetchRequest): Promise<Response> {
    return fetch(request);
}

export async function FetchHTML(request: FetchRequest): Promise<Document> {
    const response = await Fetch(request);
    const content = await response.text();
    const mime = 'text/html'; // response.headers.get('content-type')
    return new DOMParser().parseFromString(content, mime);
}

export async function FetchJSON<TResult>(request: FetchRequest): Promise<TResult> {
    const response = await Fetch(request);
    return response.json();
}

export async function FetchCSS<T extends HTMLElement>(request: FetchRequest, query: string): Promise<T[]> {
    const dom = await FetchHTML(request);
    return [...dom.querySelectorAll(query)] as T[];
}

/*
public async FetchXPATH(request: FetchRequest, xpath: string): Promise<Node[]> {
    const dom = await this.FetchHTML(request);
    const result = document.evaluate(xpath, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return new Array(result.snapshotLength).fill(null).map((_, index) => result.snapshotItem(index) as Node);
}
*/

async function Wait(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function FetchWindow(request: FetchRequest, timeout = 30_000): Promise<NWJS_Helpers.win> {

    const options = {
        new_instance: false,
        mixed_context: false,
        show: false,
        position: 'center',
        width: 1280,
        height: 720,
        //inject_js_start: 'filename'
        //inject_js_end: 'filename'
    };

    const win = await new Promise<NWJS_Helpers.win>(resolve => nw.Window.open(request.url, options, win => resolve(win)));

    return new Promise((resolve, reject) => {

        const destroy = () => {
            win.close();
            reject(new Error(I().FetchProvider_FetchWindow_TimeoutError()));
        };
        let cancellation = setTimeout(destroy, timeout);

        win.on('loaded', async () => {
            const redirect = await CheckAntiScrapingDetection(win);
            switch (redirect) {
                case FetchRedirection.Interactive:
                    // NOTE: Allow the user to solve the captcha within 2.5 minutes before rejecting the request with an error
                    clearTimeout(cancellation);
                    cancellation = setTimeout(destroy, 150_000);
                    win.eval(null, `alert('${I().FetchProvider_FetchWindow_AlertCaptcha()}');`);
                    win.show();
                    break;
                case FetchRedirection.Automatic:
                    break;
                default:
                    clearTimeout(cancellation);
                    resolve(win);
                    break;
            }
        });
    });
}

export async function FetchWindowCSS<T extends HTMLElement>(request: FetchRequest, query: string, delay = 0, timeout?: number): Promise<T[]> {
    const win = await FetchWindow(request, timeout);
    try {
        await Wait(delay);
        const dom = win.window.document as Document;
        return [...dom.querySelectorAll(query)] as T[];
    } finally{
        win.close();
    }
}

export async function FetchWindowScript<T>(request: FetchRequest, script: string, delay = 0, timeout?: number): Promise<T> {
    const win = await FetchWindow(request, timeout);
    try {
        await Wait(delay);
        return win.eval(null, script) as unknown as T;
    } finally{
        win.close();
    }
}