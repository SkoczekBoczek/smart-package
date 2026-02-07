#!/usr/bin/env node

import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

meow(
	`
	Użycie
	  $ smart-package

	Opis
	  Analizuje package.json i pomaga zarządzać paczkami przy użyciu AI.
`,
	{
		importMeta: import.meta,
	},
);

render(<App />);
