import { StyleSheet } from 'react-native';
import dp2px from '../../../../utils/util';

const styles = StyleSheet.create({
  addBtn: {
    width: dp2px(66),
    height: dp2px(66),
    backgroundColor: 'white',
    borderColor: 'rgba(231,231,231,1)',
    borderWidth: dp2px(1),
  },
  titleStyle: {
    color: 'white',
  },
  deleteBtn: {
    width: dp2px(20),
    height: dp2px(20),
    position: 'absolute',
    right: 0,
  },
  progress: {
    width: dp2px(30),
    height: dp2px(30),
    position: 'absolute',
    left: dp2px(18),
    top: dp2px(18),
    transform: [{ rotate: '-360deg' }],
  },
  imageView: {
    width: dp2px(66),
    height: dp2px(66),
  },
});

export default styles;
