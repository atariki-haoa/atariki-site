import React, { useState, useEffect, useRef } from 'react';
import axios from '../utils/axiosConfig'; // Importar la instancia configurada
import { FaPaperPlane } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import styles from '../styles/ChatBox.module.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('/api/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    if (!newMessage.trim()) return;

    const userMessage = { role: 'user', content: newMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken || '',
        },
        body: JSON.stringify({ message: newMessage }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let botMessage = { role: 'bot', content: '' };

      while (true) {
        const { done, value } = await reader?.read() || {};
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line === 'data: [DONE]') return;

          const json = line.replace(/^data: /, '');
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices[0].delta.content || '';
            botMessage.content += content;
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              if (updatedMessages[updatedMessages.length - 1].role === 'bot') {
                updatedMessages[updatedMessages.length - 1] = botMessage;
              } else {
                updatedMessages.push(botMessage);
              }
              return updatedMessages;
            });
          } catch (error) {
            console.error('Error al parsear JSON:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout title="Chat - Ariel Lobos Haoa" description="Chat con Ariel Lobos Haoa">
      <div className="flex flex-col" style={{ marginTop: '20px' }}>
        <div className="flex-grow flex items-center justify-center">
          <div className={`flex flex-col w-full max-w-2xl shadow-lg rounded-lg overflow-hidden ${styles.chatboxContainer}`} style={{ width: '80%', minWidth: '400px', margin: '0 auto', backgroundColor: 'transparent', height: 'calc(100vh - 200px)' }}>
            <div className={styles.chatboxMessages} style={{ flexDirection: 'column', overflowY: 'auto', fontSize: '14px' }}>
              {messages.map((msg, index) => (
                <div key={index} className={msg.role === 'user' ? styles.userMessage : styles.botMessage}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ))}
              {loading && <div className={styles.loading}><ClipLoader color="#1e7e34" size={20} /></div>}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className={styles.chatboxForm}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                required
                className={styles.chatboxInput}
                rows={1}
                style={{ backgroundColor: '#f0f0f0', color: 'black', fontSize: '14px' }}
              />
              <button type="submit" className={styles.chatboxButton} disabled={loading}>
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;