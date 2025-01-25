import type { SelectChangeEvent } from '@mui/material/Select';
import { FormValue } from '../types/form';

export const createFormChangeHandler = <T extends Record<string, any>>(
	field: keyof T,
	setFormData: React.Dispatch<React.SetStateAction<T>>
) => (value: FormValue) => {
	setFormData((prev) => ({
		...prev,
		[field]: Array.isArray(value) ? value : String(value),
	}));
};

export const createSelectChangeHandler = <T extends Record<string, any>>(
	setFormData: React.Dispatch<React.SetStateAction<T>>
) => (event: SelectChangeEvent<string | string[]>) => {
	const { name, value } = event.target;
	setFormData((prev) => ({
		...prev,
		[name]: value,
	}));
};

export const createNumberChangeHandler = <T extends Record<string, any>>(
	field: keyof T,
	setFormData: React.Dispatch<React.SetStateAction<T>>
) => (value: string | number) => {
	setFormData((prev) => ({
		...prev,
		[field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
	}));
};