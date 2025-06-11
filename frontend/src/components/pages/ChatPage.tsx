import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
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
    socketMessageCount: (param?:number)=>void
}

const ChatPage = ({socket,socketMessageCount}:ChatPageProps) => {
    const location = useLocation()
    const navigate = useNavigate()

    
    const {handleSubmit,
           register,
           setValue,
           getValues,
           formState:{isSubmitting, errors}} = useForm<Messageform>({mode:"all"})


    
    const [receiver, setReceiver] = useState<User|null>()
    const [sender, setSender] = useState<User>()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversationId, setSelectedConversationId] = useState<string>()
    const [conversationsGridIndex, setConversationsGridIndex] = useState<number>()
    const [startingMessage, setStartingMessage] = useState<JSX.Element>()
    const [lastseen, setLastseen] = useState<string>()
    const [conversationLoaded, setConversationLoaded] = useState<boolean>(true) //
    const [typingCheck, setTypingCheck] = useState<boolean>(false) //typing ayarlamak için, mesaj 1 harf olunca ve check false ise writingTo set ediliyor ve check true yapılıyor. mesaj 0 harf olunca da yine writingTo set ediliyor ve check false yapılıyor


    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" }) //smoothtu, auto yaptım
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
    
    async function fetchSender() {
        try {
            const response = await offers_api.fetchloggedInUser()
            
            setSender(response)
        } catch (error) {
            alert("fetchSender fetch error")
            console.error(error)
        }
    }   

    async function fetchreceiver(id:string) {
        try {
            const response = await offers_api.fetchUser(id)
            setReceiver(response)
        } catch (error) {
            alert("receiver fetch error")
            console.error(error)
        }
    }  

    async function fetchAllConversations() {
        try {
            const fetchedConversations = await chat_api.fetchAllConversations()
            console.log("fetchedConversations:",fetchedConversations)
            setConversations(fetchedConversations)
            setConversationLoaded(false)
        } catch (error) {
            // alert(error)
        }
    }

    async function setWritingTo(toNullCheck:boolean) {
        try {
            if(receiver && selectedConversationId){
                await offers_api.setWritingTo(receiver._id, toNullCheck, selectedConversationId)
            }
        } catch (error) {
            alert(error)
        }
    }

    async function setSeenByReceiverTrue(conversationId:string) {
        try {
            console.log("setSeenByReceiverTrue çalıştı")
            const fetchedConversations = await chat_api.setSeenByReceiverTrue(conversationId)
            if(fetchedConversations){
                setConversations((prev:Conversation[])=>{  //conversation tıklayınca okunmamış mesajları 0lamak için
                    return prev.map((conversation:Conversation)=>{
                        if(conversation._id===conversationId){
                           const newMessages = conversation.messages.map((message:Message)=>{
                                if(message.seenByReceiver===false){
                                    return {...message,seenByReceiver:true}
                                    }
                                return message
                            })
                            return {...conversation,messages:newMessages}
                        }
                        return conversation
                    })
                })
            }
            
            
            
        } catch (error) {
            // alert(error)
        }
    }

    

    function pushNewMessage(response:Message){
        try {
            setConversations((prev: Conversation[])=>{
                return prev.map((conversation:any)=>{
                    if(conversation._id===selectedConversationId){
                        return {
                            ...conversation,
                            messages:[...(conversation.messages|| []),response]
                        }
                    }
                    return conversation
                })
            })
        } catch (error) {
            alert("pushNewMessage error")
        }
    }

    function pushNewConversation(response:Conversation){
        try {
            setConversations((prev: Conversation[])=>{ //conversations'a yeni geleni ekledik
                setSelectedConversationId(response._id)//mesajı ekleyebilmek için yeni gelen conversationu seçtik
                setConversationsGridIndex(prev.length) // yeni eklenen conversationu focus style göstermek için
                return [...prev,response]
            })
        } catch (error) {
            alert("pushNewConversation error")
        }
    }

