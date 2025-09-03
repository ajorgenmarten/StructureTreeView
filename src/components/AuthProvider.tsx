/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { APP_NAME, BACKEND_URL, PASSWORD, USERNAME } from "./config";

const AuthContext = createContext<ReturnType<typeof useAuthHook>>({ accessToken: ''});

export const useAuth = () => useContext(AuthContext);

const useAuthHook = () => {
    const [accessToken, setAccessToken] = useState('');

    const login = async (username: string, password: string) => {
        const response = await fetch(BACKEND_URL + 'auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-APP-NAME': APP_NAME,
            },
            body: JSON.stringify({ email: username, password }),
        })
        if (response.status === 200) {
            const data = await response.json()
            setAccessToken(data.data.accessToken)
        }
    }
    const refreshToken = async () => {
        const response = await fetch(BACKEND_URL + 'auth/refresh-token', { 
            credentials: 'include',
            headers: {
                'X-APP-NAME': APP_NAME,
            }
         })
        if (response.status === 401) {
            login(USERNAME, PASSWORD)
        } else {
            const data = await response.json()
            setAccessToken(data.data.accessToken)
        }
    }
    useEffect(() => {
        refreshToken()
    }, [])

    return { accessToken }
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const authObject = useAuthHook()
  return <AuthContext.Provider value={authObject}>
    {authObject.accessToken ? children : <div className="h-screen flex items-center justify-center">Accediendo ...</div>}
  </AuthContext.Provider>;
};