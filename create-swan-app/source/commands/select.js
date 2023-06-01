import React from 'react';
import {render} from 'ink';
import SelectInput from 'ink-select-input';

export default function SelectDemo() {
	const handleSelect = item => {
		// `item` = { label: 'First', value: 'first' }
		console.log(JSON.stringify(item));
	};

	const items = [
		{
			label: 'First',
			value: 'first'
		},
		{
			label: 'Second',
			value: 'second'
		},
		{
			label: 'Third',
			value: 'third'
		}
	];

	return <SelectInput items={items} onSelect={handleSelect} />;
};

render(<SelectDemo />);
