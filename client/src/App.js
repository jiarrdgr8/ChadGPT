import './App.css';
import './normal.css'
import { useState ,useEffect } from 'react'

function App() {

  useEffect(()=>{
    getEngines()
  }, [])

  const [input, setInput ] = useState('')
  const [temp, setTemp] = useState('0.5')
  const [models, setModels] = useState([])
  const [currentModel, setCurrentModel] = useState('text-davinci-003')
  const [chatLog, setChatLog] = useState([{
    user: 'gpt',
    message: 'Hi! How can I help you today?'
  }])

  function clearChat(){
    setChatLog([])
  }

  function getEngines(){
    fetch(`https://chadgpt-backend.onrender.com/models`)
    .then(res => res.json())
    .then(data => setModels(data.models))
  }

  async function handleSubmit(e){
    e.preventDefault()
    let chatLogNew = [...chatLog, {user:'me', message:`${input}`}]
    // await setChatLog([...chatLog, {user:'me', message:`${input}`}])
    // setChatLog(prevChatLog => [
    //   ...prevChatLog,
    // { user: 'me', message: input }
    setInput('')
    setChatLog(chatLogNew)
    const messages = chatLogNew.map((message) => message.message).join('\n')
    
    console.log(temp)
    console.log(typeof(temp))

    const response = await fetch(`https://chadgpt-backend.onrender.com/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
          // message: chatLog.map((message) => message.message).join('')
          message: messages,
          currentModel: currentModel,
          temperature: temp,
      })
    })

    const data = await response.json()
    setChatLog([...chatLogNew, {user:'gpt', message: `${data.message}`}])
    // setChatLog(prevChatLog => [
    //   ...prevChatLog,
    //   { user: 'gpt', message: data.message }
    // ]);
    // console.log(data.message)
    console.log(chatLog)
  
  }


  return (
    <div className="App">
      <aside className='sidemenu' >
        <div className="side-menu-button" onClick={clearChat}>
          New Chat
        </div>
        <h3 className='select-model'>Select Model:</h3>
        <div className='models'>
          <select onChange={(e)=>setCurrentModel(e.target.value)} className='dropdown'>
            {models && models.map((model, index)=>{
              return (
                <option key= {model.id} value={model.id}>
                  {model.id}
                </option>
              )
            })}
          </select>
        </div>
        <div className="model-desc" >
          Smart - Davinci
        </div>
        <div className="model-desc" >
          Code - ada-code
        </div>
        <p>The model parameter controls the engine used to generate the response. Davinci produces best results.</p>

        <h3 className='temp-select'>Select Temperature:</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            onBlur={(e) => {
              let value = parseFloat(e.target.value);
              if (isNaN(value)) {
                setTemp(0);
              } else if (value < 0) {
                setTemp(0);
              } else if (value > 1) {
                setTemp(1);
              }
            }}
            placeholder="0.5"
            className="temp-input"
            style={{webkitAppearance: "none"}}
          />
        </form>

        <div className="temp-desc" >
          0 - Logical
        </div>
        <div className="temp-desc" >
          0.5 - Balanced
        </div>
        <div className="temp-desc" >
          1 - Creative
        </div>
        <p>The temperature parameter controls the randomness of the model. 0 is the most logical, 1 is the most creative.</p>
      </aside>
      <section className='chatbox'>
        <div className="chat-log">
          { chatLog.map((message, index)=>(
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input 
            rows='1' 
            value={input} 
            onChange={(e)=> setInput(e.target.value)}
            className="chat-input-textarea"
            placeholder="Type your message here."></input>
          </form>  
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({message})=>{
  return (
    <div className={`chat-message ${message.user === 'gpt' && 'chatgpt'}`}>
    <div className="chat-message-center">
      <div className={`avatar ${message.user === 'gpt' && 'chatgpt'}`}>
        {message.user === 'gpt' && <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="41"
                  height="41"
                  fill="none"
                  strokeWidth="1.5"
                  className="gpt-icon"
                  viewBox="0 0 41 41"
                >
                  <path
                    fill="currentColor"
                    d="M37.532 16.87a9.963 9.963 0 00-.856-8.184 10.078 10.078 0 00-10.855-4.835A9.964 9.964 0 0018.306.5a10.079 10.079 0 00-9.614 6.977 9.967 9.967 0 00-6.664 4.834 10.08 10.08 0 001.24 11.817 9.965 9.965 0 00.856 8.185 10.079 10.079 0 0010.855 4.835 9.965 9.965 0 007.516 3.35 10.078 10.078 0 009.617-6.981 9.967 9.967 0 006.663-4.834 10.079 10.079 0 00-1.243-11.813zM22.498 37.886a7.474 7.474 0 01-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 00.655-1.134V19.054l3.366 1.944a.12.12 0 01.066.092v9.299a7.505 7.505 0 01-7.49 7.496zM6.392 31.006a7.471 7.471 0 01-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 001.308 0l9.724-5.614v3.888a.12.12 0 01-.048.103l-8.051 4.649a7.504 7.504 0 01-10.24-2.744zM4.297 13.62A7.469 7.469 0 018.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 00.654 1.132l9.723 5.614-3.366 1.944a.12.12 0 01-.114.01L7.04 23.856a7.504 7.504 0 01-2.743-10.237zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 01.113-.01l8.052 4.648a7.498 7.498 0 01-1.158 13.528v-9.476a1.293 1.293 0 00-.65-1.132zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 00-1.308 0l-9.723 5.614v-3.888a.12.12 0 01.048-.103l8.05-4.645a7.497 7.497 0 0111.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 01-.065-.092v-9.299a7.497 7.497 0 0112.293-5.756 6.94 6.94 0 00-.236.134l-7.965 4.6a1.294 1.294 0 00-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18z"
                  ></path>
              </svg>}
      </div>
      <div className="message">
        {message.message}
      </div>
    </div>
  </div>
  )
}

export default App;