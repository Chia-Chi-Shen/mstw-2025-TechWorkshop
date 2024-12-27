import './Chatroom.css';

const Chatroom = ({ messages }) => {
    return (
        <div className="chatroom-container">
            {messages.map((message, index) => (
                <div key={index} className="message-container">
                    <div className={`message message-${message.side}`}>{message.text}</div>
                </div>
            ))}
        </div>
    );
}

export default Chatroom;