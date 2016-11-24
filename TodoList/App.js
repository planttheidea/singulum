import createComponent, {
  PropTypes
} from '../src/index';

import jile from 'react-jile';

const styles = {
  '*, *:before, *:after': {
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    position: 'relative'
  },
  'html, body': {
    margin: 0,
    padding: 0
  },
  'body': {
    fontFamily: 'Lato, Helvetica Neue, Helvetica, Arial, sans-serif',
    color: '#5d5d5d'
  },
  '.container': {
    backgroundColor: '#f5f5f5',
    height: '100vh',
    overflow: 'auto',
    width: '100vw',

    '&:before, &:after': {
      content: '""',
      display: 'table'
    },
    '&:after': {
      clear: 'both'
    }
  }
};

const App = ({children, selectors}) => {
  return (
    <div className={selectors.container}>
      {children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node,
  selectors: PropTypes.object
};

export default jile(styles)(createComponent(App));
