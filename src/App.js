import React, { Component } from 'react';
import './App.css';
import TopBar from "./_shell/topbar/sf_tf.topbar";
import Sidenav from "./_shell/sidenav/sf_tf.sidenav";
import Body from "./_shell/body/sf_tf.body";
import Formview from "./_containers/formview/sf_tf.formview.container";

class App extends Component {
  render() {
    return (
        <div className="App">
            <TopBar/>
            <div className="sf-tf-main-container">
                <Sidenav/>
                <Body>
                    <Formview/>
                </Body>
            </div>
        </div>
    );
  }
}

export default App;
