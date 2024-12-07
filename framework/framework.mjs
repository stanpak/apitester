import * as assert from "./assert.mjs";
import chalk from "chalk";

/**
 * Structure that stores all of the assertion failures that happened during the test runs.
 * Test assertions are grouped by the suite and then test names.
 */
const failedAssertions = {};

let totalTestCount = 0;
let passedTestCount = 0;
let failedTestCount = 0;
let erroedTestCount = 0;

 const currentTest = {
    suite: null,
    test: null,
    failed: false,
    erroed: false,
};


/**
 * This function is called when an assertion fails. 
 * We need to register the place where it happened.
 * @param {*} message 
 */
export function assertionFailed(message) {
    currentTest.failed = true;

    let suiteInfo = failedAssertions[currentTest.suite];
    if (!suiteInfo) {
        suiteInfo = {
            name: currentTest.suite,
            tests: {}
        };
        failedAssertions[currentTest.suite] = suiteInfo;
    }

    let testInfo = suiteInfo.tests[currentTest.test];
    if (!testInfo) {
        testInfo = {
            name: currentTest.test,
            assertions: [],
            errors: [],
        };
        suiteInfo.tests[currentTest.test] = testInfo;
    }

    testInfo.assertions.push({
        message
    });
}

 function onTestEnd() {
    totalTestCount++;

    if (currentTest.failed)
        failedTestCount++;
    else
        if (currentTest.erroed)
            erroedTestCount++;
        else
            passedTestCount++;

    let res = currentTest.erroed ? chalk.red.bold("ERROR") : 
        currentTest.failed ? chalk.yellow.bold("FAILED") : chalk.green.bold("OK");
    console.log(`Test "${currentTest.suite}.${currentTest.test}" finished -> ${res}`);
}


 function registerTestError(err){
    currentTest.erroed = true;

    let suiteInfo = failedAssertions[currentTest.suite];
    if (!suiteInfo) {
        suiteInfo = {
            name: currentTest.suite,
            tests: {}
        };
        failedAssertions[currentTest.suite] = suiteInfo;
    }

    let testInfo = suiteInfo.tests[currentTest.test];
    if (!testInfo) {
        testInfo = {
            name: currentTest.test,
            assertions: [],
            errors: [],
        };
        suiteInfo.tests[currentTest.test] = testInfo;
    }

    testInfo.errors.push({
        err,
        message: err.message,
    });
}

/**
 * This function is called at the end of the test run. It records the basic statistics.
 * @param {*} suite 
 * @param {*} test 
 */
 function testStarted(suite, test) {
    currentTest.suite = suite;
    currentTest.test = test.name ?? "?";
    currentTest.startedAt = new Date();
    currentTest.failed = false;
    currentTest.erroed = false;
}


export function printTestResultsSummary() {
    console.log("");
    console.log("---------------------");
    console.log("");

    let res = erroedTestCount !== 0 ? chalk.red.bold("ERROR") : 
        failedTestCount !== 0 ? chalk.yellow.bold("FAILED") : 
        chalk.green.bold("OK");

    console.log(`Test results: ${res}`);

    console.log("Total tests: " + totalTestCount);
    console.log("Passed tests: " + passedTestCount);
    console.log("Failed tests: " + failedTestCount);
    console.log("Erroed tests: " + (erroedTestCount !==0 ? chalk.bold.red(erroedTestCount) : erroedTestCount));

    console.log("");
    console.log("Problems found: ");
    console.log("-------------------");
    for (const suiteName in failedAssertions) {
        console.log(`Suite: "${suiteName}"`);
        const suite = failedAssertions[suiteName];
        for (const testName in suite.tests) {
            const test = suite.tests[testName];

            let result = "OK";
            if (test.errors.length !== 0) {
                result = "ERRORS";
            }
            else if (test.assertions.length !== 0) {
                result = "FAILED";
            }

            console.log(`  Test: "${testName}" -> ${result}`);
            for (const assertion of test.assertions) {
                console.log("    " + chalk.yellow(assertion.message));
            }
            for (const error of test.errors) {
                console.log(chalk.red("    Error: " + error.message));
            }
        }
    }
}

export async function getEnvironment() {
    let envId = "local";
    if (process.argv.length === 3)
        envId = process.argv[2];
    let dirName = process.cwd();
    let path = dirName + "/env-" + envId + ".mjs";
    let env = await import(path);
    return env.default;
}

export async function testSuite(suite, env) {
    console.log("");
    const name = o => Object.keys(o)[0];
    const module = o => Object.values(o)[0];
    const n = name(suite);
    const m = module(suite);

    for (let callName in m) {
        let c = m[callName];
        testStarted(n, c);

        try {
            await c(env);
        }
        catch (error) {
            registerTestError(error);
        }
        onTestEnd();
    }
}

export async function test(call, env) {
    testStarted("?", call);
    try {
        await call(env);
    }
    catch (err) {
        registerTestError(err);
    }
    onTestEnd();
}