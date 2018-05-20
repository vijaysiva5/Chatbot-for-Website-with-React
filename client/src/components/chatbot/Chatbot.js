import React, { Component } from 'react';
import axios from "axios/index";


import Message from './Message';


class Chatbot extends Component {
    messagesEnd;
    talkInput;

    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        this.state = {
            messages: []
        };
    }


    async df_text_query (queryText) {
        let msg;
        let says = {
            speaks: 'user',
            msg: {
                text : {
                    text: queryText
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says]});
        const res = await axios.post('/api/df_text_query',  {text: queryText});

        if (res.data.fulfillmentMessages ) {
            for (let i = 0; i < res.data.fulfillmentMessages.length; i++) {
                msg = res.data.fulfillmentMessages[i];
                says = {
                    speaks: 'bot',
                    msg: msg
                }
                this.setState({ messages: [...this.state.messages, says]});
            }
        }
    };


    async df_event_query(eventName) {

        const res = await axios.post('/api/df_event_query',  {event: eventName});
        let msg, says = {};

        if (res.data.fulfillmentMessages ) {
            for (let i=0; i<res.data.fulfillmentMessages.length; i++) {
                msg = res.data.fulfillmentMessages[i];
                says = {
                    speaks: 'bot',
                    msg: msg
                }

                this.setState({ messages: [...this.state.messages, says]});
            }
        }
    };

    componentDidMount() {
        this.df_event_query('Welcome');
    }


    componentDidUpdate() {
        this.scrollToBottom();
        this.talkInput.focus();
    }

    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }




    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                    return <Message key={i} speaks={message.speaks} text={message.msg.text.text}/>;
                }
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div style={{ height: 400, width:400, float: 'right'}}>
                <div id="chatbot"  style={{ height: '100%', width:'100%', overflow: 'auto'}}>
                    <h2>Chatbot</h2>
                    {this.renderMessages(this.state.messages)}
                    <div style={{ float:"left", clear: "both" }}
                         ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
                <input type="text" ref={(input) => { this.talkInput = input; }} onKeyPress={this._handleInputKeyPress} />

            </div>
        );
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

}


export default Chatbot;