import { auth } from "../firebase/firebase.config";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import { apiRegister } from "../components/Service/ServiceApi";

export const AuthContext = createContext()
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) console.log("error context")
  return context;
}

export const AuthProvider = ({ children }) => {
  const [userCurrent, setUserCurrent] = useState(null)
  // @const estado si hay o no un usuario logeado

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user")
  //   if(storedUser){
  //     setUserCurrent(storedUser)
  //   }
  // }, [])
  
  /*
    @funtion { register } registra al usuario en Firebase y en nuestra base de datos
    @funtion createUserWithEmailAndPassword Google
    @funtion apiRegister registrar el usuario en nuestra base de datos

  */
  const register = async (email, password, name) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })
      console.log(user)
      let valueApi;
      if (Object.keys(user).length !== 0) {
        const dataApi = await apiRegister(user)
        valueApi = dataApi
        localStorage.setItem("user", user.uid)
      }
      setUserCurrent({
        value: valueApi,
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      })

      return userCurrent
    }
    catch (err) {
      return {value : 409}
    }
  }

  /*
    @funtion { login } realiza el login con los datos a Firebase, lo guarda en el estado y en el localStorage
    @funtion signInWithEmailAndPassword funcion de Firebase para logear.
  */
  const login = async (email, password) => {
    console.log(userCurrent)
    try{
      const { user } = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("user", user.uid)
        setUserCurrent({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        })
        console.log(userCurrent)
    }catch (err){
      console.log(err.message)
    }
  }

  /*
    @funtion { loginWithGoogle } funcion que logea al usuario, lo guarda en el estado y lo guarda en el localStorage
    @funtion GoogleAuthProvider() funcion de firebase

  */
  const loginWithGoogle = async () => {
    const responseGoogle = new GoogleAuthProvider()
    const { user } = await signInWithPopup(auth, responseGoogle)
    setUserCurrent({
      uid : user.uid,
      name : user.displayName, 
    })
    localStorage.setItem("user" , user.uid)
  }

  /* 
    @funtion { logout } - funcion que borra el estado, borra el localStorage y cierra sesión con Firebase
  */
  const logout = async () => {

    localStorage.clear()
    setUserCurrent(null)
    const responseOut = await signOut(auth)
  }

  return <AuthContext.Provider
    value={{
      register,
      login,
      loginWithGoogle,
      logout,
      userCurrent
    }}
  >
    {children}
  </AuthContext.Provider>
}