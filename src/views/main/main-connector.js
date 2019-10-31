import {connect} from 'react-redux';
import MainContainer from './main-container';
import {getTime, sendText, startTime} from '../../components/time/time-action-creators';

export const mapStateToProps = state => ({ time: state.time });
export const mapDispatchToProps = { getTime, startTime, sendText };

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
