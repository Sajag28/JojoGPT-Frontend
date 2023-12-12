import {useState, useEffect} from 'react'
import './index.css'
import {BASE_URL} from './helper.js'

export default function App() {
  const [value,setValue]=useState(null)
  const [message, setMessage]=useState(null)
  const [previousChats,setPreviousChats]=useState([])
const [currentTitle,setCurrentTitle]=useState(null)
  const createNewChat=()=>{
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }
  const getMessages=async()=>{
    const options={
      method:"POST",
      body:JSON.stringify({
        message:value
      }),
      headers:{
        "Content-type":"application/json"
      }

    }
    try{
      const response=await fetch(`${BASE_URL}/completions`,options)
      const data=await response.json();
      console.log(data)
      setMessage(data.choices[0].message)
    }catch(error){
      console.log(error)
    }
  }
  
  useEffect(()=>{
    console.log(currentTitle,value,message)
    if(!currentTitle&&value&&message){
      setCurrentTitle(value)
    }
    if(currentTitle && value && message){
      setPreviousChats(prevChats=>(
        [...prevChats,{
          title:currentTitle,
          role:"user",
          content:value
        },{
          title:currentTitle,
          role:message.role,
          content:message.content
        }]
      ))
    }
  },[message,currentTitle])
  const handleClick=(uniqueTitle)=>{
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }
  const currentChat=previousChats.filter(previousChat=>previousChat.title===currentTitle)
  console.log(previousChats)
const uniqueTitles=Array.from(new Set(previousChats.map(previousChat=>previousChat.title)))
console.log(uniqueTitles)
  return (
    <div className="app">
     <section className="side-bar"> 
       <button onClick={createNewChat}>+ New Chat With Me</button>
       <ul className="history">
         {uniqueTitles?.map((uniqueTitle,index)=><li key={index} onClick={()=>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}  
       </ul>
       <nav>
         <p>Made by Sajag</p>
       </nav>
     </section>
     <section className="main">
       {!currentTitle&&<h1>JojoGPT</h1>}
         <ul className="feed">
           {currentChat.map((chatMessage,index)=><li key={index}>
             <p className="role">{chatMessage.role}</p>
             <p>{chatMessage.content}</p>
           </li>)}
         </ul>
         <div className="bottom-section">
            <div className="input-container">
            <input value={value} onChange={(e)=>setValue(e.target.value)}/>
              <div id="submit" onClick={getMessages}>
                Ask Now
              </div>
            </div>
           <p className="info">
             Jojo GPT Developed by VITian.
             My Goal is to provide and have my own GPT AI chatbot.
           </p>
         </div>
     </section>
    </div>
  )
}
