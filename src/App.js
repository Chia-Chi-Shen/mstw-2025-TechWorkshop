import { useState, useRef } from 'react';

// These are the libraries you need to use the services.
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import { AzureOpenAI } from 'openai';

import './App.css';

const pdfList = [
  { title: 'demo1.pdf', url: 'https://workshoppoc.blob.core.windows.net/pdf/demo1.pdf' },
  { title: 'demo2.pdf', url: 'https://workshoppoc.blob.core.windows.net/pdf/demo2.pdf' },
  { title: 'demo3.pdf', url: 'https://workshoppoc.blob.core.windows.net/pdf/demo3.pdf' },
];

/** Replace the following values with your own.
 *  Remember to pass the right variables to each function!
*/
const endpoint_doc = "your_endpoint_for_doc";
const endpoint_openai = "your_endpoint_for_openai";
const apiVersion = "your_api_version";
const deployment = "your_deployment";

function App() {
  const [messages, setMessages] = useState('');
  const [openAiKey, setOpenAiKey] = useState(localStorage.getItem('OpenAiKey') || '');
  const [docKey, setDocKey] = useState(localStorage.getItem('DocKey') || '');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);

  const sendQuestion = async () => {
    if (!openAiKey) {
      window.alert('Please enter the API Key');
      return;
    }
    if (!docKey) {
      window.alert('Please enter the DOC Key');
      return;
    }
    // Get the selected PDF file.
    const pdfList = document.querySelectorAll('.pdf-list input');
    let blobUrl;
    pdfList.forEach((pdf) => {
      if (pdf.checked) {
        blobUrl = pdf.value;
      }
    });
    if (!blobUrl) {
      alert('Please select a PDF file');
      return;
    };

    // Get the question from the textarea and update the messages.
    const textarea = document.querySelector('.chat-box textarea');
    const question = textarea.value;
    if (!question) {
      return;
    }
    textarea.value = '';
    setMessages((messages) => [...messages, { text: question, side: 'right' }]);

    try {
      // Start the analysis process.
      setIsLoading(true);
      // First, analyze the PDF file.
      const data = await analyzePDFWithUrl(blobUrl)
      const content = data.content;
      // Then, query the GPT model and get the response.
      const result = await queryModel(content, question);
      // Update states of the chatroom.
      setIsLoading(false);
      setMessages((messages) => [...messages, { text: result, side: 'left' }]);
      // Scroll to the bottom of the messages.
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  // Function for calling the Document Intelligence service.
  async function analyzePDFWithUrl(blobUrl) {
    // write your code here
  }

  // Function for calling the OpenAI service.
  async function queryModel(contract, question) {
    // write your code here
  }

  const handleOpenAiKey = () => {
    const target = document.querySelector('.api-key')
    const OpenAiKey = target.value;
    localStorage.setItem('OpenAiKey', OpenAiKey);
    setOpenAiKey(OpenAiKey);
    window.alert('API Key saved successfully');
  }

  const handleDocKey = () => {
    const target = document.querySelector('.doc-key')
    const DocKey = target.value;
    localStorage.setItem('DocKey', DocKey);
    setDocKey(DocKey);
    window.alert('DOC Key saved successfully');
  }


  return (
    <div className="page-container">
      <section className='container'>
        <h1>PDF Viewer</h1>
        <div className="key-container">
          <div className="key-row">
            <span className="key-label">DOC Key:</span>
            <input className="key-input doc-key" type="password" />
            <button className="key-button" onClick={handleDocKey}>Save</button>
          </div>
          <div className="key-row">
            <span className="key-label">API Key:</span>
            <input className="key-input api-key" type="password" />
            <button className="key-button" onClick={handleOpenAiKey}>Save</button>
          </div>
        </div>
        <ul className="pdf-list">
          {pdfList.map((pdf, index) => (
            <li key={index}><input type="radio" value={pdf.url} name="pdf-list" />
              <a href={pdf.url} target="_blank">{pdf.title}</a>
            </li>
          ))}
        </ul>
      </section>
      <section className='container' style={{ backgroundColor: '#eeeded' }}>
        <h1>Chatroom</h1>
        <div className="chatroom-container">
          {messages.length !== 0 && messages.map((message, index) => (
            <div key={index} className="message-container">
              <div className={`message message-${message.side}`}>{message.text}</div>
            </div>
          ))}
          {isLoading && <div className="message-container">
            <div className="message message-left">Loading...</div>
          </div>}
          <div ref={messageEndRef}></div>
        </div>
        <div className="chat-box">
          <textarea placeholder="Enter your message..."></textarea>
          <button onClick={sendQuestion}>Send</button>
        </div>
      </section>
    </div>
  );
}

export default App;
