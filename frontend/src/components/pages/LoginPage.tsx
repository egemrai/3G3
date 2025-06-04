import { useForm } from "react-hook-form"
import { LoginCredentials, SignUpCredentials } from "../../network/offers_api"
import { Button, Container, Form, InputGroup, Nav } from "react-bootstrap";
import style from "../../styles/LoginPage.module.css"
import { useEffect, useState } from "react";
import * as offers_api from "../../network/offers_api"
import { User } from "../../models/user";
import {FaEyeSlash, FaEye} from "react-icons/fa"
import { useLocation, useNavigate } from "react-router-dom";

interface LoginPageProps{
  onLoginSuccess: ()=>void,
  onSignupSuccessfull: ()=>void
}

const LoginPage= ({onLoginSuccess, onSignupSuccessfull}:LoginPageProps) => {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    document.body.style.backgroundColor= "#FAFAFA"
  },[])

  const [showLoginForm,setShowLoginForm]= useState<boolean>(true)
  const [showSignUpForm,setshowSignUpForm]= useState<boolean>(false)
  const [showPassword, setShowPassword]= useState<boolean>(false)
  
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting }
      } = useForm<LoginCredentials>({ mode: "all" }) //mode validation trigger seçenekleri için, all hepsinde tetikliyor

      //const { onChange, onBlur, name, ref } = register('username'); üstteki mode:all dalgasını farklı yoldan yapmaya yarıyor ama çalışmadı

      const [usernameLogin, passwordLogin]= watch(["username","password"])
      
      
    
      const submitLogin = async (credentials:LoginCredentials) => {
        try {
            await offers_api.login(credentials)
            onLoginSuccess()
            const redirectTo = location.state?.from || "/"
            navigate(redirectTo)
        } catch (error) {
          console.error(error)
          alert(error)
        }
      }


      const {
        register:register2,
        watch:watch2,
        handleSubmit:handleSubmit2,
        formState: { errors:errors2, isSubmitting: isSubmitting2 }
      } = useForm<SignUpCredentials>({ mode: "all" }) 
      
      const [usernameSignUp, passwordSignUp]= watch2(["username","password"])

      const submitSignUp= async (credentials:SignUpCredentials)=> {
        try {
          await offers_api.signUp(credentials)
          onSignupSuccessfull()
        } catch (error) {
          console.error(error)
          alert(error)
        }
      }

  
      
    const regex822 = /^.{8,22}$/
    const regexBig = /[A-Z]/
    const regexSmall = /[a-z]/
    const regexNumber = /[0-9]/
    return(
      <>
      <Container>
      {showLoginForm &&
      <Container className={`${style.loginContainer}`}>
        <div className={`${style.loginDiv}`}>
        <Form onSubmit={handleSubmit(submitLogin)}
          id="loginForm"
          >
            <Form.Group className={ `${style.loginText} mb-4`} controlId={"usernameLogin"}>
            <Form.Label id="usernameLogin">{"username"}</Form.Label>
            <Form.Control
            {...register("username",{
                required:"Required",
                pattern: {
                  value: /^.{1,22}$/,
                  // value:  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,22}$/gm,
                  message: 'Username must contain at least one uppercase letter, one lowercase letter, one number, and be between 8-22 characters.'
                }
              })}
            isInvalid={!!errors?.username}
            />
            <Form.Control.Feedback type="invalid">
                {/* {errors?.username?.message} */}
                {
                <>
                    <Container className={`${style.container}`}>
                        {regex822.test(usernameLogin) 
                        ?<span className={`${style.green}`}>8-22 characters,</span>
                        :<span>8-22 characters,</span>
                        }
                        {regexBig.test(usernameLogin) 
                        ?<span className={`${style.green}`}> min 1 uppercase letter,</span>
                        :<span> min 1 uppercase letter,</span>
                        }
                        {regexSmall.test(usernameLogin) 
                        ?<span className={`${style.green}`}> min 1 lowercase letter,</span>
                        :<span> min 1 lowercase letter,</span>
                        }
                        {regexNumber.test(usernameLogin) 
                        ?<span className={`${style.green}`}> min 1 number</span>
                        :<span> min 1 number</span>
                        }
                    </Container>
                </>} 
            </Form.Control.Feedback>     
        </Form.Group>

        <Form.Group className={ `${style.loginText} mb-4`} controlId={"password"}>
            <Form.Label>{"password"}</Form.Label>
            <InputGroup>  
              <Form.Control
              type={showPassword
                    ?"text"
                    :"password"
                    }
              {...register("password",{
                  required:"Required",   //regex kullansan bile her türlü required da kullanmak gerekiyor
                  pattern: {
                    value: /^.{1,22}$/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and be between 8-22 characters.'
                  }
                })}
              isInvalid={!!errors?.password}
              />
              <Button  onClick={()=> setShowPassword(!showPassword)}>
                {showPassword 
                ? <FaEye/>
                : <FaEyeSlash/>}
              </Button>            
            </InputGroup>
            
            <Form.Control.Feedback type="invalid">
                {errors?.password?.message}
                {/* <Container className={`${style.container}`}>
                        {regex822.test(passwordLogin) 
                        ?<span className={`${style.green}`}>8-22 characters,</span>
                        :<span>8-22 characters,</span>
                        }
                    </Container> */}
            </Form.Control.Feedback>
        </Form.Group>
          
            <Button 
                        
                        className={`${style.submitButton}`}
                        type="submit"
                        form="loginForm"
                        disabled={isSubmitting}
                        >
                        Log In
            </Button>
            <p className={`${style.NewTo3G3}`}>
              New to 3G3?
              <Nav.Link onClick={()=>{setShowLoginForm(false)
                                      setshowSignUpForm(true)} 
                                } 
                        className={`${style.gotoSignUp}`} >
                Sign up!
              </Nav.Link>
            </p>
            
      </Form>
    </div>
    </Container>}
{/* ------------------------------------------------SIGNUP------------------------------------------------------------- */}
    {showSignUpForm &&
      <Container className={`${style.loginContainer}`}>
        <div className={`${style.loginDiv}`}>
        <Form onSubmit={handleSubmit2(submitSignUp)}
          id="SignUpForm"
          >
            <Form.Group className={ `${style.loginText} mb-4`} controlId={"username"}>
              <Form.Label>{"username"}</Form.Label>
              <Form.Control
                {...register2("username",{
                  required:"Required",
                  pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,22}$/gm,
                  // value: /^.{1,22}$/ ,
                  message: 'Username must contain at least one uppercase letter, one lowercase letter, one number, and be between 8-22 characters.'
                }
                } 
                  )}
                isInvalid={!!errors2?.username}
              />
              <Form.Control.Feedback type="invalid">
                  {/* {errors2?.username?.message} */}
                {
                  <>
                    <Container className={`${style.container}`}>
                        {regex822.test(usernameSignUp) 
                        ?<span className={`${style.green}`}>8-22 characters,</span>
                        :<span>8-22 characters,</span>
                        }
                        {regexBig.test(usernameSignUp) 
                        ?<span className={`${style.green}`}> min 1 uppercase letter,</span>
                        :<span> min 1 uppercase letter,</span>
                        }
                        {regexSmall.test(usernameSignUp) 
                        ?<span className={`${style.green}`}> min 1 lowercase letter,</span>
                        :<span> min 1 lowercase letter,</span>
                        }
                        {regexNumber.test(usernameSignUp) 
                        ?<span className={`${style.green}`}> min 1 number</span>
                        :<span> min 1 number</span>
                        }
                    </Container>
                  </>
                } 
              
              </Form.Control.Feedback>     
            </Form.Group>

            <Form.Group className={ `${style.loginText} mb-4`} controlId={"email"}>
              <Form.Label>{"email"}</Form.Label>
              <Form.Control
                {...register2("email",{
                  required:"Required",
                  pattern:{
                    value:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                    message:'write proper email'
                  }
                } 
                  )}
                isInvalid={!!errors2?.email}
              />
              <Form.Control.Feedback type="invalid">
                  {errors2?.email?.message}
              
              </Form.Control.Feedback>     
            </Form.Group>

        <Form.Group className={ `${style.loginText} mb-4`} controlId={"password"}>
            <Form.Label>{"password"}</Form.Label>
            <InputGroup>  
              <Form.Control
              type={showPassword
                    ?"text"
                    :"password"
                    }
              {...register2("password",{
                  required:"Required",
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,22}$/gm,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and be between 8-22 characters.'
                  }
                })}
              isInvalid={!!errors2?.password}
              />
              <Button  onClick={()=> setShowPassword(!showPassword)}>
                {showPassword 
                ? <FaEye/>
                : <FaEyeSlash/>}
              </Button>            
            
            
            <Form.Control.Feedback type="invalid">
                 {/* {errors2?.password?.message}  */}
                 {
                  <>
                    <Container className={`${style.container}`}>
                        {regex822.test(passwordSignUp) 
                        ?<span className={`${style.green}`}>8-22 characters,</span>
                        :<span>8-22 characters,</span>
                        }
                        {regexBig.test(passwordSignUp) 
                        ?<span className={`${style.green}`}> min 1 uppercase letter,</span>
                        :<span> min 1 uppercase letter,</span>
                        }
                        {regexSmall.test(passwordSignUp) 
                        ?<span className={`${style.green}`}> min 1 lowercase letter,</span>
                        :<span> min 1 lowercase letter,</span>
                        }
                        {regexNumber.test(passwordSignUp) 
                        ?<span className={`${style.green}`}> min 1 number</span>
                        :<span> min 1 number</span>
                        }
                    </Container>
                  </>
                }
            </Form.Control.Feedback>
            </InputGroup>
        </Form.Group>
          
            <Button className={`${style.submitButton}`}
                        type="submit"
                        form="SignUpForm"
                        disabled={isSubmitting2}
                        >
                        Sign Up
            </Button>
            <p className={`${style.NewTo3G3}`}>
              Already have an account?
              <Nav.Link onClick={()=>{setShowLoginForm(true)
                                      setshowSignUpForm(false)} 
                                } 
                        className={`${style.gotoSignUp}`} >
                Login!
              </Nav.Link>
            </p>
            
      </Form>
    </div>
    </Container>}
    </Container>
    </>
    )
}

export default LoginPage





