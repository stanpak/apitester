import * as assert from "./assert.mjs";

export async function getEnvironment() {
    let envId = "local";
    if (process.argv.length === 3)
        envId = process.argv[2];
    let dirName = process.cwd();
    let path = dirName + "/env-" + envId + ".mjs";
    let env = await import(path);
    // console.log({ envId, dirName, path, env });
    return env.default;
}

export async function testSuite(o, env) {
    const name = obj => Object.keys(obj)[0];
    const module = obj => Object.values(obj)[0];
    const n = name(o);
    const m = module(o);

    let totalCount = 0;
    let failedCount = 0;
    for (let callName in o) {
        assert.testStarted("suite", callName);

        totalCount++;
        let c = o[callName];

        try {
            await c(env);
            console.info("   ", c, `--> OK`);
        }
        catch (err) {
            failedCount++;
            console.error("   ", c, `--> FAILED`);
        }
    }

    if (failedCount !== 0)
        console.info(`Test suite FAILED. failed: ${failedCount}, total: ${totalCount}\n`);
    else
        console.info(`Test suite passed. total: ${totalCount}\n`);
}

export async function test(call, env) {
    try {
        assert.testStarted("suite", call);

        await call(env);
        console.info(`Test performed: OK`, call);
    }
    catch (err) {
        console.error({ err });
        console.error(`Test performed: Errors`, call);
    }
}

