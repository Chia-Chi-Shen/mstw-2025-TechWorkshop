import './App.css';
import KeyInput from './Component/KeyInput';
import Chatroom from './Component/Chatroom';

const testMessages = [
  { text: 'Hello', side: 'left' },
  { text: 'Hi', side: 'right' },
  { text: 'How are you?', side: 'left' },
  { text: 'I am fine', side: 'right' },
  { text: 'Good to hear', side: 'left' },
  { text: 'Hello', side: 'left' },
  { text: 'Hi', side: 'right' },
  { text: 'How are you?', side: 'left' },
  { text: 'I am fine', side: 'right' },
  { text: 'Good to hear', side: 'left' },
  { text: 'Hello', side: 'left' },
  { text: 'Hi', side: 'right' },
  { text: 'How are you?', side: 'left' },
  { text: 'I am fine', side: 'right' },
  { text: 'Good to hear', side: 'left' },
  { text: 'Hello', side: 'left' },
  { text: 'Hi', side: 'right' },
  { text: 'How are you?', side: 'left' },
  { text: 'I am fine', side: 'right' },
  { text: 'Good to hear', side: 'left' },
];

function App() {
  return (
    <div className="page-container">
      <section className='container'>
        <h1>PDF Viewer</h1>
        <KeyInput />
        <ul className="pdf-list">
          <li><input type="radio" name="pdf" value="pdf1" />
            <a href="test.pdf" target="_blank">PDF Title1</a>
          </li>
          <li><input type="radio" name="pdf" value="pdf2" />
            <a href="test.pdf" target="_blank">PDF Title2</a>
          </li>
          <li><input type="radio" name="pdf" value="pdf3" />
            <a href="test.pdf" target="_blank">PDF Title3</a>
          </li>
          <li><input type="radio" name="pdf" value="pdf4" />
            <a href="test.pdf" target="_blank">PDF Title4</a>
          </li>
          <li><input type="radio" name="pdf" value="pdf5" />
            <a href="test.pdf" target="_blank">PDF Title5</a>
          </li>
        </ul>
      </section>
      <section className='container' style={{ backgroundColor: '#eeeded' }}>
        <h1>Chatroom</h1>
        <Chatroom messages={testMessages} />
        <div className="chat-box">
          <textarea placeholder="Enter your message..."></textarea>
          <button onClick="sendMessage()">Send</button>
        </div>
      </section>
    </div>
  );
}

export default App;
