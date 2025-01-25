import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

export interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  value: string | number | string[];
  onChange: (value: string | number | string[]) => void;
  type?: 'text' | 'number' | 'select' | 'multiselect' | 'date';
  required?: boolean;
  helperText?: string;
  options?: Option[];
  multiple?: boolean;
  error?: boolean;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  helperText,
  options = [],
  multiple = false,
  error = false,
  disabled = false,
}) => {
  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = type === 'number' ? Number(event.target.value) : event.target.value;
    onChange(newValue);
  };

  const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
    onChange(event.target.value);
  };

  if (type === 'select' || type === 'multiselect') {
    return (
      <FormControl fullWidth required={required} error={error} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value as string | string[]}
          label={label}
          onChange={handleSelectChange}
          multiple={type === 'multiselect' || multiple}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={handleTextChange}
      type={type === 'date' ? 'date' : type}
      required={required}
      helperText={helperText}
      error={error}
      disabled={disabled}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
    />
  );
};

export default FormField;