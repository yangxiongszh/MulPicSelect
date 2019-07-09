

  onImageChange = images => {
    this.images = images;
  };


  // 添加照片
  renderAddFurnitureImage = () => {

    return (
      <View>
        <MulPicSelect
          containerStyle={{ marginLeft: dp2px(16), marginBottom: dp2px(15) }}
          onImageChange={images => {
            this.onImageChange(images);
          }}
        />
      </View>
    );
  };