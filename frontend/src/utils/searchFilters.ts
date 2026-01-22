// tipler: single= tek seçenekli checkbox, multiple= çok seçenekli checkbox, boolean= checkbox seçiliyse true, range? minAge maxAge

const searchFilters:any = {
    LolAccount: {
        server:{
            type: 'multiple',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH']},
        rank:{
            type: 'multiple',
            value:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger'],
            label:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger']},
        // rank:{  //rank'ı da multiple yapabilirim diye düşündüm, yine de 1 tane single örneği kalsın yorum satırı olarak lazım olur
        //     type: 'single',
        //     value:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
        //     'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
        //     'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger']},
        champions:{
            type: 'range',
            value:['min', 'max']},
        skins:{
            type: 'range',
            value:['min', 'max']},
        price:{
            type: 'range',
            value:['min', 'max']},
        active:{
            type: 'boolean',
            value:['true','false'],
            label:['aktif','aktif değil']}
    },
    LolBoost:{
        server:{
            type: 'multiple',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH']},
        desiredRank:{
            type: 'multiple',
            value:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger',],
            label:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger',]},
        serviceType:{
            type: 'multiple',
            value:['SoloBoost','DuoBoost','PerWin','PlacementMatch'],
            label:['Solo Boost','Duo Boost','Per Win','Placement Match']},
        deliveryTime:{
            type: 'multiple',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','10','20','30','40','50',],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','10h','20h','30h','40h','50h',]},
        price:{
            type: 'range',
            value:['min', 'max']},
    },
    LolCoach:{
        server:{
            type: 'multiple',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH']},
        rank:{
            type: 'multiple',
            value:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger'],
            label:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger']},
        deliveryTime:{
            type: 'multiple',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','10','20','30','40','50',],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','10h','20h','30h','40h','50h',]},
        price:{
            type: 'range',
            value:['min', 'max']},
        value:{
            type: 'range',
            value:['min', 'max']},
    },
    LolRP:{
        server:{
            type: 'multiple',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH']},
        deliveryTime:{
            type: 'multiple',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','10','20','30','40','50',],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','10h','20h','30h','40h','50h',]},
        price:{
            type: 'range',
            value:['min', 'max']},
        value:{
            type: 'range',
            value:['min', 'max']},
    },
    ValorantAccount: {
        server:{
            type: 'multiple',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH']},
        rank:{
            type: 'multiple',
            value:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger'],
            label:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger']},
        champions:{
            type: 'range',
            value:['min', 'max']},
        skins:{
            type: 'range',
            value:['min', 'max']},
        price:{
            type: 'range',
            value:['min', 'max']},
    },
    ValorantBoost:{
        server:{
            type: 'multiple',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH']},
        desiredRank:{
            type: 'multiple',
            value:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger',],
            label:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger',]},
        serviceType:{
            type: 'multiple',
            value:['SoloBoost','DuoBoost','PerWin','PlacementMatch'],
            label:['Solo Boost','Duo Boost','Per Win','Placement Match']},
        deliveryTime:{
            type: 'multiple',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','10','20','30','40','50',],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','10h','20h','30h','40h','50h',]},
        price:{
            type: 'range',
            value:['min', 'max']},
    },
    ValorantCoach:{
        server:{
            type: 'multiple',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH']},
        rank:{
            type: 'multiple',
            value:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger'],
            label:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger']},
        deliveryTime:{
            type: 'multiple',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','10','20','30','40','50',],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','10h','20h','30h','40h','50h',]},
        price:{
            type: 'range',
            value:['min', 'max']},
    },
    ValorantVP:{
        server:{
            type: 'multiple',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH']},
        deliveryTime:{
            type: 'multiple',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','10','20','30','40','50',],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','10h','20h','30h','40h','50h',]},
        price:{
            type: 'range',
            value:['min', 'max']},
        value:{
            type: 'range',
            value:['min', 'max']},
    },
}

export default searchFilters