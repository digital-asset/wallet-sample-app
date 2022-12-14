// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import DamlHub from '@daml/hub-react';
import React from 'react';
import ReactDOM from 'react-dom';
// import 'semantic-ui-css/semantic.min.css';
// import './index.css';
// import App from './components/App';
import {App } from './App'

ReactDOM.render(<DamlHub><App /></DamlHub>, document.getElementById('root'));
