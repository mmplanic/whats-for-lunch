import React from "react";
import ImageUploading from "react-images-uploading";


export default function ImageUploader() {
  const onChange = imageList => {
    // data for submit
    console.log(imageList);
  };
  return (
    <div className="App">
      <ImageUploading multiple={false} onChange={onChange} maxNumber={1}>
        {({ imageList, onImageUpload, onImageRemoveAll }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button onClick={onImageUpload}>Upload images</button>&nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map(image => (
              <div key={image.key} className="image-item">
                <img src={image.dataURL} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button
                    onClick={() => {
                      image.onUpdate();
                    }}
                  >
                    Update
                  </button>
                  <button onClick={image.onRemove}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}