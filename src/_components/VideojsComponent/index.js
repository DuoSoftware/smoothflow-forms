import React from 'react';
import videojs from 'video.js';
import AWS from "aws-sdk";
import "./index.css";

export default class VideoPlayer extends React.Component {
  constructor() {
    super()
    this.state = {
      streamAdd: 1,
      streamName: "smoothflow-stream"
    }
  }
  componentDidMount() {
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
    });
    this.player.src({
      src: 'https://stream.mux.com/01L4mnXZTXOC00s1AinH83FZ29N5oj1R5a.m3u8',
    });


    this.player.ready(
      () => {
        console.log("ready to play")
      }
    )


    this.player.on('pause', (pause) => {
      // let Selecteddata = {
      //   Type: pause.type,
      //   Current_Time: pause.target.player && pause.target.player.cache_.currentTime
      // }
      this.setState({
        streamAdd: this.state.streamAdd + 1,
        streamName: this.state.streamName + this.state.streamAdd
      })
      const kinesisvideo = new AWS.KinesisVideo();
      const params = {
        StreamName: this.state.streamName, /* required */
        DataRetentionInHours: 1,
        KmsKeyId: '2ba19b78-33b5-41f1-9b68-e9ff428a1153',
        MediaType: 'video/h264'
      };
      kinesisvideo.createStream(params, (err, data) => {
        console.log(data, "data");
        console.log(err, "err")
      })



    });

    this.player.on('play', (data) => {
      console.log("play")
    })


  }



  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }


  render() {
    return (
      <div>
        <div data-vjs-player>
          <video width="200px" height="200px" ref={node => this.videoNode = node} className="video-js"></video>
        </div>
      </div>
    )
  }
}
