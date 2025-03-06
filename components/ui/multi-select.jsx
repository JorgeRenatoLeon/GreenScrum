import React from 'react';
import Select from 'react-select';

const MultiSelect = ({ options, value, onChange, labelledBy }) => {
  const handleChange = (selectedOptions) => {
    onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const selectedOptions = options.filter(option => value.includes(option.value));

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={labelledBy}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};

export default MultiSelect;