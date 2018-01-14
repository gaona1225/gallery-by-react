import React from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from '../components/ImgFigure'

require('../styles/GalleryByReactApp.scss');

// 从图片json文件中读取读取图片数组
let imageDates = require('../data/imageDates.json');

// 获取图片地址 利用自执行函数，将每个图片对象中增加图片url路径信息
imageDates = (function getImageURL(imageDatesArr) {
    for (let value of imageDatesArr) {
        // console.log(`value fileName is ${value.fileName}`);
        value.imageURL = require(`../images/${value.fileName}`);
    }

    return imageDatesArr;
})(imageDates);

/*
 * 获取区间内的一个随机值
 */
let getRangeRandom = (low, high) => {
    return Math.ceil(Math.random() * (high - low) + low);
}

let GalleryByReactApp = React.createClass({
    Constant: {
        centerPos: {
            left: 0,
            right: 0
        },
        hPosRange: {   // 水平方向的取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: {    // 垂直方向的取值范围
            x: [0, 0],
            topY: [0, 0]
        }
    },

    /*
    * 重新布局所有图片
    * @param centerIndex 指定居中排布哪个图片
    */
    rearrange: function (centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr;
        let centerPos = this.Constant.centerPos;
        let hPosRange = this.Constant.hPosRange;
        let vPosRange = this.Constant.vPosRange;
        let hPosRangeLeftSecX = hPosRange.leftSecX;
        let hPosRangeRightSecX = hPosRange.rightSecX;
        let hPosRangeY = hPosRange.y;
        let vPosRangeTopY = vPosRange.topY;
        let vPosRangeX = vPosRange.x;
        let imgsArrangeTopArr = [];
        let topImgNum = Math.ceil(Math.random() * 2); // 取一个或是不取
        let topImgSpliceIndex = 0;

        let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;

        // 取出要布局上侧图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length - topImgNum);

        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach( (value, index) => {
            imgsArrangeTopArr[index].pos = {
                top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            }
        });

        // 布局左右两侧的图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;

            // 前半部分布局左边，右半部分布局右边

            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i].pos = {
                top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            }
            console.log(`imgsArrangeArr${imgsArrangeArr[i].pos}`)
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        })
    },

    getInitialState: function () {
        return {
            imgsArrangeArr: [
                /*{
                    pos: {
                        left: '0',
                        top: '0'
                    }
                }*/
            ]
        };
    },

    // 组件加载以后， 为每张图片计算其位置的范围
    componentDidMount: function () {
        // 拿到舞台大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
        let stageW = stageDOM.scrollWidth;
        let stageH = stageDOM.scrollHeight;
        let halfStageW = Math.ceil(stageW / 2);
        let halfStageH = Math.ceil(stageH / 2);

        // 拿到一个imgFigure的大小
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
        let imgW = imgFigureDOM.scrollWidth;
        let imgH = imgFigureDOM.scrollHeight;
        let halfImgW = Math.ceil(imgW / 2);
        let halfImgH = Math.ceil(imgH / 2);

        // 计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        // 计算左右侧区域位置点
        this.Constant.hPosRange.leftSecX[0] = - halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = - halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        // 计算上下侧区域位置点
        this.Constant.vPosRange.topY[0] = - halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    },

    render: function() {
        let controllerUnits = [];
        let imgFigures = [];
        let self = this;
        imageDates.forEach((value, index) => {
            console.log(self.state.imgsArrangeArr[index]);
            if (!self.state.imgsArrangeArr[index]) {
                self.state.imgsArrangeArr[index] = {
                    pos: {
                        let: 0,
                        top: 0
                    }
                }
            };
            imgFigures.push(<ImgFigure key = {index} data = {value} ref={`imgFigure${index}`} arrange = {self.state.imgsArrangeArr[index]} />);
        });

        return (
            <div className = "gallery-page">
                <section className = "stage" ref = "stage">
                    <section className = "img-sec">
                        {imgFigures}
                    </section>
                    <nav className = "controller-nav">
                        {controllerUnits}
                    </nav>
                </section>
            </div>
        );
    }
});

module.exports = GalleryByReactApp;
