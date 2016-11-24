import createComponent, {
  PropTypes
} from '../../src';

const options = {
  contextTypes: {
    foo: PropTypes.string
  }
};

const Button = ({children, ...otherProps}) => {
  return (
    <button
      type="button"
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default createComponent(options, Button);
