import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState(""); // 存储用户输入
  const [messages, setMessages] = useState([]); // 存储对话记录
  const [loading, setLoading] = useState(false); // 控制加载状态

  const handleSend = async () => {
    if (input.trim() === "") return; // 防止空消息
    setMessages([...messages, { text: input, sender: "user" }]); // 添加用户消息
    setInput(""); // 清空输入框
    setLoading(true); // 设置加载状态

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo", // 你可以换成 gpt-4
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer `, // 🔹 替换成你的 OpenAI API Key
          },
        }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.choices[0].message.content, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "⚠️ 出错了，请检查 API Key 是否正确", sender: "bot" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>🚀 你好，ChatGPT！</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
            {msg.text}
          </div>
        ))}
        {loading && <div style={styles.botMessage}>ChatGPT 正在输入...</div>}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入你的问题..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button} disabled={loading}>
          {loading ? "发送中..." : "发送"}
        </button>
      </div>
    </div>
  );
}

// 样式
const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  chatBox: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "5px",
    minHeight: "200px",
    marginBottom: "10px",
    background: "#f9f9f9",
    textAlign: "left",
    overflowY: "auto",
    maxHeight: "300px",
  },
  userMessage: {
    background: "#007bff",
    color: "white",
    padding: "8px",
    borderRadius: "5px",
    margin: "5px 0",
    textAlign: "right",
  },
  botMessage: {
    background: "#ddd",
    color: "black",
    padding: "8px",
    borderRadius: "5px",
    margin: "5px 0",
    textAlign: "left",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: "1",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    background: "#28a745",
    color: "white",
    cursor: "pointer",
  },
};

export default App;
