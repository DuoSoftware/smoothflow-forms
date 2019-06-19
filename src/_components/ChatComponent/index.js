import React, { Component } from 'react';
// import "./index.css";
import VideoPlayer from "../VideojsComponent";
// import MPVideo from "./../../assets/Video/videoplayback.mp4"
import { Invoke, Card, Quickreply, Attachemnt, Button } from "../../core/services/chatcomponent.service";
import openSocket from 'socket.io-client';
const socket = openSocket('http://testing-smoothflow.herokuapp.com');

const videoJsOptions = {
    autoplay: true,
    controls: true,
    // sources: [{
    //     src: './../../assets/Video/videoplayback.mp4',
    //     type: 'video/mp4'
    // }]
}

class ChatbootComponent extends Component {
    constructor() {
        super()
        this.state = {
            input: "",
            chat: [],
            quickreplyIndex: []
        }
    }


    componentDidMount() {
        let { id } = this.props.match.params
        socket.on(id, (data) => {
            let msgs = this.state.chat;
            this.setState({ chat: [...msgs, data] });
        })
        // this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
        //     console.log('onPlayerReady', this)
        // });
    }

    handleChange = (event) => {
        this.setState({
            input: event.target.value
        })
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextState.chat) {
            this.scrollToBottom()
        }
    }

    scrollToBottom = () => {
        var element = document.getElementsByClassName("chatmsg-main-div");
        element[0].scrollTop = element[0].scrollHeight + element[0].scrollTop;
    }



    chatSubmit = (event) => {
        event && event.preventDefault()
        if (this.state.input) {
            this.setState({
                loading: true
            })
            let currentData = this.state.chat;
            this.setState({
                chat: [...currentData, { inmessage: this.state.input }],
                input: ""
            })
            Invoke(this.state.input)
                .then((res) => {
                    this.setState({
                        loading: false,
                    })
                    return res.json()
                })
                .then((res) => {
                    let currentData = this.state.chat;
                    this.setState({
                        loading: false,
                        chat: [...currentData, { outmessage: res.message.data }],
                    })
                    res.message && res.message.outmessage && res.message.outmessage.map((item) => {
                        if (item.type === 'text') {
                            this.setState({
                                chat: [...currentData, { outmessage: item.message }]
                            })
                        }
                        if (item.type === 'card') {
                            let currentData = this.state.chat;
                            Card(item.message)
                                .then((res) => {
                                    return res.json()
                                })
                                .then((res) => {
                                    this.setState({
                                        chat: [...currentData, { cardData: res.Result }],
                                    })
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }
                        if (item.type === 'quickreply') {
                            let currentData = this.state.chat;
                            Quickreply(item.message)
                                .then((res) => {
                                    return res.json()
                                })
                                .then((res) => {
                                    this.setState({
                                        chat: [...currentData, { quickreply: res.Result }],
                                    })
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }
                        if (item.type === 'attachment') {
                            let currentData = this.state.chat;
                            Attachemnt(item.message)
                                .then((res) => {
                                    return res.json()
                                })
                                .then((res) => {
                                    this.setState({
                                        chat: [...currentData, { outmessage: res.Result }],
                                    })
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }
                        if (item.type === 'button') {
                            let currentData = this.state.chat;
                            Button(item.message)
                                .then((res) => {
                                    return res.json()
                                })
                                .then((res) => {
                                    this.setState({
                                        chat: [...currentData, { buttonList: res.Result }],
                                    })
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
                    this.setState({
                        loading: false
                    })
                })
        }
    }

    quickreplyfunc = (itemsValue) => {
        let payload = itemsValue.payload
        this.setState({
            input: payload,
        }, () => {
            this.state.chat[this.state.chat.length - 1].quickreply.items = []
            this.chatSubmit()
        })
    }



    render() {
        let { match } = this.props;
        return (
            <div className="chatboot-component">

                {/* <video controls width="200" height="200">
                    <source src="./Video/videoplayback.mp4" type="video/mp4" />
                </video> */}

                <div className="intercom-home-screen-header">
                    <div className="main-div-arrow">
                        <img alt="back-icon" onClick={() => this.props.history.push(`/smoothflow/${match.params.id}`)} className="back-icon" src={require("./../../assets/images/left-arrow-key.png")} />
                    </div>
                    <div className="head-main-div">
                        <h4 className="example-head">Examply</h4>
                        <p className="replies-para">Typically replies in few minutes</p>
                    </div>
                    <div className="img-main-div">
                        <img className="img-chat" alt='img' src={"https://statusandphoto.weebly.com/uploads/6/0/1/5/60158603/8347592_orig.png"} />
                        <img className="img-chat" alt='img' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRAjvR6CixyhFjeG2yAzXA1EpBiwMSjiZFv67oG4Vw-uT5Iz7s"} />
                        <img className="img-chat" alt='img' src={"https://mobirise.com/bootstrap-template/profile-template/assets/images/timothy-paul-smith-256424-1200x800.jpg"} />
                    </div>
                </div>


                <div className="main-card-div">

                    <div className="chatmsg-main-div Scrollbar">
                        {this.state.chat ? this.state.chat.map((chatMessage, index) => {
                            let data = chatMessage.outmessage
                            if (chatMessage.outmessage) {
                                if (data.type === "image") {
                                    return (
                                        <div className="chatmsg-div-img" key={index}>
                                            <img className="image-message slide-right" key={index} src={data.payload.url} alt="img" width="200px" height="200px" />
                                            <VideoPlayer {...videoJsOptions} />
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div className="chatmsg-div-left" key={index}>
                                            <span className="chatmsg-pararec slide-right">{data}</span>
                                        </div>
                                    )
                                }
                            }
                            if (chatMessage.inmessage) {
                                return (
                                    <div className="chatmsg-div" key={index}>
                                        <span className="chatmsg-para slide-left">{chatMessage.inmessage}</span>
                                    </div>
                                )
                            }
                            if (chatMessage.cardData) {
                                let cardDataarray = chatMessage.cardData
                                return (
                                    <div className="chatmsg-cardData" key={index}>
                                        {cardDataarray.items ? cardDataarray.items.map((cardValue, index) => {
                                            return (<img alt="img" key={index} className="card-img-style slide-left" src={cardValue.image_url && cardValue.image_url} />)
                                        }) : null}
                                    </div>
                                )
                            }
                            if (chatMessage.quickreply) {
                                let quickreply = chatMessage.quickreply
                                return (
                                    <div key={index}>
                                        <div className="chatmsg-div-left">
                                            <span className="chatmsg-pararec-quickreply slide-right">{quickreply.text}</span>
                                        </div>
                                        {quickreply.items.length ? quickreply.items.map((itemsValue, index) => {
                                            return (
                                                <div className="quickreply-div">
                                                    <span key={index} onClick={() => this.quickreplyfunc(itemsValue)} className="quickreplystyle" style={itemsValue.payload === "no" ? { right: 10 } : { left: 0 }}>{itemsValue.payload}</span>
                                                </div>
                                            )
                                        }) : null}
                                    </div>
                                )
                            }
                            if (chatMessage.buttonList) {
                                let buttonListData = chatMessage.buttonList
                                return (
                                    <div className="buttonlist-div" key={index}>
                                        {
                                            buttonListData.items ? buttonListData.items.map((buttonValue, index) => {
                                                return (
                                                    <a key={index} rel="noopener noreferrer slide-left" href={buttonValue.other_data && buttonValue.other_data.url} target="_blank"><div>{buttonValue.title}</div></a>
                                                )
                                            }) : null
                                        }
                                    </div>
                                )
                            }
                        }) : null}
                    </div>

                    <form className="input-main-div" onSubmit={this.chatSubmit}>
                        <input className="chat-input" placeholder="Write a reply..." value={this.state.input} onChange={this.handleChange} />
                        <img className="input-icons" alt='gif' src={require("../../assets/images/gif.png")} />
                        <img className="input-icons" alt='emoji-icon' src={require("../../assets/images/happiness.png")} />
                        <img className="input-icons" alt='link-img' src={require("../../assets/images/link.png")} />
                        <button type="Submit" className="send-button">
                            {!this.state.loading ? <img alt="send-icon" className="input-icons" src={require("../../assets/images/send-button.png")} />
                                : <img className="input-icons" alt="loading" src={require("../../assets/images/loading.gif")} />}
                        </button>
                    </form>
                </div>

            </div >
        );
    }
}

export default ChatbootComponent;