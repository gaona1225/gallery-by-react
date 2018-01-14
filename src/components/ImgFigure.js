import React from 'react';

require('../styles/GalleryByReactApp.scss');

    
class ImgFigure extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this); 
    }

    /*
     * imgFigure 的点击处理函数
     */
    handleClick(e) {
        console.log('handleClick');
        
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }
    render() {
        let imageData = this.props.data;
        let styleObj = {};

        // 如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的旋转角度有值并且不为0， 添加旋转角度
        if (this.props.arrange.rotate) {
            let self = this;
            ['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach( value => {
                styleObj[value] = `rotate(${self.props.arrange.rotate}deg`;
            });
        }

        // 如果是居中的图片， z-index设为11 isInverse
        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        let imgFigureClassName = `img-figure${this.props.arrange.isInverse ? ' is-inverse' : ''}`;

        return (
            <figure className = "img-figure" style = {styleObj} className = {imgFigureClassName} onClick = {this.handleClick}>
                <img src = {imageData.imageURL} alt = {imageData.title} />
                <figcaption>
                    <h2 className = "img-title">{imageData.title}</h2>
                    <div className = "img-back" onClick = {this.handleClick}>
                        <p>{imageData.desc}</p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

ImgFigure.defaultProps = {
};

export default ImgFigure;
