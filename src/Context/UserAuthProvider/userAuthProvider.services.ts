import axios from "axios";
import type { UserData, UserDataResponseType } from "./userAuthProvider.interface";

export async function getUserData(): Promise<null | UserData> {
    const token = localStorage.getItem('user_tkn');

   
    if (!token) {
        return null;
    }

    try {
        const res = await axios.get<UserDataResponseType>(`${import.meta.env.VITE_BASE_URL}/users/profile-data`, {
            headers: {
                token: token
            }
        });

        return res.data.data.user;
    } catch (error) {
        return null;
    }
}