import React, {FC, useState, useEffect} from 'react';
import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import {execa} from 'execa';
import fs from 'fs';
import path from 'path';

const App: FC = () => {
	const [dependencies, setDependencies] = useState<Record<string, string>>({});
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [aiResponse, setAiResponse] = useState<string>('');
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

	const fetchAnalysis = async (pkgName: string) => {
		setIsLoading(true);
		try {
			const {stdout} = await execa('npm', ['view', pkgName, 'description']);
			setAiResponse(stdout);
		} catch (e: any) {
			setAiResponse(
				`Error: Failed to fetch data for ${pkgName}. \n${e.message}`,
			);
		} finally {
			setIsLoading(false);
		}
	};

	const items = Object.entries(dependencies).map(([pkg, version]) => ({
		label: `${pkg} (${version})`,
		value: pkg,
	}));

	const handleSelect = (item: {label: string; value: string}) => {
		setSelectedPackage(item.value);
		fetchAnalysis(item.value);
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

			{isLoading && (
				<Box>
					<Text color="yellow">
						<Spinner type="dots" /> Analyzing package{' '}
						<Text bold>{selectedPackage}</Text>
					</Text>
				</Box>
			)}

			{!isLoading && selectedPackage && aiResponse && (
				<Box
					flexDirection="column"
					borderColor="yellow"
					borderStyle="single"
					padding={1}
				>
					<Text bold underline>
						Report for: {selectedPackage}
					</Text>
					<Box marginY={1}>
						<Text>{aiResponse}</Text>
					</Box>
					<Text color="gray" italic>
						{' '}
						(Restart app to return - Ctrl+C)
					</Text>
				</Box>
			)}

			{!isLoading && !selectedPackage && (
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
