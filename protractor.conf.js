//to run protractor tests, install nodeJS (http://nodejs.org/download/) and run the below commands in your terminal:
//If it doesn't already exist, you must create a folder named "screenshots" under test/protractor/. This is used to store screenshots of failures.
//From the terminal in your root directory
//1) $ npm install
//2) go to your project's root
//3a) $ protractor protractor.conf.js --suite smoketest (this will run a high level smoke test)
//3b) $ protractor protractor.conf.js --suite done (this will run all protractor tests that are done being developed)
//NOTE: Local play server (on port 9000) and local MySQL DB must be running in order to execute tests.
//      You also must have a local DB single owner operator company with "qa.testing@qonceptual.com" as the owner for some tests to work. If you don't, then there is a Protractor script you can run to create this.

var path = require('path');

exports.config = {
  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  suites: {
    done: 'test/protractor/done/*spec.js',
    inDev: 'test/protractor/inDev/*spec.js',
    smoketest: 'test/protractor/done/landingPage.spec.js'
  },

  framework: 'jasmine2',
  //framework: 'cucumber',

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    // If true, print colors to the terminal.
    showColors: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 99999
    // Function called to print jasmine results.
    //, print: function() {}
    // If set, only execute specs whose names match the pattern, which is
    // internally compiled to a RegExp.
    //grep: 'pattern',
    // Inverts 'grep' matches
    //invertGrep: false
  },

  allScriptsTimeout: 99999,

  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome'
    //, shardTestFiles: true
    //, maxInstances: '3'
  },

  //multiCapabilities: [{
  //    browserName: 'firefox',
  //    shardTestFiles: true,
  //    maxInstances: '2'
  //}, {
  //    browserName: 'chrome',
  //    shardTestFiles: true,
  //    maxInstances: '2'
  //}],

  directConnect: true,

  params: {
    login: {
      personal: 'qa.personal@qonceptual.com',
      group: 'qa.group@qonceptual.com',
      global: 'qa.global@qonceptual.com',
      password: 'soccer'
    },
    cc: {
      visa1: '4242424242424242',
      visa2: '4012888888881881',
      visaDebit: '4000056655665556',
      mc: '5555555555554444',
      mcDebit: '5200828282828210',
      mcPrePaid: '5105105105105100',
      amEx1: '378282246310005',
      amEx2: '371449635398431',
      discover1: '6011111111111117',
      discover2: '6011000990139424',
      dinersClub1: '30569309025904',
      dinersClub2: '38520000023237',
      jcb1: '3530111333300000',
      jcb2: '3566002020360505'
    },
    ccError: {
      declined: '4000000000000002',
      declinedFraud: '4100000000000019',
      incorrectCVC: '4000000000000127',
      expCard: '4000000000000069',
      processingError: '4000000000000119'
    }
  },

  //sets the test window size
  onPrepare: function() {
    browser.get('http://localhost:3000');
    //browser.get('http://riskband-angular-dev.herokuapp.com');

    pageObjects = require('./test/protractor/objects.js');

    browser.driver.manage().window().setSize(1366,768);

    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));

    //helpers
    oauth = require('./test/protractor/helper/oauth.js');
    signup = require('./test/protractor/helper/signup.js');
    device = require('./test/protractor/helper/device.js');
    profile = require('./test/protractor/helper/profile.js');
    billing = require('./test/protractor/helper/billing.js');
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['test/protractor/*.spec.js'],

  plugins: [{
    path: path.join(__dirname, 'node_modules/protractor/plugins/accessibility'),
    chromeA11YDevTools: {treatWarningsAsFailures: false}
    },

    {
        path: path.join(__dirname, 'node_modules/protractor/plugins/ngHint'),
        asTests: false
    //    excludeURLs: {(String|RegExp)[]}
    },

    {
      path: path.join(__dirname, 'node_modules/protractor/plugins/timeline/index.js'),
      // Output json and html will go in this folder.
      outdir: 'timelines'
      // Optional - if sauceUser and sauceKey are specified, logs from
      // SauceLabs will also be parsed after test invocation.
      //sauceUser: 'Jane',
      //sauceKey: 'abcdefg'
    },

    {
      path: path.join(__dirname, 'node_modules/protractor/plugins/console'),
      //failOnWarning: //{Boolean}                (Default - false),
      failOnError: false //{Boolean}                  (Default - true)
      //exclude: {Array of strings and regex}   (Default - [])
    }

  //  {
  //    path: path.join(__dirname, 'node_modules/protractor-e2e-coverage/index.js'),
  //    outdir: 'test/coverage'
  //  }
  ]
};
