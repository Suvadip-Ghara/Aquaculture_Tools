import type { SelectChangeEvent } from '@mui/material/Select';

export type FormChangeEvent = 
	| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	| SelectChangeEvent<string | string[]>;

export type FormValue = string | number | string[];

export type FormChangeHandler = (value: FormValue) => void;

export interface BaseFormData {
	[key: string]: FormValue;
}

export interface SelectOption {
	value: string;
	label: string;
}

export type FormFieldType = 'text' | 'number' | 'select' | 'multiselect' | 'date';