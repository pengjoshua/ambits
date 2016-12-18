// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/**
 * @fileoverview An example test that may be run using Mocha.
 *
 * Usage:
 *
 *     mocha -t 10000 selenium-webdriver/example/google_search_test.js
 *
 * You can change which browser is started with the SELENIUM_BROWSER environment
 * variable:
 *
 *     SELENIUM_BROWSER=chrome \
 *         mocha -t 10000 selenium-webdriver/example/google_search_test.js
 */

const {Builder, By, until} = require('selenium-webdriver');
const test = require('../testing');

var user = {
  username: 'craig',
  email: 'craig@hackreactor.com',
  password: 'craig'
}

test.describe('Google Search', function() {
  let driver;

  test.before(function *() {
    driver = yield new Builder().forBrowser('firefox').build();
  });

  // it('can reach homepage and sign up as new user', function() {
  //   return driver.get('http://localhost:3000')
  //     .then(_ => driver.wait(until.titleIs('Ambitually'), 1000))
  //     .then(_ => driver.findElement(By.className('signup')).click())
  //     .then(_ => driver.findElement(By.className('signUpEmail')).click())
  //     .then(_ => driver.findElement(By.className('signUpEmail')).sendKeys(user.email))
  //     .then(_ => driver.findElement(By.className('signUpUsername')).click())
  //     .then(_ => driver.findElement(By.className('signUpUsername')).sendKeys(user.username))
  //     .then(_ => driver.findElement(By.className('signUpPassword')).click())
  //     .then(_ => driver.findElement(By.className('signUpPassword')).sendKeys(user.password))
  //     .then(_ => driver.findElement(By.className('signup')).click())
  //     // .then(_ => driver.wait(until.titleIs('Ambitually'), 1000));
  //     .then(_ => driver.findElement(By.className('createAmbit')).click())
  //     .then(_ => driver.findElement(By.id('map')));
  // });

  test.it('can reach homepage and sign up as new user', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Ambitually'), 1000);
    yield driver.findElement(By.className('signup')).click();
    yield driver.findElement(By.className('signUpEmail')).click();
    yield driver.findElement(By.className('signUpEmail')).sendKeys(user.email);
    yield driver.findElement(By.className('signUpUsername')).click();
    yield driver.findElement(By.className('signUpUsername')).sendKeys(user.username);
    yield driver.findElement(By.className('signUpPassword')).click();
    yield driver.findElement(By.className('signUpPassword')).sendKeys(user.password);
    yield driver.findElement(By.className('signup')).click();
    // yield driver.wait(until.titleIs('Ambitually'), 1000);
    // yield console.log('Hi 1');
    //
    // yield source = driver.getPageSource();
    // yield console.log(source.value_);
    // if(driver.getPageSource().contains("Create Ambit")) {
    // yield driver.findElement(By.className('createAmbit')).click();
    // yield driver.wait(until.titleIs('Location'), 3000);
    // }
    // // yield driver.findElement(By.className('createAmbit')).click();
    //
    // // yield driver.findElement(By.id('map'));
    // yield console.log('Hi 3');
    //   yield driver.wait(until.urlIs('http://localhost:3000/map'), 7000);
    //   yield console.log('Hi 3.5');
    //
    // yield driver.findElement(By.className('hamburgerMenu')).click();
    // yield console.log('Hi 4');
    // yield driver.findElement(By.className('signOut')).click();
    // yield console.log('Hi 5');
    // yield driver.findElement(By.className('signUpEmail'));
    // yield console.log('Hi 6');
  });

  // test.it('will sign out', function*() {
  //   yield driver.findElement(By.className('hamburgerMenu')).click();
  //   yield driver.findElement(By.className('signOut')).click();
  //   yield driver.findElement(By.className('signUpEmail'));
  // });
  //
  test.it('can log in as existing user', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Ambitually'), 1000);
    yield driver.findElement(By.className('signUpEmail')).click();
    yield driver.findElement(By.className('signUpEmail')).sendKeys(user.email);
    yield driver.findElement(By.className('signUpPassword')).click();
    yield driver.findElement(By.className('signUpPassword')).sendKeys(user.password);
    yield driver.findElement(By.className('login')).click();
    // yield driver.wait(until.titleIs('Ambitually'), 1000);
    yield driver.findElement(By.className('createAmbit')).click();
    yield driver.wait(until.titleIs('Location'), 3000);
    yield driver.findElement(By.id('map'));
  });


  test.it('can log in as existing user', function*() {
    yield driver.get('http://localhost:3000');
    yield driver.wait(until.titleIs('Ambitually'), 1000);
    yield driver.findElement(By.className('signup')).click();
    yield driver.findElement(By.className('signUpEmail')).click();
    yield driver.findElement(By.className('signUpEmail')).sendKeys(user.email);
    yield driver.findElement(By.className('signUpUsername')).click();
    yield driver.findElement(By.className('signUpUsername')).sendKeys(user.username);
    yield driver.findElement(By.className('signUpPassword')).click();
    yield driver.findElement(By.className('signUpPassword')).sendKeys(user.password);
    yield driver.findElement(By.className('signup')).click();
    // yield driver.wait(until.titleIs('Ambitually'), 1000);
    yield driver.findElement(By.className('createAmbit')).click();
    yield driver.findElement(By.className('bottomNav'));
    yield driver.findElement(By.className)
  });

















  // You can write tests either using traditional promises.
  // it('works with promises', function() {
  //   return driver.get('http://www.google.com')
  //       .then(_ => driver.findElement(By.name('q')).sendKeys('webdriver'))
  //       .then(_ => driver.findElement(By.name('btnG')).click())
  //       .then(_ => driver.wait(until.titleIs('webdriver - Google Search'), 1000));
  // });

  // Or you can define the test as a generator function. The test will wait for
  // any yielded promises to resolve before invoking the next step in the
  // generator.
  // test.it('works with generators', function*() {
  //   yield driver.get('http://www.google.com/ncr');
  //   yield driver.findElement(By.name('q')).sendKeys('webdriver');
  //   yield driver.findElement(By.name('btnG')).click();
  //   yield driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  // });

  test.after(() => driver.quit());
});
