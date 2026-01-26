//resolver error falan onları belki prop olarak gösterip createOfferPage'de değer atamak gerekir.

import {  FormState, UseFormRegister} from "react-hook-form"
import {  Form } from "react-bootstrap"
import style from "../../styles/CreateOfferForm.module.css"



type InputType = "control" | "select"
type ControlType = "input" | "textarea"
type RequiredType = "Required" | "false"

interface FormInputProps{
   register: UseFormRegister<any>
   formState: FormState<Record<string,string|number|any[]| boolean | null | undefined| Record<any,any>>>
   inputName: string
   inputData: {type:InputType,  as?:ControlType, required:RequiredType, value?:string[], label?:string[], pattern:any,optGroupValue?:any[], optGroupLabel?:any[]}
}

const LolAccountForm= ({register,formState,inputName,inputData}:FormInputProps)=>{

    const {errors} = formState
    const {type,required,as,value,label,pattern,optGroupValue,optGroupLabel} = inputData
    
    if(type === 'control'){
        return(
            <Form.Group key={inputName} className={`${style.formGroup}`} controlId={`${inputName}`}>
                <Form.Label id={`${inputName}`}>{`${inputName}:`}</Form.Label>
                    <Form.Control as={as}
                    {...register(`${inputName}`,{
                        required: required,
                        pattern: pattern
                        })
                    }
                    isInvalid={!!errors?.[inputName]}
                    />
                <Form.Control.Feedback type="invalid">
                    {errors?.[inputName]?.message}
                </Form.Control.Feedback>     
            </Form.Group>
        )
    }
    else if(type === 'select'){
        if(value && !(value.length>0) ) return <></>
        const options = value?.map((value,i)=>{
            return(
                <option key={i} value={value}> {`${label?.[i]}` || ''}</option>
            )
        })

        return(
            <Form.Group key={inputName} className={`${style.formGroup}`} controlId={`${inputName}`}>
                <Form.Label id={`${inputName}`}>{`${inputName}`}</Form.Label>
                    <Form.Select {...register(`${inputName}`,{required:required})} isInvalid={!!errors?.[inputName]}>
                        {options}
                    </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors?.[inputName]?.message}
                </Form.Control.Feedback>     
            </Form.Group>
        )
    }

    else if(type === 'select-group'){
        if(value && !(value.length>0) && optGroupLabel && !(optGroupLabel.length>0)) return <></>
        const uiName = inputName.split('_')[0]  //desiredRank_serviceType ayırmak için
        const options = optGroupLabel?.map((optGroupLabel:string,i)=>{
            const innerOptions = value?.map((value,e)=>{
                return(
                    <option key={`${value}_${optGroupValue}`} value={`${value}_${optGroupValue?.[i]}`}> {`${label?.[e]}` || ''}</option>
                )
            })

            return(
                <optgroup key={i} label={`${optGroupLabel}`}>
                    {innerOptions}
                </optgroup>
            )
        })
        
        return(
            <Form.Group key={inputName} className={`${style.formGroup}`} controlId={`${uiName}`}>
                <Form.Label id={`${uiName}`}>{`${uiName}`}</Form.Label>
                    <Form.Select {...register(`${inputName}`,{required:required})} isInvalid={!!errors?.[inputName]}>
                        {options}
                    </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors?.[inputName]?.message}
                </Form.Control.Feedback>     
            </Form.Group>
        )
    }


    else return <></>
}

export default LolAccountForm


