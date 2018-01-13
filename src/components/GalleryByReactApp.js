import React from 'react';

require('../styles/GalleryByReactApp.scss');

// 从图片json文件中读取读取图片数组
let imageDates = require('../data/imageDates.json');

// 获取图片地址 利用自执行函数，将每个图片对象中增加图片url路径信息
imageDates = (function getImageURL(imageDatesArr) {
    for (let value of imageDatesArr) {
        console.log(`value fileName is ${value.fileName}`);
        value.imageURL = require(`../images/${value.fileName}`);
    }

    return imageDatesArr;
})(imageDates);

console.log(imageDates);

    
class GalleryByReactApp extends React.Component {
    getImageURL(imageDatesArr) {
        for (var image of imageDatesArr) {
            console.log(image.fileName);
        }
    }

    render() {
        return (
            <div class = "gallery-page">
                <section className = "stage">
                    <section className = "img-sec">
                        
                    </section>
                    <nav className = "controller-nav">
                    
                    </nav>
                </section>
            </div>
        );
    }
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