// const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    async function sendMessage(credentials:Messageform) {
        const messageTemporaryId = crypto.randomUUID()
        const ege = {...credentials, receiverId:receiver!._id,messageTemporaryId}
        const date = new Date()
        try {
            setValue("message","")
            const response = await chat_api.sendMessage(ege)
            const temporaryMessage:any = {
                _id:messageTemporaryId,
                senderId:sender,
                receiverId:receiver,
                message: credentials.message,
                createdAt:date,
                seenByReceiver:false,
                sent:false
            }
            pushNewMessage(temporaryMessage) //tek ve çift tık ayarlayıp, mesaj response beklememek için random _id ile bir mesaj push ediyoruz
            if(response.firstMessageCheck){
                console.log("response.fetchedConversation",response.fetchedConversation)
                console.log("response.fetchedConversation",response.fetchedConversation)
                pushNewConversation(response.fetchedConversation)//
            }
            if(response){
                console.log("response.fetchedConversation:", response.fetchedConversation)
                console.log("response.messageTemporaryId:", response.messageTemporaryId)
                console.log("response.fetchedMessage:", response.fetchedMessage)
                setConversations((prev:Conversation[])=>{
                    return prev.map((conversation:Conversation)=>{
                        if(conversation._id === response.fetchedConversation._id){
                            const newMessages = conversation.messages.map((message:Message)=>{
                                if(message._id === response.messageTemporaryId){
                                    return response.fetchedMessage
                                }
                                return message
                            })
                            return {...conversation,
                                    messages: newMessages
                            }
                        }
                        return conversation
                    })
                })    
                setSelectedConversationId(response.fetchedConversation._id)
                setTypingCheck(false)
                setWritingTo(true)
            }
        } catch (error) {
            alert(error)
        }
    }

    
    const selectedConversation = useMemo(()=>{
       return conversations.find((conversation)=>conversation._id === selectedConversationId)
    },[conversations,selectedConversationId])

    async function sena(){
        Promise.all([fetchSender(),fetchAllConversations()])
    } 

    useEffect(()=>{
        document.body.style.backgroundColor= "#121212"
        // fetchAllConversations()
        // fetchSender()
        sena()

        return()=>{
            setSelectedConversationId(undefined)
        }
    },[])

    useEffect(() => {
        if(!conversationLoaded){ //buraya sayfa açılınca ve bütün conversationlar fetch edildikten sonra 1 kere girmek istiyorum, default hali true. fetchAllConversations sonunda false yapıyorum. Buraya 1 kere giriyor ve buranın sonunda tekrar true yapıyorum
            if(!conversations[0] && !location?.state?.chatReceiverId){
                setStartingMessage(<p className={`${style.receivedMessage}`}>Chat butonuna tıklayarak mesajlaşmaya başla</p>)
                setReceiver(null)
            }
            else if(conversations[0] && !location?.state?.chatReceiverId){
                setStartingMessage(<p className={`${style.receivedMessage}`}>Mesajlaşmak için sol taraftan bir kullanıcı seç</p>)
                setReceiver(null)
            }
            else if(location?.state?.chatReceiverId || receiver){
                fetchreceiver(location?.state?.chatReceiverId) // offer ya da transaction vs. den chat açılırsa receiver id var ve
                if(conversations.length>0){
                    const defaultConversation = conversations.find((conversation:Conversation)=>{  //find ile koşula uyan ilk elemanı seçicez
                        const ids = conversation.participants.map((p)=>p._id)    //map ile sender ve receiver'ın idsini array olarak saklıyoruz
                        return ids.includes(sender!._id) && ids.includes(location?.state?.chatReceiverId) //arraydeki 2 id sender ve receiver idleri içeriyorsa find için true dönüyor
                        })
                    if(defaultConversation){
                        setSelectedConversationId(defaultConversation._id)
                        setReceiver(defaultConversation.participants.find((user:User)=>user._id===receiver?._id))
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
            // console.log("socketSendFirstmessage:", data.message)
            // console.log("socketSendFirstconversation:", data.conversation)
            setConversations((prev:Conversation[])=>{
                return [...prev,{...data.conversation,messages:[data.message]}]
            })
        })

        socket.on("socketSendDefaultMessage", (data:any) => {
            // console.log("socketDefaultmessage:", data.message)
            // console.log("socketDefaultconversation:", data.conversation)
            setConversations((prev:Conversation[])=>{
                return prev.map((conversation:Conversation)=>{
                   if(conversation._id===data.conversation._id){
                       return {...conversation,messages: [...(conversation.messages || []),data.message]}
                   }
                   return conversation
                })
            })
            if(selectedConversationId===data.conversation._id){
                // setSelectedConversation((prev:any)=>{
                //     prev.messages.push(data.message)
                //     return prev
                // })
                setSeenByReceiverTrue(data.conversation._id)
                console.log("setSeenByReceiverTrue")
            }
            else{
                socketMessageCount()
            }
        })

        socket.on("socketSetSeenByReceiverTrue", (data:any) => {
            setConversations((prev:Conversation[])=>{
                return prev.map((conversation:Conversation)=>{
                    if(conversation._id === data.conversationId){
                        const updatedMessages = conversation.messages.map((message:any)=>{
                            if((message.senderId._id === data.messageSenderId) && message.seenByReceiver === false){
                                return{
                                    ...message,
                                    seenByReceiver: true,
                                }
                            }
                            return message
                        })
                        return {...conversation,messages:updatedMessages}
                    }
                    return conversation
                })
            })
        })

        socket.on("socketSetWritingTo", (data:any) => {
            // console.log("data.senderId ->mesajı kimin yazdığının id'si:",data.senderId)
            console.log("data.writingToUser ->mesajın kime yazıldığı id'si:",data.writingToUser)
            console.log("data.writingToUser._id.toString():",data.writingToUser._id.toString())
            // console.log("data.toNullCheck ->toWriting'i null yapmak için check, true ise null olcak:",data.writingToId)
            // console.log("data.selectedConversationId ->2sinin conversation id'si:",data.selectedConversationId)
            if(selectedConversationId === data.selectedConversationId){
                setReceiver(data.writingToUser)
            }
            setConversations((prev:Conversation[])=>{
                return prev.map((conversation:Conversation)=>{
                    const participantIds = [conversation.participants[0]._id, conversation.participants[1]._id]
                    if(participantIds.includes(data.senderId) && participantIds.includes(data.writingToUser._id)){
                        const updatedParticipants = conversation.participants.map((participant:User)=>{
                            if(participant._id === data.senderId){
                                if(data.toNullCheck)
                                return{
                                    ...participant,
                                    writingTo: null,
                                }
                                else{
                                    return{
                                        ...participant,
                                        writingTo: data.writingToUser._id,
                                    } 
                                }
                            }
                            return participant
                        })
                        return {...conversation,participants:updatedParticipants}
                    }
                    return conversation
                })
            })
        })

        return () => {
        socket.off("socketSendFirstMessage")
        socket.off("socketSendDefaultMessage")
        socket.off("socketSetSeenByReceiverTrue")
        socket.off("socketSetWritingTo")
        }
    }
    }, [socket,selectedConversation ])
    
    const conversationsGrid= conversations.map((conversation,i) =>{
        const userLang = navigator.language || 'tr-TR'; // Örn: "tr-TR", "en-US", "de-DE" dili tarayıcıdan alıp, tarihi ona göre ayarlama
        const receiver = conversation.participants.find((p:User) => p._id !== sender!._id)
        const lastMessage = conversation.messages[conversation.messages.length-1] // conversationdaki son mesaj
        const date = new Date(lastMessage.createdAt)
        let unreadMessageCount = 0
        conversation.messages.forEach(message => {
          if(message.senderId._id!==sender?._id && message.seenByReceiver===false){
            unreadMessageCount++
          }
        })
        return(
            <div key={i} className={conversationsGridIndex===i
                                    ? `${style.selectedConversation} ${style.conversation}`
                                    : `${style.conversation}`
            }
            onClick={()=>{setSelectedConversationId(conversation._id)
                          setConversationsGridIndex(i)
                          setReceiver((conversation.participants.find((user:User)=>user._id!==sender?._id)))
                          if(unreadMessageCount >0){
                              setSeenByReceiverTrue(conversation._id)
                              socketMessageCount(unreadMessageCount)
                          }
                          
                          
            }}>
                <div className={`${style.conversationInfo}`}>
                    <div>
                        {unreadMessageCount >0
                        ?<p className={`${style.conversationInfoP}`}>{`${receiver &&receiver.username }`}
                        <span style={{color:"lightgreen"}}> {`(${unreadMessageCount})`}</span> 
                         </p>
                        :<p className={`${style.conversationInfoP}`}>{`${receiver &&receiver.username }`}</p>}
                        
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
            className={message.senderId._id === sender?._id
            ? `${style.sentMessage}` 
            : `${style.receivedMessage}`}
            >
                <p className={`${style.messageP}`}>{`${message.message}`} </p>
                <div className={`${style.time_checkDiv}`}>
                    <span>{`${date.toLocaleString('tr-TR',{hour:'2-digit',minute:'2-digit'})} `}</span> {/*message.sent === false*/ }
                    {message.senderId._id === sender?._id  && 
                    <>
                    {message.sent === false
                    ?<span  className={message.seenByReceiver === true 
                        ? `${style.messageTickColor}` 
                        : `${style.styleaGerekYok}`}>{`✓`}
                    </span>
                    :<span  className={message.seenByReceiver === true 
                        ? `${style.messageTickColor}` 
                        : `${style.styleaGerekYok}`}>{`✓✓`}
                    </span>
                    }
                    </>}
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
                        {receiver &&
                            (receiver.online
                                ? (receiver.writingTo === sender?._id
                                ? <p className={`${style.chatInfoP} ${style.colorGreen}`}>typing...</p>
                                : <p className={`${style.chatInfoP}`}>online</p>
                                ) 
                                
                                : <p className={`${style.chatInfoP}`}> {`${(lastseen && `${lastseen}`)}`}</p>  )}
                                
                        {/* <p className={`${style.chatInfoP}`}>{receiver &&
                                                            (receiver.online
                                                                ? (receiver.writingTo === sender?._id
                                                                ? "typing..."
                                                                : "online"
                                                                ) 
                                                                
                                                                : (lastseen && `${lastseen}`)  )}
                                                                </p> */}
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
                                    if (e.key === "Enter" && !e.shiftKey) { //enter basma control, shift ile basılırsa çalışmaz
                                        e.preventDefault() // yeni satır oluşmasını engeller
                                        // console.log("submit öncesi")
                                        handleSubmit(sendMessage)()
                                        // console.log("submit sonrası")
                                        setTypingCheck(false)
                                        setWritingTo(true)
                                    }
                                }}
                                onChange={(e)=>{
                                    if(receiver){
                                        if(typingCheck === false && e.currentTarget.value.length === 1){
                                            setTypingCheck(true)
                                            setWritingTo(false)
                                            console.log("yazıyor")
                                        }
                                        else if(typingCheck === true && e.currentTarget.value.length === 0){
                                            setTypingCheck(false)
                                            setWritingTo(true)
                                            console.log("yazmayı bitirdi")
                                        } 
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