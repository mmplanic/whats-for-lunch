import React,{useEffect,useState} from 'react'


export default function DateTime(){
    const [dateTime, setDateTime] = useState("");
    
    useEffect(() => {
        startTime();
    },[])


    const startTime = ()=> {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        var Y = today.getFullYear();
        var M = today.getMonth();
        var D = today.getDate();
        m = checkTime(m);
        s = checkTime(s);
        M = checkTime(M);
        D = checkTime(D);
        setDateTime(D + "/" + M + "/" + Y + " ---- " +  h + ":" + m + ":" + s);
        var t = setTimeout(startTime, 500);
      }

      const checkTime = i =>  i < 10 ? "0" + i:i;


      return(
            <label>{dateTime}</label>
      )
}