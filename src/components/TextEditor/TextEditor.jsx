import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function TextEditor({ height, defaultValue, onChange }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (value) => {
    setValue(value);
    onChange(value);
  }

  return (
    <ReactQuill theme="snow" value={value} onChange={handleChange} style={{ height }} />
  )
}
