import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Image, Alert, TouchableOpacity, ViewPropTypes } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import { Toast } from '@ant-design/react-native';
import styles from './styles';
import dp2px from '../../../../utils/util';

const STATUS_LOADING = 0;
const STATUS_LOAD_SUCCESS = 1;
const STATUS_LOAD_FAIL = 2;

/**
 * 图片选择器,单选、多选
 */
class MulPicSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
        status: STATUS_LOADING,
        uri: item.path,
        width: item.width,
        height: item.height,
        mime: item.mime,
       */
      images: [],
    };
  }

  onDeleteBtnPress = (item, index) => {
    const { images } = this.state;
    images.splice(index, 1);
    this.setState(images);
  };

  onPreviewAndCropPress = (item, index) => {
    ImagePicker.openCropper({
      path: item.uri,
      width: 720,
      height: 400,
    })
      .then(image => {
        console.log('received cropped image', image);
        const { images } = this.state;
        images[index].cropRect = image.cropRect;
        this.setState({ images });
      })
      .catch(e => {
        console.log(e);
        // Alert.alert(e.message ? e.message : e);
      });
  };

  onAddButtonClick = () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 800,
      compressImageQuality: 0.8,
      compressVideoPreset: 'MediumQuality',
    }).then(imgs => {
      const { images } = this.state;
      if (images.length === this.props.maxImagesCount) {
        Toast.offline('图片已达到最大数量');
        return;
      }
      if (imgs ? imgs.length + images.length >= this.props.maxImagesCount : false) {
        Toast.offline('图片已达到最大数量');
      }
      const putCount = this.props.maxImagesCount - images.length;
      imgs.forEach((item, index) => {
        console.log('received image', item);
        console.log(`index: ${index} putCount: ${putCount}`);
        if (index < putCount) {
          images.unshift({
            status: STATUS_LOADING,
            uri: item.path,
            width: item.width,
            height: item.height,
            mime: item.mime,
          });

          this.uploadImage(item.path);
        }
      });
      this.setState(images);
    });
    // .catch(e => Alert.alert(e));
  };

  static getDerivedStateFromProps(props, state) {
    const { global } = props;

    // 图片上传成功
    if (global.file.uri && global.file.fileUrl && global.file.fileVisitUrl) {
      const { images } = state;
      images.forEach((item, index) => {
        if (global.file.uri === item.uri) {
          images[index].status = STATUS_LOAD_SUCCESS;
        }
      });
      return { images };
    }
    // 图片上传失败
    if (global.file.uri && !global.file.fileUrl && !global.file.fileVisitUrl) {
      const { images } = state;
      images.forEach((item, index) => {
        if (global.file.uri === item.uri) {
          images[index].status = STATUS_LOAD_FAIL;
        }
      });
      return { images };
    }

    return null;
  }

  // 上传图片
  uploadImage = uri => {
    this.props.dispatch({
      type: 'global/uploadSystemCommonFiles',
      payload: {
        fileType: 'room_image',
        uri,
      },
    });
  };

  renderPics = () => {
    return this.state.images.map((item, index) => {
      const key = index;
      return (
        <View style={[styles.imageView, { marginLeft: index > 0 ? dp2px(10) : 0 }]} key={key}>
          <TouchableOpacity onPress={() => this.onPreviewAndCropPress(item, index)}>
            <Image style={{ width: dp2px(66), height: dp2px(66) }} source={item} />
          </TouchableOpacity>

          {item.status === STATUS_LOAD_SUCCESS || item.status === STATUS_LOAD_FAIL ? (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => this.onDeleteBtnPress(item, index)}
            >
              <Image
                style={{ width: dp2px(20), height: dp2px(20) }}
                source={require('../../../../assets/images/mine_badge.png')}
              />
            </TouchableOpacity>
          ) : null}
          {item.status === STATUS_LOADING ? (
            <Image
              style={styles.progress}
              source={require('../../../../assets/images/mine_badge.png')}
            />
          ) : null}
        </View>
      );
    });
  };

  render() {
    return (
      <View style={[{ flexDirection: 'row' }, this.props.containerStyle]}>
        <Button
          buttonStyle={styles.addBtn}
          onPress={() => this.onAddButtonClick()}
          icon={<Icon name="plus" size={20} color="rgba(170,170,170,1)" />}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginLeft: dp2px(10) }}
        >
          {this.renderPics()}
        </ScrollView>
      </View>
    );
  }
}

MulPicSelect.propTypes = {
  containerStyle: ViewPropTypes.style,
  maxImagesCount: PropTypes.number,
  onImageChange: PropTypes.func,
};

MulPicSelect.defaultProps = {
  containerStyle: {},
  maxImagesCount: 10,
  onImageChange: () => {},
};

export default connect(({ global }) => ({ global }))(MulPicSelect);
