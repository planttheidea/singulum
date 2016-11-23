import createComponent, {
  PropTypes
} from '../../src';

const contextTypes = {
  appCounter: PropTypes.number
};

const options = {
  contextTypes
};

const Button = createComponent(options, ({children, ...otherProps}) => {
  return (
    <button
      type="button"
      {...otherProps}
    >
      {children}
    </button>
  );
});

export default Button;
