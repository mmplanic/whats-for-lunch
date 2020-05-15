const storage = window.localStorage;

export const appStorage={
    setAdmin: user =>storage.setItem('loged',user),
    getAdmin:()=>storage.getItem('loged'),
    removeAdmin:()=>storage.removeItem('loged'),

    setUser: user =>storage.setItem('user',user),
    getUser: () =>storage.getItem('user'),
    removeUser: ()=>storage.removeItem('user'),

    setPollId: (user, id)=>storage.setItem(user+id+"",id),
    getPollId: (user, id)=>storage.getItem(user+id+""),

    setOrderId: (user, id)=>storage.setItem("order"+user+id+"",true),
    getOrderId: (user, id)=>storage.getItem("order"+user+id+""),

}