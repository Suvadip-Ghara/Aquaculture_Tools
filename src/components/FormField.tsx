import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  type?: string;
  name?: string;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  options?: Option[];
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  name,
  required = false,
  helperText,
  fullWidth = true,
  margin = 'normal',
  options,
  ...props
}) => {
  if (type === 'select' && options) {
    return (
      <FormControl fullWidth={fullWidth} margin={margin} required={required}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value.toString()}
          label={label}
          name={name}
          onChange={onChange}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      name={name}
      required={required}
      helperText={helperText}
      fullWidth={fullWidth}
      margin={margin}
      {...props}
    />
  );
};

export type { FormFieldProps, Option };
export default FormField;