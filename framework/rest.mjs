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
    if (proxy) {
        const proxyAgent = new HttpsProxyAgent(proxy.url)
        opt.agent = proxyAgent;
    }

    let data = null;
    let response = null;
    let text = null;
    response = await fetch(url, opt);

    text = await response.text();
    text = text.trim();
    // console.log("Response text: ", text);
    if (text.length !== 0)
        try {
            data = JSON.parse(text);
        } catch (error) {
            // We just assume the result is a string
            data = text;
        }

    // If the response HTTP status is different than 2xx, then we want to throw this as an exception.
    if ((response.status < 200 || response.status >= 300) && response.status !== 418)
        throw data;

    return data;

}

export async function fetchPost({ url, body, headers, proxy }) {
    return await _fetch({ method: "post", url, body, headers, proxy });
}

export async function fetchPut({ url, body, headers, proxy }) {
    return await _fetch({ method: "put", url, body, headers, proxy });
}

export async function fetchGet({ url, headers, proxy }) {
    return await _fetch({ method: "get", url, body: undefined, headers, proxy });
}

export async function fetchDelete({ url, body, headers, proxy }) {
    return await _fetch({ method: "delete", url, body, headers, proxy });
}