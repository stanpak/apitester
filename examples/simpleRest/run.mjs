import { printTestResultsSummary, getEnvironment, test, testSuite } from "../../framework/framework.mjs";
import * as simpleTestSuite  from "./testSuite.mjs";

async function main(){
    // This is standard way of getting the correct environment specific parameters. 
    // These parameters are located in the `env-<envId>.mjs` file. 
    // The `envId` parameter is provided with the command line call. 
    const env = await getEnvironment();

    // Run all tests defined in that test suite.
    await testSuite(simpleTestSuite, env);
    
    // Run particular singular test
    // await test(simpleTestSuite.suite.getCall, env);
    // await test(simpleTestSuite.suite.postCall, env);
    // await test(simpleTestSuite.suite.deleteCall, env);

    printTestResultsSummary();
}

main();

