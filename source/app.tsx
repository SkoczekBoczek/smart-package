import React, {FC, useState, useEffect} from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import fs from 'fs';
import path from 'path';

const App: FC = () => {
	const [dependencies, setDependencies] = useState<Record<string, string>>({});
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const currentDir = process.cwd();
		const packageJsonPath = path.resolve(currentDir, 'package.json');

		if (!fs.existsSync(packageJsonPath)) {
			setError('package.json file not found in this directory');
			return;
		}

		try {
			const fileContent = fs.readFileSync(packageJsonPath, 'utf-8');
			const json = JSON.parse(fileContent);

			setDependencies(json.dependencies || {});
		} catch (e) {
			setError('Error while reading the package.json file');
		}
	}, []);

	const items = Object.entries(dependencies).map(([pkg, version]) => ({
		label: `${pkg} (${version})`,
		value: pkg,
	}));

	const handleSelect = (item: {label: string; value: string}) => {
		setSelectedPackage(item.value);
	};

	return (
		<Box
			flexDirection="column"
			padding={1}
			borderStyle="round"
			borderColor="cyan"
		>
			<Text bold color="green" underline>
				Smart Package Pilot
			</Text>
			<Box marginY={1}>
				<Text>Analyzing project: {process.cwd()}</Text>
			</Box>

			{error && <Text color="red">{error}</Text>}

			{selectedPackage ? (
				<Box
					flexDirection="column"
					borderColor="yellow"
					borderStyle="single"
					padding={1}
				>
					<Text>
						Selected package:{' '}
						<Text bold color="magenta">
							{selectedPackage}
						</Text>
					</Text>
					<Text color="gray">...</Text>
				</Box>
			) : (
				<Box flexDirection="column">
					<Text>Select a package to analyze (Arrows + Enter):</Text>
					<Box marginY={1}>
						{items.length > 0 ? (
							<SelectInput items={items} onSelect={handleSelect}></SelectInput>
						) : (
							<Text color="gray">No dependencies to display</Text>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default App;
