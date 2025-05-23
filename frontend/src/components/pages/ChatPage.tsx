import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Category as CategoryModel } from "../../models/category";
import * as OffersApi from "../../network/offers_api"
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Category from "../Category";
import style from "../../styles/ChatPage.module.css"
import { Controller, useForm } from "react-hook-form";
import { User as UserModel } from "../../models/user";
import { OfferSmall } from "../../models/offerSmall";
import { Conversation } from "../../models/chat";

interface Messageform{
    message: string
}

interface ChatPageProps{

}

const ChatPage = () => {
    const location = useLocation()
    const navigate = useNavigate()

    
    const {handleSubmit,
           register,
           setValue,
           getValues,
           formState:{isSubmitting, errors}} = useForm<Messageform>({mode:"all"})

    const [conversations, setConversations] = useState<Conversation[]>([])
    
        
    useEffect(()=>{
       document.body.style.backgroundColor= "#121212"
        
    },[])

    
    const buyOffer = async(credentials:any)=>{
        try {
            
        } catch (error) {
            console.error(error)
        }     
    }

    
    // const socketTest = ()=> {
    //     console.log("ege")
    //     // console.log(socket.connected)
    //     console.log(typeof(socket))
    //      socket.emit("test", {
    //        targetUserId: satıcınınId,
    //        message: "şu kullanıcıdan çar satın aldım: ", satıcıUsername
    //      });    
    // }

    
    const conversationsGrid= Array.from({length:10},(_,i) =>{
        return(
            <div className={`${style.conversation}`}>
                <div className={`${style.conversationInfo}`}>
                    <div>
                        <p>username:ege</p>
                        <p className={`${style.conversationMessage}`}>messagemes aewdawedawefaew awfeawefawefwefwae waefwaeagd awefawefaewfaewf afwefawfewafawweemessagemessagemessagemessagemessagemessage</p>
                    </div>
                    
                    <div>
                        <p className={`${style.conversationInfoP}`}>ay yıl gün</p>
                        <p className={`${style.conversationInfoP}`}>saat</p>
                    </div>
                </div>
                
                
            </div>
        )
    })

    const messagesGrid= Array.from({length:10},(_,i) =>{
        return(
            <div className={`${style.conversation}`}>
                <div className={`${style.conversationInfo}`}>
                    <div>
                        <p>username:ege</p>
                        <p className={`${style.conversationMessage}`}>messagemes aewdawedawefaew awfeawefawefwefwae waefwaeagd awefawefaewfaewf afwefawfewafawweemessagemessagemessagemessagemessagemessage</p>
                    </div>
                    
                    <div>
                        <p className={`${style.conversationInfoP}`}>ay yıl gün</p>
                        <p className={`${style.conversationInfoP}`}>saat</p>
                    </div>
                </div>
                
                
            </div>
        )
    })
       
    
    return (
        <>
            <div className={`${style.container}`}>
                <div className={`${style.conversationDiv}`}> {/*conversation div*/}
                    {conversationsGrid}
                </div>

                <div className={`${style.chatDiv}`}> {/*sohbet div*/}
                    <div className={`${style.chatInfoDıv}`}> {/*username ve lastseen kısmı div*/}
                    <p className={`${style.conversationInfoP}`}>username kısmı</p>
                    <p className={`${style.conversationInfoP}`}>lastSeen kısmı</p>
                    </div>

                    <p className={`${style.line}`}> {" "}</p>

                    <div className={`${style.messagesDiv}`}> {/*mesajların göründüğü kısım*/}
                        {messagesGrid}
                        <div className={`${style.sendMessageDiv}`}>   {/*mesajın gönderildiği kısım*/} {/*mesajın yazıldığı kısım*/}
                            <Form onSubmit={handleSubmit(()=>{})}
                                id="sendMessageForm">

                            
                            
                                <Form.Control className={`${style.sendMessageControl}`}
                                as="textarea"
                                {...register(`message`, {
                                required: "Required",
                                })}
                                onInput={(e) => {
                                    const el = e.currentTarget;
                                    el.style.height = "auto"; // önce eski yüksekliği sıfırla
                                    const maxHeight = 5 * 24; // 5 satır × line-height
                                    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
                                    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
                                }}
                                    />
                            

                        
                            </Form>
                            <button className={`${style.sendMessageButton}`}
                            type="submit"
                            id="sendMessageForm">
                                {"->"}
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>

        </>

    );
}



export default ChatPage;