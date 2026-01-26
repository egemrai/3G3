// required: Required olması lazım sanırım, true yapınca error mesaj gelmiyormuş.

const offerFormData:any = {
    LolAccount: {
        title:{
            type: 'control',
            required: 'Required',
            as:'input',
            pattern: undefined},
        description:{
            type: 'control',
            required: 'Required',
            as:'textarea',
            pattern: undefined},
        server:{
            type: 'select',
            required: 'Required',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            pattern: undefined},
        rank:{
            type: 'select',
            required: 'Required',
            value:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger'],
            label:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger'],
            pattern: undefined},
        champions:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+$/,
                message: "Only numbers are allowed",
            }},
        skins:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+$/,
                message: "Only numbers are allowed",
            }},
        price:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Only numbers with up to 2 decimal places are allowed",
            }},
        currency:{
            type: 'select',
            required: 'Required',
            value:['USD','EURO','TRY'],
            label:['USD','EURO','TRY'],
            pattern: undefined},
        stock:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^(?:0|[1-9][0-9]{0,3})$/,
                message: "Only numbers between [0-9999] are allowed",
            }},
        deliveryTime:{
            type: 'select',
            required: 'Required',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36',
                '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72'],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h','24h','25h','26h','27h','28h','29h','30h','31h','32h','33h','34h','35h','36h',
                    '37h','38h','39h','40h','41h','42h','43h','44h','45h','46h','47h','48h','49h','50h','51h','52h','53h','54h','55h','56h','57h','58h','59h','60h','61h','62h','63h','64h','65h','66h','67h','68h','69h','70h','71h','72h'],
            pattern: undefined},
    },
    LolBoost:{
        title:{
            type: 'control',
            required: 'Required',
            as:'input',
            pattern: undefined},
        description:{
            type: 'control',
            required: 'Required',
            as:'textarea',
            pattern: undefined},
        server:{
            type: 'select',
            required: 'Required',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            pattern: undefined},
        desiredRank_serviceType:{
            type: 'select-group',
            required: 'Required',
            value:['Unranked','Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'],
            label:['Unranked','Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'],
            optGroupValue:['SoloBoost','DuoBoost','PerWin', 'PlacementMatch'],
            optGroupLabel:['SoloBoost','DuoBoost','Per Win', 'Placement Match'],
            pattern: undefined},
        price:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Only numbers with up to 2 decimal places are allowed",
            }},
        currency:{
            type: 'select',
            required: 'Required',
            value:['USD','EURO','TRY'],
            label:['USD','EURO','TRY'],
            pattern: undefined},
        stock:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^(?:0|[1-9][0-9]{0,3})$/,
                message: "Only numbers between [0-9999] are allowed",
            }},
        deliveryTime:{
            type: 'select',
            required: 'Required',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36',
                '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72'],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h','24h','25h','26h','27h','28h','29h','30h','31h','32h','33h','34h','35h','36h',
                    '37h','38h','39h','40h','41h','42h','43h','44h','45h','46h','47h','48h','49h','50h','51h','52h','53h','54h','55h','56h','57h','58h','59h','60h','61h','62h','63h','64h','65h','66h','67h','68h','69h','70h','71h','72h'],
            pattern: undefined},
        duration:{
            type: 'select',
            required: 'Required',
            value:['7','14','30'],
            label:['7 days','14 days','30 days'],
            pattern: undefined},
        },
    LolCoach:{
        title:{
            type: 'control',
            required: 'Required',
            as:'input',
            pattern: undefined},
        description:{
            type: 'control',
            required: 'Required',
            as:'textarea',
            pattern: undefined},
        server:{
            type: 'select',
            required: 'Required',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            pattern: undefined},
        rank:{
            type: 'select',
            required: 'Required',
            value:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'],
            label:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'],
            pattern: undefined},
        price:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Only numbers with up to 2 decimal places are allowed",
            }},
        currency:{
            type: 'select',
            required: 'Required',
            value:['USD','EURO','TRY'],
            label:['USD','EURO','TRY'],
            pattern: undefined},
        stock:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^(?:0|[1-9][0-9]{0,3})$/,
                message: "Only numbers between [0-9999] are allowed",
            }},
        deliveryTime:{
            type: 'select',
            required: 'Required',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36',
                '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72'],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h','24h','25h','26h','27h','28h','29h','30h','31h','32h','33h','34h','35h','36h',
                    '37h','38h','39h','40h','41h','42h','43h','44h','45h','46h','47h','48h','49h','50h','51h','52h','53h','54h','55h','56h','57h','58h','59h','60h','61h','62h','63h','64h','65h','66h','67h','68h','69h','70h','71h','72h'],
            pattern: undefined},
        duration:{
            type: 'select',
            required: 'Required',
            value:['7','14','30'],
            label:['7 days','14 days','30 days'],
            pattern: undefined},
    },
    LolRP:{
        title:{
            type: 'control',
            required: 'Required',
            as:'input',
            pattern: undefined},
        description:{
            type: 'control',
            required: 'Required',
            as:'textarea',
            pattern: undefined},
        server:{
            type: 'select',
            required: 'Required',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            pattern: undefined},
        value:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+$/,
                message: "Only numbers are allowed",
            }},
        price:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Only numbers with up to 2 decimal places are allowed",
            }},
        currency:{
            type: 'select',
            required: 'Required',
            value:['USD','EURO','TRY'],
            label:['USD','EURO','TRY'],
            pattern: undefined},
        stock:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^(?:0|[1-9][0-9]{0,3})$/,
                message: "Only numbers between [0-9999] are allowed",
            }},
        deliveryTime:{
            type: 'select',
            required: 'Required',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36',
                '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72'],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h','24h','25h','26h','27h','28h','29h','30h','31h','32h','33h','34h','35h','36h',
                    '37h','38h','39h','40h','41h','42h','43h','44h','45h','46h','47h','48h','49h','50h','51h','52h','53h','54h','55h','56h','57h','58h','59h','60h','61h','62h','63h','64h','65h','66h','67h','68h','69h','70h','71h','72h'],
            pattern: undefined},
    },
    ValorantAccount: {
        title:{
            type: 'control',
            required: 'Required',
            as:'input',
            pattern: undefined},
        description:{
            type: 'control',
            required: 'Required',
            as:'textarea',
            pattern: undefined},
        server:{
            type: 'select',
            required: 'Required',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            pattern: undefined},
        rank:{
            type: 'select',
            required: 'Required',
            value:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger'],
            label:['Iron 4','Iron 3','Iron 2','Iron 1','Bronze 4','Bronze 3','Bronze 2','Bronze 1','Silver 4','Silver 3','Silver 2','Silver 1',
            'Gold 4','Gold 3','Gold 2','Gold 1','Platinum 4','Platinum 3','Platinum 2','Platinum 1','Emerald 4','Emerald 3',
            'Emerald 2','Emerald 1','Diamond 4','Diamond 3','Diamond 2','Diamond 1','Master 1','Grandmaster','Challenger'],
            pattern: undefined},
        agents:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+$/,
                message: "Only numbers are allowed",
            }},
        skins:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+$/,
                message: "Only numbers are allowed",
            }},
        price:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Only numbers with up to 2 decimal places are allowed",
            }},
        currency:{
            type: 'select',
            required: 'Required',
            value:['USD','EURO','TRY'],
            label:['USD','EURO','TRY'],
            pattern: undefined},
        stock:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^(?:0|[1-9][0-9]{0,3})$/,
                message: "Only numbers between [0-9999] are allowed",
            }},
        deliveryTime:{
            type: 'select',
            required: 'Required',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36',
                '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72'],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h','24h','25h','26h','27h','28h','29h','30h','31h','32h','33h','34h','35h','36h',
                    '37h','38h','39h','40h','41h','42h','43h','44h','45h','46h','47h','48h','49h','50h','51h','52h','53h','54h','55h','56h','57h','58h','59h','60h','61h','62h','63h','64h','65h','66h','67h','68h','69h','70h','71h','72h'],
            pattern: undefined},
    },
    ValorantBoost:{
        title:{
            type: 'control',
            required: 'Required',
            as:'input',
            pattern: undefined},
        description:{
            type: 'control',
            required: 'Required',
            as:'textarea',
            pattern: undefined},
        server:{
            type: 'select',
            required: 'Required',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            pattern: undefined},
        desiredRank_serviceType:{
            type: 'select-group',
            required: 'Required',
            value:['Unranked','Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'],
            label:['Unranked','Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'],
            optGroupValue:['SoloBoost','DuoBoost','PerWin', 'PlacementMatch'],
            optGroupLabel:['SoloBoost','DuoBoost','Per Win', 'Placement Match'],
            pattern: undefined},
        price:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Only numbers with up to 2 decimal places are allowed",
            }},
        currency:{
            type: 'select',
            required: 'Required',
            value:['USD','EURO','TRY'],
            label:['USD','EURO','TRY'],
            pattern: undefined},
        stock:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^(?:0|[1-9][0-9]{0,3})$/,
                message: "Only numbers between [0-9999] are allowed",
            }},
        deliveryTime:{
            type: 'select',
            required: 'Required',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36',
                '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72'],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h','24h','25h','26h','27h','28h','29h','30h','31h','32h','33h','34h','35h','36h',
                    '37h','38h','39h','40h','41h','42h','43h','44h','45h','46h','47h','48h','49h','50h','51h','52h','53h','54h','55h','56h','57h','58h','59h','60h','61h','62h','63h','64h','65h','66h','67h','68h','69h','70h','71h','72h'],
            pattern: undefined},
        duration:{
            type: 'select',
            required: 'Required',
            value:['7','14','30'],
            label:['7 days','14 days','30 days'],
            pattern: undefined},
    },
    ValorantCoach:{
        title:{
            type: 'control',
            required: 'Required',
            as:'input',
            pattern: undefined},
        description:{
            type: 'control',
            required: 'Required',
            as:'textarea',
            pattern: undefined},
        server:{
            type: 'select',
            required: 'Required',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            pattern: undefined},
        rank:{
            type: 'select',
            required: 'Required',
            value:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'],
            label:['Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'],
            pattern: undefined},
        price:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Only numbers with up to 2 decimal places are allowed",
            }},
        currency:{
            type: 'select',
            required: 'Required',
            value:['USD','EURO','TRY'],
            label:['USD','EURO','TRY'],
            pattern: undefined},
        stock:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^(?:0|[1-9][0-9]{0,3})$/,
                message: "Only numbers between [0-9999] are allowed",
            }},
        deliveryTime:{
            type: 'select',
            required: 'Required',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36',
                '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72'],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h','24h','25h','26h','27h','28h','29h','30h','31h','32h','33h','34h','35h','36h',
                    '37h','38h','39h','40h','41h','42h','43h','44h','45h','46h','47h','48h','49h','50h','51h','52h','53h','54h','55h','56h','57h','58h','59h','60h','61h','62h','63h','64h','65h','66h','67h','68h','69h','70h','71h','72h'],
            pattern: undefined},
        duration:{
            type: 'select',
            required: 'Required',
            value:['7','14','30'],
            label:['7 days','14 days','30 days'],
            pattern: undefined},
    },
    ValorantVP:{
        title:{
            type: 'control',
            required: 'Required',
            as:'input',
            pattern: undefined},
        description:{
            type: 'control',
            required: 'Required',
            as:'textarea',
            pattern: undefined},
        server:{
            type: 'select',
            required: 'Required',
            value:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            label:['EUW','EUNE','NA','KR','LAN','LAS','BR','OCE','JP','RU','TR','PH','TH'],
            pattern: undefined},
        value:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+$/,
                message: "Only numbers are allowed",
            }},
        price:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Only numbers with up to 2 decimal places are allowed",
            }},
        currency:{
            type: 'select',
            required: 'Required',
            value:['USD','EURO','TRY'],
            label:['USD','EURO','TRY'],
            pattern: undefined},
        stock:{
            type: 'control',
            required: 'Required',
            pattern: {
                value: /^(?:0|[1-9][0-9]{0,3})$/,
                message: "Only numbers between [0-9999] are allowed",
            }},
        deliveryTime:{
            type: 'select',
            required: 'Required',
            value:['0.16', '0.32','0.48','0.64','0.80','1','2','3','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36',
                '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72'],
            label:['10min', '20min','30min','40min','50min','1h','2h','3h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h','23h','24h','25h','26h','27h','28h','29h','30h','31h','32h','33h','34h','35h','36h',
                    '37h','38h','39h','40h','41h','42h','43h','44h','45h','46h','47h','48h','49h','50h','51h','52h','53h','54h','55h','56h','57h','58h','59h','60h','61h','62h','63h','64h','65h','66h','67h','68h','69h','70h','71h','72h'],
            pattern: undefined},
    },
}

export default offerFormData