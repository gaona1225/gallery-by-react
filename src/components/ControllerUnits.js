// 控制组件
import React from 'react';

require('../styles/GalleryByReactApp.scss');

    
class ControllerUnits extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this); 
    }

    handleClick(e) {
        console.log('handleClick');
        // 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
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
        let controllerUnitsClassName = `controller-unit${this.props.arrange.isCenter ? ' is-center' : ''}${this.props.arrange.isInverse ? ' is-inverse' : ''}`;
        return (
            <span className = {controllerUnitsClassName} onClick = {this.handleClick}></span>
        );
    }
}

ControllerUnits.defaultProps = {
};

export default ControllerUnits;
