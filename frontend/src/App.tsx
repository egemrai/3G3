import React, { useEffect, useRef, useState } from 'react';
import {  Container } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import CategoryPage from './components/pages/CategoryPage';
import ServicesContainer from './components/ServicesContainer';
import OffersContainer from './components/OffersContainer';
import NotFoundPage from './components/pages/NotFoundPage';
import LoginPage from './components/pages/LoginPage';
import { User } from './models/user';
import * as offers_api from "./network/offers_api"
import OfferPage from './components/pages/OfferPage1';
import OfferPage2 from './components/pages/OfferPage2';
import CreateOfferPage from './components/pages/CreateOfferPage';
import ManageOfferPage from './components/pages/ManageOfferPage';
import EditOfferPage from './components/pages/EditOfferPage';
import UserProfilePage from "./components/pages/UserProfilePage"
import HomePage from './components/pages/HomePage';
import TransactionPage from './components/pages/TransactionPage';

import connectSocket from "./socket"
import SoldOffersPage from './components/pages/SoldOffersPage';
import BoughtOffersPage from './components/pages/BoughtOffersPage';

function App() {

  const [loggedInUser, setLoggedInUser]= useState<null| User>(null)

  // const socket = connectSocket()

  const getUser = async () => {
    try {
        const currentUser = await offers_api.getLoggedInUser()
        setLoggedInUser(currentUser)
    } catch (error) {
        console.error(error)
        //alert(error)
    }
}

  const logOut = async () => {
    try {
      setLoggedInUser(null)
      // await delay(2000)
      // await getUser()
    } catch (error) {
      console.error(error)
    }
  }

useEffect(()=>{
  getUser()
},[])

const [socket,setSocket] = useState<any>()

useEffect(() => {
  if (loggedInUser) {
     const newSocket =  connectSocket(loggedInUser._id.toString()); // burada await ile socket nesnesini alıyoruz
     setSocket(newSocket)
    
     newSocket.on("connect", () => {
    console.log("Sunucuya bağlandık! ID:", newSocket.id);
  });
  
  newSocket.on("serverdanMesaj", (data:any) => {
    alert(data.message + data.from)
    console.log("serverdan mesaj:", data.message);
    console.log("gönderen:", data.from);
  });

  

  newSocket.on("disconnect", () => {
    console.log("Sunucudan bağlantı koptu.");
  });
  // Cleanup
  return () => {
    newSocket.disconnect(); // eski socket kapatılıyor
    newSocket.off("connect");
    newSocket.off("disconnect");
  }
}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [loggedInUser]);




  return (
    <>
    <BrowserRouter>
      <div>
      {/* <NavbarLoggedInView/> */}
         <NavBar
         loggedInUser={loggedInUser}
         signInUsername={loggedInUser?.username}
         onLogoutSuccessfull={logOut}
         socket={socket}
         /> 

          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/login' element={loggedInUser
                                          ?<NotFoundPage />
                                          :<LoginPage
                                          onLoginSuccess={getUser}
                                          onSignupSuccessfull={getUser}
                                          />}
                                          />
            <Route path='category' element={<CategoryPage/>}/>
            <Route path='/category/:category' element={<ServicesContainer/>}/>
            <Route path='/category/:category/:service' element={<OffersContainer/>}/>

            <Route path='/offer' element={<OfferPage2
                                          user={loggedInUser}
                                          socket={socket}/>}/>

            <Route path='/createOffer' element={<CreateOfferPage/>}/>
            <Route path='/editOffer' element={<EditOfferPage/>}/>
            <Route path='/manageOffer' element={<ManageOfferPage/>}/>
          
            <Route path='/profile/:username' element={<UserProfilePage/>}/>

            <Route path='/soldOffers' element={<SoldOffersPage/>}/>
            <Route path='/boughtOffers' element={<BoughtOffersPage/>}/>

            <Route path='/transaction' element={<TransactionPage/>}/>

            <Route
            path='/*'  //url üsttekilerden biri olmazsa, olanı kullanıyor
            element={<NotFoundPage />}
            />
          </Routes>
      </div>
    </BrowserRouter>
    </>
    );
}

export default App;
