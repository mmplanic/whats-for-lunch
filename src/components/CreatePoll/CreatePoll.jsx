import React,{useState, useEffect} from 'react'
import {Container, Button, FormGroup, FormControl, Card} from 'react-bootstrap';
import { getRestaurants, createPoll, createVote } from '../../services/api.service';
import NavBar from '../../customControls/NavBar/NavBar';
import { appStorage } from '../../services/appStorage.service';
import { formatDateTime } from '../../utils/utils';



let pollName = "";
let endTime = formatDateTime(new Date());
let itemsToShow = 3;
let overflow = false;

export default function CreatePoll({history}){

    const [restaurants, setRestaurants] = useState([]);
    const [pollList, setPollList] = useState([]);
    const [search, setSearch] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [stateOverflow, setStateOverflow] = useState(false);


    useEffect(() => {  //load data on first render

        const firstLoad = 20; //assumed total number of restaurants
        getRestaurants(0,firstLoad).then(response=>{
            
            var allData=[];
            
            const {data,total} = response.data;            
            allData = data.filter(el=>el.name);

            if(total>firstLoad){  //if total number is grater than assumed, get rest of them
                getRestaurants(firstLoad,total).then(res=>{
                    const {data} = res.data;
                    console.log("data",data);
                    allData = [...allData, ...data.filter(el=>el.name)];
                    setRestaurants(allData);  
                })
            }
            else{
                setRestaurants(allData);
            }
                      
        })
    },[])



    const handleSearch = (e)=>{ // set search param
        setSearch(e.target.value);
    }

    const handleAdd = (e)=>{ // move restorant from search list to poll list
        const {id} = e.target;
        let tempArr = restaurants;
        setPollList([...pollList,restaurants.find((restaurant,index)=>{
            if(restaurant.id+"" === id+""){
                tempArr.splice(index,1);
                setRestaurants(tempArr);
                return true;
            }
            return false;
        
        })]);
        
    }
    const handleRemove = (e)=>{ // move back restorant from poll list to search list
        const {id} = e.target;
        let tempArr = pollList;
        setRestaurants([...restaurants,pollList.find((restaurant,index)=>{
            if(restaurant.id+"" === id+""){
                tempArr.splice(index,1);
                setPollList(tempArr);
                return true;
            }
            return false;
        
        })]);
    }

    const handleCreatePoll = ()=>{ // creating new Poll
        
        if(pollName.trim().length <1){
            alert('Please enter valid Poll Name');
            return;
        }

        if(new Date(endTime).getTime() <= new Date().getTime()){
            alert('End Time must be larger than current');
            return;
        }

        if(pollList.length<2 || pollList.length>15){ // check if number of restarurants is good
            alert("Poll list must contain more than 2 and less then 15 items");
        }
        else{

            let votesIDs=[];
            let votePromises = [];
            pollList.forEach((el)=>{ // creating vote objects for poll
                votePromises.push(createVote(el.id).then(res=> votesIDs.push(res.data.id)));
            });
            
            Promise.all(votePromises).then(()=>{ // creating poll after votes are created 
                console.log(votesIDs);
            
            

                let poll = {
                    label: pollName,
                    author: appStorage.getAdmin(),
                    date: formatDateTime(new Date()),
                    status: "active",
                    ends: endTime,
                    restaurants: pollList.map(res=>res.id),
                    votes: votesIDs
                }
                
                createPoll(poll).then(res=>{
                    const {id} = res.data;
                    if(id){
 
                        history.push('/home');  // dodati popup da li da redirektuje na home ili na poll
                    }
                    else{
                        alert("error on creating poll");
                    }
                }).catch(err=>alert(err));
                
            });
        }
        
    }
    const handleInput = (e)=>{
        const {name,value} = e.target;
        switch(name){
            case "pollName":pollName = value;break;
            case "endTime":endTime = value;break;
            default:;
        }
    }
    const customSort = (arr)=>{  // sort array by name
        arr.sort((a,b)=> {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        });

        return arr;
    }
    const filterList = (restaurants,search,showAll)=>{

        let arr = customSort(restaurants).filter(el=>el.name.toLowerCase().startsWith(search.toLowerCase()));

        overflow = arr.length > itemsToShow;

        if (!showAll){
            arr = arr.slice(0,itemsToShow);
        }

        if(overflow!==stateOverflow){
            setStateOverflow(overflow);
        }
        return arr;
    }
    const handleShowHide = ()=>{
        setShowAll(!showAll);
    }


    return(

        <Container className="container-lg p-0">
            <NavBar history={history}/>
         

            <div className="d-flex justify-content-around flex-wrap">

                <Card style={{width:"45%", minWidth:"360px"}} className="mt-4">
                    <Card.Header>Create poll</Card.Header>
                    <Card.Body>
                    <FormGroup>
                        <label>Poll Name:</label>
                        <FormControl type="text" name="pollName" onChange={handleInput} />
                    </FormGroup>
                    

                    <FormGroup>
                        <label>End Time:</label>
                        <FormControl type="datetime-local" defaultValue={endTime} name="endTime" onChange={handleInput}/>
                    </FormGroup>
                        <FormGroup>
                            <label>Search Restaurants:</label>
                            <FormControl type="text" placeholder="Search" onInput={handleSearch} className="mb-3"/>
                            <ul className="list-group">
                                {stateOverflow?(<Button className="shadow-none" style={{width:"100%"}} size='sm' variant='outline-primary' onClick={handleShowHide}>{!showAll?"Show all >>>":"Show less <<<"}</Button>):null}
                                {filterList(restaurants,search,showAll).map((restaurant,index)=>{
                                return (<li className="list-group-item d-flex justify-content-between align-items-center" key ={"result"+index}>
                                            {restaurant.name}
                                            <Button variant='success' className="btn-sm" id={restaurant.id} onClick={handleAdd}>Add</Button>
                                        </li>)

                                })}
                            </ul>
                        </FormGroup>
                    </Card.Body>
                </Card>


                <Card style={{width:"45%", minWidth:"360px"}} className="mt-4">
                    <Card.Header>Restaurants list</Card.Header>
                        <ul className="list-group">
                            {pollList.map((restaurant, index)=>{
                            return (<li className="list-group-item d-flex justify-content-between align-items-center" key={"picked"+index}>
                                            {restaurant.name}
                                            <Button variant="danger" className="btn-sm" id={restaurant.id} onClick={handleRemove}>Remove</Button>
                                        </li>)

                            })}
                        </ul>
                

                </Card>
                <Button style={{width:'60%'}} className="mt-3" variant="success" onClick={handleCreatePoll}>CREATE POLL</Button>
            </div>

                
        </Container>
    )
}