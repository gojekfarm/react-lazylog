import {Component, Fragment} from 'react';
import {bool, number, func} from 'prop-types';

const MARGIN_TO_BOTTOM_EPSILON = 30;

export default class ScrollFollow extends Component {
  static propTypes = {
    /**
     * Render a component based on the function's arguments
     *
     *   - `follow: bool` This value is `true` or `false`
     *   based on whether the component should be auto-following.
     *   This value can be passed directly to the Lazy component's
     *   `follow` prop.
     *
     *   - `onScroll: func`: This function is used to listen for scrolling
     *   events and turn off auto-following (`follow`).
     *   This value can be passed directly to the Lazy component's
     *   `onScroll` prop.
     *
     *   - `startFollowing: func`: A helper function for manually re-starting
     *   `follow`ing. Is not used by a Lazy component;
     *   rather this can be invoked whenever you need to turn back on
     *   auto-following, but cannot reliably do this from the `startFollowing`
     *   prop. e.g `startFollowing();`
     *
     *   - `stopFollowing: func`: A helper function for manually stopping
     *   `follow`ing. Is not used by a Lazy component;
     *   rather this can be invoked whenever you need to turn off
     *   auto-following, but cannot reliably do this from the `startFollowing`
     *   prop. e.g `stopFollowing();`
     */
    render: func.isRequired,
    /**
     * The initial follow action; defaults to `false`.
     * The value provided here will inform the initial `follow`
     * property passed to the child function.
     */
    startFollowing: bool,
    /**
     * The value that is used to define a margin to bottom in pixels
     * when the component should resume following new records, when
     * `startFollowing` was set to `true`
     * Defaults to `30`
     */
    marginToBottomEpsilon: number,
  };

  static defaultProps = {
    startFollowing: false,
    marginToBottomEpsilon: MARGIN_TO_BOTTOM_EPSILON
  };

  static getDerivedStateFromProps(nextProps) {
    return {
      follow: nextProps.startFollowing,
    };
  }

  state = {
    follow: false,
    scrollHeight: 0
  };

  handleScroll = ({scrollTop, scrollHeight, clientHeight}) => {
    if (this.state.scrollHeight !== scrollHeight) {
      this.setState(state => ({...state, scrollHeight}))
    } else {
      const marginToBottom = scrollHeight - scrollTop - clientHeight;

      if (this.state.follow && marginToBottom > this.props.marginToBottomEpsilon) {
        this.stopFollowing();
      } else if (
        this.props.startFollowing &&
        !this.state.follow &&
        marginToBottom <= this.props.marginToBottomEpsilon
      ) {
        this.startFollowing();
      }
    }
  };

  startFollowing = () => {
    this.setState(state => ({...state, follow: true}));
  };

  stopFollowing = () => {
    this.setState(state => ({...state, follow: false}));
  };

  render() {
    const {render} = this.props;
    const {follow} = this.state;

    return (
      <Fragment>
        {render({
          follow,
          onScroll: this.handleScroll,
          startFollowing: this.startFollowing,
          stopFollowing: this.stopFollowing,
        })}
      </Fragment>
    );
  }
}
