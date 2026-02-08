import React, {FC, useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import {execa} from 'execa';
import fs from 'fs';
import path from 'path';
import clipboard from 'clipboardy';

const App: FC = () => {
	const [dependencies, setDependencies] = useState<Record<string, string>>({});
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [pkgData, setPkgData] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [copySuccess, setCopySuccess] = useState(false);

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

	useInput(input => {
		if (selectedPackage && input === 'c') {
			const prompt = `I am working on a JS project using ${selectedPackage} version ${
				dependencies[selectedPackage!]
			}. The latest version is ${
				pkgData?.version
			}. What are the breaking changes and potential risks of upgrading? Please list them step-by-step.`;

			clipboard.writeSync(prompt);
			setCopySuccess(true);
		}
		if (selectedPackage && input === 'b') {
			setSelectedPackage(null);
			setPkgData(null);
			setCopySuccess(false);
		}
	});

	const fetchAnalysis = async (pkgName: string) => {
		setIsLoading(true);
		setCopySuccess(false);
		try {
			const {stdout} = await execa('npm', ['view', pkgName, '--json']);
			const data = JSON.parse(stdout);
			setPkgData(data);
		} catch (e: any) {
			setError(`Failed to fetch data for ${pkgName}. \n${e.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelect = (item: {label: string; value: string}) => {
		setSelectedPackage(item.value);
		fetchAnalysis(item.value);
	};

	const items = Object.entries(dependencies).map(([pkg, version]) => ({
		label: `${pkg} (${version})`,
		value: pkg,
	}));

	const isOutdated = (current: string, latest: string) => {
		const cleanCurrent = current.replace(/[\^~]/, '');
		return cleanCurrent !== latest;
	};

	return (
		<Box
			flexDirection="column"
			padding={1}
			borderStyle="round"
			borderColor="cyan"
		>
			<Box marginBottom={1} justifyContent="space-between">
				<Text bold color="green" underline>
					Smart Package Pilot
				</Text>
				<Text color="gray"> {Object.keys(dependencies).length} packages</Text>
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

			{!isLoading && selectedPackage && pkgData && (
				<Box
					flexDirection="column"
					borderColor="yellow"
					borderStyle="single"
					padding={1}
				>
					<Box marginBottom={1}>
						<Text bold inverse>
							{' '}
							{pkgData.name}{' '}
						</Text>
						<Text> {pkgData.description}</Text>
					</Box>

					<Box flexDirection="column" marginBottom={1}>
						<Box marginLeft={2}>
							<Text>
								Current:{' '}
								<Text color="yellow">{dependencies[selectedPackage]}</Text>
							</Text>
							<Text>
								{' '}
								Latest: <Text color="green">{pkgData.version}</Text>
							</Text>

							{isOutdated(dependencies[selectedPackage]!, pkgData.version) ? (
								<Text color="red" bold>
									{' '}
									OUTDATED
								</Text>
							) : (
								<Text color="green"> UP TO DATE</Text>
							)}
						</Box>
					</Box>

					<Box
						borderStyle="single"
						borderColor="gray"
						flexDirection="column"
						padding={1}
					>
						<Text bold color="cyan">
							AI Consultation:
						</Text>
						<Text>
							Press{' '}
							<Text bold color="white" backgroundColor="blue">
								{' '}
								C{' '}
							</Text>{' '}
							to copy Copilot prompt
						</Text>
						<Text dimColor>Includes breaking changes & migration strategy</Text>

						{copySuccess && (
							<Text color="green" bold>
								Prompt copied to clipboard! Paste into Copilot
							</Text>
						)}
					</Box>

					<Box marginTop={1}>
						<Text dimColor>Press 'B' to return to list</Text>
					</Box>
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
