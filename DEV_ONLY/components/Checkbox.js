import createComponent from '../../src';

const Checkbox = ({isChecked, label, ...otherProps}) => {
  return (
    <label>
      <input
        checked={isChecked}
        type="checkbox"
        {...otherProps}
      />

      <span>
        {label}
      </span>
    </label>
  );
};

export default createComponent(Checkbox);
