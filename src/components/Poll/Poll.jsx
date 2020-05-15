import React,{useEffect, useState} from 'react'
import {Button, Container, Card} from 'react-bootstrap'
import { getPoll, getVote, updateVote, endPoll } from '../../services/api.service';
import { appStorage } from '../../services/appStorage.service';
import NavBar from '../../customControls/NavBar/NavBar';
import { authService } from '../../services/auth.service';

let votedList = [];
let votes;


let username = "";
export default function Poll(props){
    const [restaurants, setRestaurants] = useState([]);
    const [user, setUser] = useState(null);
    const [pollId, setPollId] = useState(null);

    const [validLink, setValidLink] = useState(true);

    const [pollName, setPollName] = useState("");
    const [endTime, setEndTime] = useState("");
    const [pollAuthor, setPollAuthor] = useState("");

    useEffect(() => {
        
        const id = Number(props.match.params.id);
        
        setUser(appStorage.getUser());
        setPollId(appStorage.getPollId(appStorage.getUser(),id));

        if(id === 0 || id){
            
            getPoll(id).then(res=>{
                if (res.data.status === 'inactive'){
                    setValidLink(false);
                }
                else if(new Date(res.data.ends).getTime() <=new Date().getTime()){
                    endPoll(res.data.id).then(()=>{
                        setValidLink(false);
                    });
                }
                else{
                    setPollName(res.data.label);
                    setEndTime(res.data.ends);
                    setRestaurants(res.data.restaurants);
                    setPollAuthor(res.data.author);
                    votes = res.data.votes;
                    pollChecker(id);
                }
                
            }
            
            ).catch(err=>setValidLink(false));
        }
        else{
           setValidLink(false);
            
        }

        
        
    }, [])

    const pollChecker = (id)=>{
        let interval = window.setInterval(()=>{

            getPoll(id).then(res=>{
                if (res.data.status === 'inactive'){
                    setValidLink(false);
                    window.clearInterval(interval);
                }
                else if(new Date(res.data.ends).getTime() <=new Date().getTime()){
                    endPoll(res.data.id).then(()=>{
                        setValidLink(false);
                        window.clearInterval(interval);
                    });
                }
        })},1000);
    }


    const handleVote = (e) =>{
        if(e.target.className === 'btn btn-sm btn-warning'){
            e.target.className ='btn btn-sm btn-success';
            e.target.innerHTML = "Unvote";
            votedList.push(votes.find(el=>el.restaurantId == e.target.id).id);        
        }
        else{
            e.target.className='btn btn-sm btn-warning';
            e.target.innerHTML = "Vote";
            votedList.splice(votedList.indexOf(votes.find(el=>el.restaurantId == e.target.id).id),1);    
        }
        console.log(votedList);
        
    }

    const confirmVotes = ()=>{
        if (votedList.length>0){
            let votePromises = [];
            votedList.forEach(el=>{
                votePromises.push(getVote(el).then(res=> votePromises.push(updateVote(el,res.data.votes+1))));
            });

            Promise.all(votePromises).then(()=>{
           
                appStorage.setPollId(user, Number(props.match.params.id));
                setPollId(appStorage.getPollId(user, Number(props.match.params.id)));
            })
        }
        else{
            alert("Please vote for restaurants first");  // zameni za bootstrap
        }
    }
    const handleInput = (e)=>{
        const {name,value} = e.target;
        switch(name){
            case "username":username = value;break;
            default:;
        }
    }

    const confirmUser = ()=>{
        appStorage.setUser(username);
        setUser(appStorage.getUser());
        setPollId(appStorage.getPollId(appStorage.getUser(),Number(props.match.params.id)));
    }


    
    return(
        <Container className="container-lg p-0">

                <>
                {authService.isLoged()?<NavBar history={props.history}/>:null}

                {validLink?  (

                    user?

                    pollId?(<label>{user} Vec ste glasali</label>)
                                :(<div className="d-flex justify-content-around flex-wrap">
                                    <Card className="mt-4" style={{width:"100%"}}>
                                    <Card.Header style={{textAlign:"center"}}>
                                        <h4>{pollName}</h4>
                                        <h5>Author: {pollAuthor}</h5>
                                        <label>Poll ends: {new Date(endTime).toLocaleString()}</label>
                                    </Card.Header>
                                    <Card.Body>

                                        <ul className="list-group">
                                            {restaurants.map((restaurant,index)=>{
                                                            return (<li className="list-group-item" key ={"res"+index}>
                                                                            {restaurant.name}
                                                                            <button className="btn btn-sm btn-warning" id={restaurant.id} onClick={handleVote} size="sm" style={{float:"right"}}>Vote</button>
                                                                    </li>)

                                                })}
                                        </ul>
                                        
                                    </Card.Body>
                                    
                                </Card>
                                <Button onClick={confirmVotes} style={{width:"60%"}} className="mt-3">Submit</Button>
                                </div>)
                            
                        :   <><input type="text" name="username" placeholder='Enter user name' className="form-control" onChange={handleInput}/> <Button onClick={confirmUser}>OK</Button></>

                            
                ): <label>Link is not valid or requested poll is closed</label>}


                </>
       
        </Container>
       
        )       
}