import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = (prop) => {

    const [user, setUser] = useState([])

    const loginUser = (val) => {
        setUser(val)
    }

    const ContextVal = {
        user,setUser,loginUser
    }

    return (
        <UserContext.Provider value={ContextVal}>
            {prop.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider