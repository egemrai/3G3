import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as OffersApi from "../../network/offers_api"
import { User as UserModel } from "../../models/user";
import { OfferSmall } from "../../models/offerSmall";
import OfferPage from "./OfferPage1";
import ClassCounterTest from "../ClassCounterTest";
import ClassCounterErrorTest from "../errorFallbacks/ClassCounterErrorTest";


interface ClassCounterTestPageProps{
    user?: UserModel|null,
    socket?:any
}

const ClassCounterTestPage = ({user, socket}:ClassCounterTestPageProps) => {
    
  return(
    <ClassCounterErrorTest>
      <ClassCounterTest initialCount={5} label="Örnek Sayaç" />
    </ClassCounterErrorTest>
  )
}



export default ClassCounterTestPage;