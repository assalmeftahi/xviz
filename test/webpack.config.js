// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Webpack 2 configuration file for running tests in browser
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {resolve} = require('path');

const TEST_DIR = './test';

const TEST_BROWSER_CONFIG = {
  mode: 'development',

  devServer: {
    stats: {
      warnings: false
    },
    progress: true
  },

  // Bundle the tests for running in the browser
  entry: {
    'test-browser': resolve(TEST_DIR, 'browser.js')
  },

  devtool: '#inline-source-maps',

  resolve: {
    alias: {
      webworkify$: resolve(__dirname, '../node_modules/webworkify-webpack'),
      'test-data': resolve(TEST_DIR, 'data'),
      '@xviz/builder': resolve(TEST_DIR, '../modules/builder/src'),
      '@xviz/conformance': resolve(TEST_DIR, '../modules/conformance'),
      '@xviz/parser': resolve(TEST_DIR, '../modules/parser/src'),
      '@xviz/schema': resolve(TEST_DIR, '../modules/schema/src')
    }
  },

  module: {
    rules: [
      {
        // Compile ES2015 using buble
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ]
  },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },

  plugins: [new HtmlWebpackPlugin()]
};

module.exports = TEST_BROWSER_CONFIG;
