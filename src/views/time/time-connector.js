import {connect} from 'react-redux';
import TimeContainer from './time-container';
import {getTime, startTime} from '../../components/time/time-action-creators';

export const mapStateToProps = state => ({ time: state.time });
export const mapDispatchToProps = { getTime, startTime };

export default connect(mapStateToProps, mapDispatchToProps)(TimeContainer);
