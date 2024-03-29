import React from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from '../components/ImgFigure';
import ControllerUnits from '../components/ControllerUnits';

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

// console.log(imageDates);

    
class GalleryByReactApp extends React.Component {
    constructor(props) {
        super(props);
        this.centerPos = {
            left: 0,
            right: 0
        };
        this.hPosRange = { // 水平方向的取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        };
        this.vPosRange = { // 垂直方向的取值范围
            x: [0, 0],
            topY: [0, 0]
        };

        this.state = {
            imgsArrangeArr: [
                /*{
                    pos: [
                        'left': '0',
                        'right': '0'
                    ],
                    rotate: 0, // 图片的选择角度
                    isInverse: false, // 图片正反面 false表示正面
                    isCenter: false // 图片是否居中
                }*/
            ]
        }
    }

    /*
    * 获取区间内的一个随机值
    */
    getRangeRandom(low, hight) {
        return Math.ceil(Math.random() * (hight - low) + low);
    }

    /*
    * 获取 0~30° 之间的一个任意正负值
    */
    get30DegRandom() {
        let deg = (Math.random() > .5 ? '' : '-') + Math.ceil(Math.random() * 30);
        return deg;
    }

    /*
    * 翻转图片
    * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
    * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
    */
    inverse(index) {
        return function () {
            console.log('call inverse');
            let imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    }

    /*
    * 利用arrange函数， 居中对应index的图片
    * @param index, 需要被居中的图片对应的图片信息数组的index值
    * @returns {Function}
    */
    center(index) {
        return function () {
            console.log('call center');
            this.rearrange(index);
        }.bind(this);
    }

    /*
    * 重新布局所有图片
    * @param centerIndex 指定居中排布哪个图片
    */
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr;
        let centerPos = this.centerPos;
        let hPosRange = this.hPosRange;
        let vPosRange = this.vPosRange;
        let hPosRangeLeftSecX = hPosRange.leftSecX;
        let hPosRangeRightSecX = hPosRange.rightSecX;
        let hPosRangeY = hPosRange.y;
        let vPosRangeTopY = vPosRange.topY;
        let vPosRangeX = vPosRange.x;
        let imgsArrangeTopArr = [];
        let topImgNum = Math.floor(Math.random() * 2); // 取一个或是不取
        let topImgSpliceIndex = 0;

        let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中centerIndex的图片
        // 居中的centerIndex图片不需要选择

        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        }

        // 取出要布局上侧图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length - topImgNum);

        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach( (value, index) => {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: this.get30DegRandom(),
                isCenter: false
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

            imgsArrangeArr[i] = {
                pos: {
                    top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: this.get30DegRandom(),
                isCenter: false
            }
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        })
    }

    // 组件加载以后，为每张图片计算其位置的范围
    componentDidMount() {
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
        this.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        // 计算左右侧区域位置点
        this.hPosRange.leftSecX[0] = - halfImgW;
        this.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.hPosRange.y[0] = - halfImgH;
        this.hPosRange.y[1] = stageH - halfImgH;

        // 计算上下侧区域位置点
        this.vPosRange.topY[0] = - halfImgH;
        this.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.vPosRange.x[0] = halfStageW - imgW;
        this.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    }
    render() {
        let controllerUnits = [];
        let imgFigures = [];
        let self = this;

        imageDates.forEach((value, index) => {
            if (!self.state.imgsArrangeArr[index]) {
                self.state.imgsArrangeArr[index] = {
                    pos: {
                        let: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            };
            imgFigures.push(<ImgFigure key = {index} data = {value} ref = {`imgFigure${index}`} arrange = {self.state.imgsArrangeArr[index]} inverse = {self.inverse(index)} center = {self.center(index)} />);
            controllerUnits.push(<ControllerUnits key = {index} arrange = {self.state.imgsArrangeArr[index]} inverse = {self.inverse(index)} center = {self.center(index)} />);
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
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
