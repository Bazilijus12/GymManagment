import React from 'react';

const Form = () => (
  <form className="form">
    <label>
      Name:
      <input type="text" />
    </label>
    <label>
      Email:
      <input type="email" />
    </label>
    <label>
      Password:
      <input type="password" />
    </label>
    <label>
      Select:
      <select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    </label>
    <button type="submit">Submit</button>
  </form>
);

export default Form;
