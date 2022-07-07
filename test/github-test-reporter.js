export default class GithubActionsReporter {

    constructor(/*configuration, options*/) {
        //this.configuration = configuration;
        //this.options = options;
    }

    onRunComplete(context, results) {
        if(!process.env.GITHUB_ACTIONS) {
            return;
        }
        for(const suite of results.testResults) {
            for(const test of suite.testResults) {
                if (test.status === 'passed') {
                    continue;
                }
                for(let message of test.failureMessages) {
                    message = message.replace(/\n/g, '%0A');
                    const match = message.match(/:([0-9]+):([0-9]+)/);
                    if (match) {
                        console.log(`::error file=${suite.testFilePath},line=${match[1]},col=${match[2]}::${message}`);
                    } else {
                        console.log('Unable to extract line number from call stack');
                    }
                }
            }
        }
    }
}