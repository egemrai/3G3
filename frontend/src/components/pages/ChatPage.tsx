import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Category as CategoryModel } from "../../models/category";
import * as chat_api from "../../network/chat_api"
import * as offers_api from "../../network/offers_api"
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Category from "../Category";
import style from "../../styles/ChatPage.module.css"
import { Controller, useForm } from "react-hook-form";
import { Conversation, Message } from "../../models/chat";
import { User } from "../../models/user";

interface Messageform{
    message: string
}

interface ChatPageProps{
    socket:any
}

const ChatPage = ({socket}:ChatPageProps) => {
    const location = useLocation()
    const navigate = useNavigate()

    
    const {handleSubmit,
           register,
           setValue,
           getValues,
           formState:{isSubmitting, errors}} = useForm<Messageform>({mode:"all"})


    
    const [receiver, setReceiver] = useState<User>()
    const [sender, setSender] = useState<User>()
    const [senderId, setSenderId] = useState<string>("")
    const [receiverId, setReceiverId] = useState<string>("")
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation>()
    const [conversationsGridIndex, setConversationsGridIndex] = useState<number>()
    const [startingMessage, setStartingMessage] = useState<JSX.Element>()
    const [lastseen, setLastseen] = useState<string>()
    const [conversationLoaded, setConversationLoaded] = useState<boolean>(false)


    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    function saatiAyarla(){
        if(receiver){
            const currentDate = new Date()
            const receiverLastOnline = new Date(receiver?.lastOnline)
           
            const timeDiff = currentDate.getTime() - receiverLastOnline.getTime()

            const seconds = Math.floor(timeDiff / 1000)
            const minutes = Math.floor(seconds / 60)
            const hours   = Math.floor(minutes / 60)
            const days    = Math.floor(hours / 24)
            const months  = Math.floor(days / 30)
            const years   = Math.floor(days / 365)
            
            if(years>1)
                setLastseen(years+" year(s) ago")
            else if(months>1)
                setLastseen(months+" month(s) ago")
            else if(days>1)
                setLastseen(days+" day(s) ago")
            else if(hours>1)
                setLastseen(hours+" hours(s) ago")
            else if(minutes>1)
                setLastseen(minutes+" minutes(s) ago")
            else if(seconds>1)
                setLastseen(seconds+" seconds(s) ago")
        }
    }
    
    async function fetchSenderId() {
        try {
            const response = await offers_api.getloggedInUserId()
            console.log("senderId:",response)
            setSenderId(response)
        } catch (error) {
            alert("senderId fetch error")
            console.error(error)
        }
    }   

    async function fetchreceiver(id:string) {
        try {
            const response = await offers_api.fetchUser(id)
            setReceiver(response)
        } catch (error) {
            alert("senderId fetch error")
            console.error(error)
        }
    }  

    async function fetchAllConversations() {
        try {
            const fetchedConversations = await chat_api.fetchAllConversations()
            console.log(fetchedConversations)
            setConversations(fetchedConversations)
        } catch (error) {
            // alert(error)
        }
    }

    

    function pushNewMessage(response:Message){
        try {
            const newMessageAddedConversation = selectedConversation
            if(newMessageAddedConversation){
                console.log("response",response)
                console.log("response",response)
                newMessageAddedConversation.messages.push(response)
                setSelectedConversation(newMessageAddedConversation)
                setConversations((prev:any)=>{
                const newConversations = prev.map((conversation:any)=>{
                   if(conversation._id===newMessageAddedConversation._id){
                       return newMessageAddedConversation
                   }
                   else return conversation
                })
                return newConversations
            })
            }
        } catch (error) {
            alert("pushNewMessage error")
        }
    }

    function pushNewConversation(response:Conversation){
         const newConversationAddedConversation = conversations
            if(newConversationAddedConversation){
                
                newConversationAddedConversation.push(response)
                setConversationsGridIndex(newConversationAddedConversation.length-1) // yeni eklenen conversationu focus style göstermek için
                setConversations(newConversationAddedConversation) //conversations'a yeni geleni ekledik
                setSelectedConversation(response)//mesajı ekleyebilmek için yeni gelen conversationu seçtik
            }
    }

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    async function sendMessage(credentials:Messageform) {
        const messageTemporaryId = crypto.randomUUID()
        const ege = {...credentials,receiverId,messageTemporaryId}
        const date = new Date()
        try {
            setValue("message","")
            const response = await chat_api.sendMessage(ege)
            const temporaryMessage:any = {
                _id:messageTemporaryId,
                senderId:senderId,
                receiverId:receiver,
                message: credentials.message,
                createdAt:date,
                seenByReceiver:false,
                sent:false
            }
                pushNewMessage(temporaryMessage) //tek ve çift tık ayarlayıp, mesaj response beklememek için random _id ile bir mesaj push ediyoruz
                console.log("1. await öncesi")
                await wait(2000)
                console.log("1. await sonrası")
            if(response.fetchedConversation){
                    pushNewConversation(response.fetchedConversation)//
                    console.log("2. await öncesi")
                    await wait(2000)
                    console.log("2. await sonrası")
                }
            if(response){
                if(selectedConversation){
                    console.log("3. await öncesi")
                    await wait(2000)
                    console.log("3. await sonrası")
                    const selectedConversationMessages:any = selectedConversation.messages.map((message:any)=>{
                        if(message._id === response.messageTemporaryId){
                            console.log("mesaj değişti")
                            return(response.fetchedMessage)
                        }
                        else{
                            console.log("mesaj değişmedi")
                            return(message)
                    }
                })
                const newSelectedConversation = selectedConversation
                newSelectedConversation.messages = selectedConversationMessages
                setSelectedConversation(newSelectedConversation)
                }                         
            }
               
            console.log("esas response:",response)
        } catch (error) {
            alert(error)
        }
    }

    

    async function sena(){
        Promise.all([fetchSenderId(),fetchAllConversations()])
    } 

    
    useEffect(()=>{
        document.body.style.backgroundColor= "#121212"
        // fetchAllConversations()
        // fetchSenderId()
        sena()
    },[])

    useEffect(() => {
        if(!conversationLoaded){
            if(!conversations[0] && !location?.state?.chatReceiverId){
                setStartingMessage(<p className={`${style.receivedMessage}`}>Chat butonuna tıklayarak mesajlaşmaya başla</p>)
                setReceiverId("")
            }
            else if(conversations[0] && !location?.state?.chatReceiverId){
                setStartingMessage(<p className={`${style.receivedMessage}`}>Mesajlaşmak için sol taraftan bir kullanıcı seç</p>)
                setReceiverId("")
            }
            else if(location?.state?.chatReceiverId){
                setReceiverId(location?.state?.chatReceiverId) // offer ya da transaction vs. den chat açılırsa receiver id var ve 
                fetchreceiver(location?.state?.chatReceiverId)
                if(conversations[0]){
                    console.log("egeeg")
                    console.log("egeeg")
                    const defaultConversation = conversations.find((conversation:Conversation)=>{  //find ile koşula uyan ilk elemanı seçicez
                        const ids = conversation.participants.map((p)=>p._id)    //map ile sender ve receiver'ın idsini array olarak saklıyoruz
                        console.log("ids:",ids)
                        console.log("ids:",ids)
                        console.log("ids:",ids)
                        return ids.includes(senderId) && ids.includes(location?.state?.chatReceiverId) //arraydeki 2 id sender ve receiver idleri içeriyorsa find için true dönüyor
                        })
                    if(defaultConversation){
                        console.log("defaultConversation",defaultConversation)
                        console.log("defaultConversation",defaultConversation)
                        console.log("defaultConversation",defaultConversation)
                        setSelectedConversation(defaultConversation)
                        setReceiver(defaultConversation.participants.find((user:User)=>user._id===receiverId))
                    }
                }
                else{
                        setStartingMessage(<p className={`${style.receivedMessage}`}>Sohbete başlamak için ilk mesajı gönder.</p>)
                }
            }
        }
        setConversationLoaded(true)
    }, [conversations])

    

    useEffect(() => {
        scrollToBottom()
    }, [selectedConversation?.messages.length,selectedConversation])
    
    
    useEffect(() => {
        if(receiver){
            saatiAyarla()
        }
    }, [receiver])

    //SOCKETS
    
        useEffect(() => {
    if (socket) {
        socket.on("socketSendFirstMessage", (data:any) => {
            console.log("socketSendFirstmessage:", data.message)
            console.log("socketSendFirstconversation:", data.conversation)
            setConversations((prev)=>{
                if(!prev) return prev
                const newConversations = [...prev,data.conversation]
                return newConversations
            })
        })

        socket.on("socketSendDefaultMessage", (data:any) => {
            console.log("Defaultmessage:", data.message)
            console.log("Defaultconversation:", data.conversation)
            setConversations((prev:any)=>{
                const newConversations = prev.map((conversation:any)=>{
                   if(conversation._id===data.conversation._id){
                       conversation.messages.push(data.message)
                   }
                   return conversation
                })
                return newConversations
            })
        })

        return () => {
        socket.off("socketSendFirstMessage")
        socket.off("socketSendDefaultMessage")
        }
    }
    }, [socket])
    
    const conversationsGrid= conversations.map((conversation,i) =>{
        const userLang = navigator.language || 'tr-TR'; // Örn: "tr-TR", "en-US", "de-DE" dili tarayıcıdan alıp, tarihi ona göre ayarlama
        const receiver = conversation.participants.find((p:User) => p._id !== senderId)
        const lastMessage = conversation.messages[conversation.messages.length-1] // conversationdaki son mesaj
        const date = new Date(lastMessage.createdAt) 
        return(
            <div key={i} className={conversationsGridIndex===i
                                    ? `${style.selectedConversation} ${style.conversation}`
                                    : `${style.conversation}`
            }
            onClick={()=>{setSelectedConversation(conversation)
                          setConversationsGridIndex(i)
                          setReceiverId((conversation.participants.find((user:User)=>user._id!==senderId))!._id)
                          setReceiver((conversation.participants.find((user:User)=>user._id!==senderId)))
                        //   console.log((conversation.participants.find((user:User)=>user._id!==senderId)))
            }}>
                <div className={`${style.conversationInfo}`}>
                    <div>
                        <p className={`${style.conversationInfoP}`}>{`${receiver &&receiver.username}`}</p>
                        <p className={`${style.conversationMessage}`}>{`${lastMessage &&lastMessage.message}`}</p>
                    </div>
                    
                    <div>
                        <p className={`${style.conversationInfoDate}`}>{`${lastMessage && date.toLocaleString(userLang, { day: '2-digit', month: '2-digit', year: 'numeric' })}`}</p>
                        <p className={`${style.conversationInfoDate}`}>{`${lastMessage && date.toLocaleString(userLang, { hour:'2-digit', minute:'2-digit' })}`}</p>
                    </div>
                </div>
                
            </div>
        )
    })

    const messagesGrid=selectedConversation?.messages.map((message:Message,i) =>{
        const date = new Date(message.createdAt)
        return(
            <div key={i}
            onClick={()=>console.log(message.senderId._id)} 
            className={message.senderId._id === senderId
            ? `${style.sentMessage}` 
            : `${style.receivedMessage}`}
            >
                <p className={`${style.messageP}`}>{`${message.message}`} </p>
                <div className={`${style.time_checkDiv}`}>
                    <span>{`${date.toLocaleString('tr-TR',{hour:'2-digit',minute:'2-digit'})} `}</span>
                    {(message.senderId._id === senderId  && message.sent === false)

                    ?<span  className={message.seenByReceiver === true 
                        ? `${style.messageTickColor}` 
                        : `${style.styleaGerekYok}`}>{`✓`}
                    </span>
                    :<span  className={message.seenByReceiver === true 
                        ? `${style.messageTickColor}` 
                        : `${style.styleaGerekYok}`}>{`✓✓`}
                    </span>}
                </div>
            </div>
            
        )
    })

    

    
    return (
        <>
            <div className={`${style.container}`}> {/*conversation kısmı*/}
                <div className={`${style.conversationDiv}`}> {/*conversation div*/}
                    {conversationsGrid }
                </div>

                <div className={`${style.chatDiv}`}> {/*chatDiv kısmı*/}
                    <div className={`${style.chatInfoDıv}`}> {/*username ve lastseen kısmı div*/}
                    <p className={`${style.chatInfoP}`}>{receiver && `${receiver?.username}`}</p>
                    <p className={`${style.chatInfoP}`}>{receiver &&
                                                        (receiver.online
                                                         ?  "online"
                                                         : (lastseen && `${lastseen}`)  )}
                                                         </p>
                    </div>

                    <p className={`${style.line}`}> {" "}</p>

                    <div className={`${style.messagesDiv}`}> {/*mesajların göründüğü kısım*/}

                        {(messagesGrid && messagesGrid.length >0)
                         ?messagesGrid
                        :startingMessage}

                        <div ref={messagesEndRef} />
                    </div>
                    <div className={`${style.sendMessageDiv}`}>   {/*mesajın gönderildiği kısım sendMessageDiv*/} {/*mesajın yazıldığı kısım*/}
                            <Form onSubmit={handleSubmit(sendMessage)}
                                id="sendMessageForm">

                                <Form.Control className={`${style.sendMessageControl}`}
                                as="textarea"
                                {...register(`message`, {
                                required: "Required",
                                })}
                                onInput={(e) => {               //chatgpt baktım
                                    const el = e.currentTarget;
                                    el.style.height = "40px";
                                    const maxHeight = 5 * 24; // 5 satır × line-height
                                    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`; //Math.min() en yüksek olanı return ediyor
                                    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
                                    
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault() // yeni satır oluşmasını engeller
                                    console.log("Enter'a bastı")
                                    handleSubmit(sendMessage)()
                                    }
                                }}
                                    />
                            

                        
                            </Form>
                            <button className={`${style.sendMessageButton}`}
                            type="submit"
                            form="sendMessageForm"
                             >
                                {"->"}
                            </button>
                    </div> {/*mesajın gönderildiği kısım sonu sendMessageDiv*/}
                </div>{/*chatDiv sonu*/}
                
            </div>{/*conversation sonu*/}

        </>

    );
}



export default ChatPage;