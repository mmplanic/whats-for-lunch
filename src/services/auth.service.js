import { appStorage } from "./appStorage.service";

let loged = false;
export const authService = {

    LogIn : (user,pass)=>{

        //dodati proveru user-a i passworda

        appStorage.setAdmin(user);
        appStorage.setUser(user);
        loged = true;
    
    },
    
    LogOut : ()=>{
        loged = false;
        appStorage.removeAdmin();
        //appStorage.removeUser();  -- ostavlja mogucnost glasanja i nakon sto se izloguje
        return loged;
    },
    
    isLoged : ()=>loged||appStorage.getAdmin(),
    
    
    
    Register : (user,pass)=>{
    
    }


}


