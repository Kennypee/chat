import React, {useEffect, useState} from 'react'
import { Chat as ChatUI } from '@progress/kendo-react-conversational-ui';
import '@progress/kendo-theme-material/dist/all.css';
import ChatManager from '../components/ChatManager'
import config from '../config'

const Chat = props => {

  const [textMessage, setTextMessage] = useState("")
  const [user, setUser] = useState({})
  const [groupMessage, setGroupMessage] = useState([])
  const GUID = config.GUID

  const sendMessage = () => {
    ChatManager.sendGroupMessage(GUID, textMessage).then(
      console.log(textMessage),
      message => {
        console.log("Message sent successfully:", message);
        setTextMessage({textMessage: null})
      
      },
      error => {
        if (error.code === "ERR_NOT_A_MEMBER") {
          console.log(error)
          ChatManager.joinGroup(GUID).then(response => {
            sendMessage();
            
          });
        }
      }
    );
  };

  const getUser = () => {
    ChatManager
      .getLoggedinUser()
      .then(user => {
        console.log("user details in useEffect:", { user });
        setUser({ user });
        console.log(user)
      })
      .catch(({ error }) => {
        if (error.code === "USER_NOT_LOGED_IN") {
          console.log(error + " Error in getUser")
         
        }
      });
  };

  useEffect(() => {
    getUser()
    const messageListener = () => {
      ChatManager.addMessageListener((data, error) => {
        if (error) return console.log(`error: ${error}`);
        setGroupMessage(
          // console.log(groupMessage),
          // prevState => ({
            [...groupMessage, data],
            
          // }),
          () => {
            
          }
        );
      });
    };
    messageListener()
  },[groupMessage]);

  return(
    <ChatUI
    user={user}
    messages={groupMessage}
    onMessageSend={sendMessage}
    width={500}

  />
  )
}

export default Chat;






// import { Chat as ChatUI } from '@progress/kendo-react-conversational-ui';
// import '@progress/kendo-theme-material/dist/all.css';
// import React from "react";
// // import { Redirect } from "react-router-dom";
// import chat from "./ChatManager";
// import config from "../config";
// import Login from './Login'
// class Groupchat extends React.Component {
//   constructor(props) {
//     super(props);
// this.state = {
//       receiverID: "",
//       messageText: null,
//       groupMessage: [],
//       user: {},
//       isAuthenticated: true
//     };
// this.GUID = config.GUID;

//   }
// sendMessage = () => {
//     chat.sendGroupMessage(this.GUID, this.state.messageText).then(
//       message => {
//         console.log("Message sent successfully:", message);
//         this.setState({ messageText: null });
//       },
//       error => {
//         if (error.code === "ERR_NOT_A_MEMBER") {
//           chat.joinGroup(this.GUID).then(response => {
//             this.sendMessage();
//           });
//         }
//       }
//     );
//   };
// scrollToBottom = () => {
//     const chat = document.getElementById("chatList");
//     chat.scrollTop = chat.scrollHeight;
//   };
// handleSubmit = event => {
//     event.preventDefault();
//     this.sendMessage();
//     event.target.reset();
//   };
// handleChange = event => {
//     this.setState({ messageText: event.target.value });
//   };
// getUser = () => {
//     chat
//       .getLoggedinUser()
//       .then(user => {
//         console.log("user details:", { user });
//         this.setState({ user: {id: this.props.user.uid,
//           author: this.props.user.name,
//           avatarUrl: this.props.user.avatar} });
//           console.log("user details:", this.state.user);
//       })
//       .catch(({ error }) => {
//         if (error.code === "USER_NOT_LOGED_IN") {
//           this.setState({
//             isAuthenticated: false
//           });
//         }
//       });
//   };
// messageListener = () => {
//     chat.addMessageListener((data, error) => {
//       if (error) return console.log(`error: ${error}`);
//       this.setState(
//         prevState => ({
//           groupMessage: [...prevState.groupMessage, data]
//         }),
//         () => {
//           this.scrollToBottom();
//         }
//       );
//     });
//   };
// componentDidMount() {
//     this.getUser();
//     this.messageListener();
//     // chat.joinGroup(this.GUID)
//   }
// render() {
//     const { isAuthenticated } = this.state;
//     if (!isAuthenticated) {
//       return <Login />;
//     }
//     return(
//       <ChatUI
//       user={this.state.user}
//       messages={this.state.groupMessage}
//       onMessageSend={this.handleSubmit}
//       width={500}
  
//     />
//     )
//   }
// }
// export default Groupchat;