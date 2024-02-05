import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

/**
 * Default REST headers: using JSON for everything.
 */
const options = { headers: { 'Content-Type': 'application/json' } }

async function _fetch({ method, url, body, headers, proxy }) {
    url = encodeURI(url);

    let h = {
        ...options.headers,
        ...headers,
    };

    let b = body ? JSON.stringify(body) : null;

    let opt = {
        ...options,
        method,
        body: b,
        headers: h
    };

    // Add the web proxy configuration if it is expected...
    if(proxy){
        const proxyAgent = new HttpsProxyAgent(proxy.url)
        opt.agent = proxyAgent;
    }

    let response = await fetch(url, opt);

    let data = null;
    let text = await response.text();
    text = text.trim();
    if (text.length !== 0)
        data = JSON.parse(text);

    return data;
}

export async function fetchPost({ url, body, headers, proxy }) {
    return await _fetch({ method: "post", url, body, headers, proxy });
}

export async function fetchPut(url, body, headers, proxy) {
    return await _fetch({ method: "put", url, body, headers, proxy });
}

export async function fetchGet({ url, headers, proxy }) {
    return await _fetch({ method: "get", url, body: undefined, headers, proxy });
}

export async function fetchDelete({ url, headers, proxy }) {
    return await _fetch({ method: "delete", url, body: undefined, headers, proxy });
}

