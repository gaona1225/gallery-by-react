import 'core-js/fn/object/assign';
import React from 'react';
import { Router, IndexRoute, Route, hashHistory} from 'react-router';
import App from '../components/Main';
import GalleryByReactApp from '../components/GalleryByReactApp'

class Gallery extends React.Component {
  render() {
    return (
      // 路由配置
        <Router history={hashHistory}>
            <Route path="/">
                <IndexRoute component={App}></IndexRoute>
                <Route path="/gallery" component={GalleryByReactApp}></Route>
            </Route>
        </Router>
    );
  }
}

Gallery.defaultProps = {
};

export default Gallery;