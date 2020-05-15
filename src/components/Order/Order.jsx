
import React,{useEffect, useState} from 'react'
import {Container, Button, Row, Col, FormGroup, FormControl, Card, Modal} from 'react-bootstrap';
import { getOrder, getRestaurantByID, getMealsFromRestaurant, createOrderItem } from '../../services/api.service';
import { appStorage } from '../../services/appStorage.service';
import NavBar from '../../customControls/NavBar/NavBar';
import { authService } from '../../services/auth.service';


let username = "";
let itemsToShow = 3;
let overflow = false;
let mealNotes = "";
let mealCount = 1;

export default function Order(props){
    const [restaurantName, setRestaurantName] = useState("");
    const [user, setUser] = useState("");
    const [orderId, setOrderId] = useState("");

    const [validLink, setValidLink] = useState(true);

    const [meals, setMeals] = useState([]);
    const [addedMeals, setAddedMeals] = useState([]);
    const [search, setSearch] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [stateOverflow, setStateOverflow] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState({});

    useEffect(() => {
        
        const id = Number(props.match.params.id);
        
        setUser(appStorage.getUser());
        setOrderId(appStorage.getOrderId(appStorage.getUser(),id));

        if(id === 0 || id){
            
            getOrder(id).then(res=>{
                if (res.data.status === 'inactive'){
                    setValidLink(false);
                }
                else{
                    getRestaurantByID(res.data.restaurantId).then(res2=>{
                        setRestaurantName(res2.data.name);
                    });

                    getMealsFromRestaurant(res.data.restaurantId).then(res2=>{
                        console.log(res2.data.data);
                        setMeals(res2.data.data);
                    });
                    
                }
                
            }
            
            ).catch(err=>setValidLink(false));
        }
        else{
           setValidLink(false);
            
        }

        
        
    }, [])

    const handleSearch = (e)=>{ // set search param
        setSearch(e.target.value);
    }
    const handleAdd = (e)=>{
        const {id} = e.target;
        let selectedMeal = meals.find((meal,index)=>{
            if(meal.id+"" === id+""){
                return true;
            }
            return false;
        });
        setSelectedMeal(selectedMeal);
        setShowModal(true);
    }


    const handleAddMeal = (e)=>{ // move restorant from search list to poll list
        const id = selectedMeal.id;
        let tempArr = meals;
        setAddedMeals([...addedMeals,meals.find((meal,index)=>{
            if(meal.id+"" === id+""){
                meal.notes = mealNotes;
                meal.count = mealCount;
                tempArr.splice(index,1);
                setMeals(tempArr);
                return true;
            }
            return false;
        
        })]);
        
        setShowModal(false);
    }
    const handleRemove = (e)=>{ // move back restorant from poll list to search list
        const {id} = e.target;
        let tempArr = addedMeals;
        setMeals([...meals,addedMeals.find((meal,index)=>{
            if(meal.id+"" === id+""){
                tempArr.splice(index,1);
                setAddedMeals(tempArr);
                return true;
            }
            return false;
        
        })]);
    }

    
    const handleInput = (e)=>{
        const {name,value} = e.target;
        switch(name){
            case "username":username = value;break;
            case "mealNotes":mealNotes = value;break;
            case "mealCount":mealCount = value;break;
            default:;
        }
    }

    const confirmUser = ()=>{
        appStorage.setUser(username);
        setUser(appStorage.getUser());
        //setPollId(appStorage.getPollId(appStorage.getUser(),Number(props.match.params.id)));
    }

    const customSort = (arr)=>{  // sort array by title
        arr.sort((a,b)=> {
            if(a.title < b.title) { return -1; }
            if(a.title > b.title) { return 1; }
            return 0;
        });

        return arr;
    }
    const filterList = (meals,search,showAll)=>{
        
        let arr = customSort(meals).filter(el=>el.title.toLowerCase().startsWith(search.toLowerCase()));

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
    
     const handleCloseModal = () => setShowModal(false);
    
    const handleCreateOrderItems = ()=>{
        let allPromises = [];
        addedMeals.forEach((el)=>{
            let orderItem = {
                note: el.notes,
                quantity: el.count,
                user: user,
                mealId: el.id,
                orderId: props.match.params.id
            }
            allPromises.push(createOrderItem(orderItem));
        });
        Promise.all(allPromises).then(()=>{
            //redirket il stavec
        });
    }

    return(

        <Container className="container-lg p-0">
            {authService.isLoged()?<NavBar history={props.history}/>:null}

            {validLink?  (

                user?

                orderId?(<><label>{user} Vec ste glasali</label></>)
                            :(<>
                            <Modal show={showModal} 
                            animation={false}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>{selectedMeal.title}</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <p>Description: {selectedMeal.description}</p>
                                <p>Price: {selectedMeal.price}</p>
                                <FormGroup>
                                    <label>Note:</label>
                                    <input type="text" name="mealNotes" placeholder='Enter notes' className="form-control" onChange={handleInput}/>
                                </FormGroup>
                                <FormGroup>
                                    <label>Count:</label>
                                    <input type="number" name="mealCount" placeholder='Enter count' className="form-control" onChange={handleInput}/>
                                </FormGroup>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                                <Button variant="primary" onClick={handleAddMeal}>Add</Button>
                            </Modal.Footer>
                            </Modal>

                        <h3 style={{textAlign:"center"}} className="mt-4">{restaurantName}</h3>

                    <div className="d-flex justify-content-around flex-wrap">
                            


                    <Card style={{width:"45%", minWidth:"360px"}} className="mt-4">
                        <Card.Header>Meals:</Card.Header>
                        <Card.Body>
                                <FormGroup>
                                <label>Search Restaurants:</label>
                                <FormControl type="text" placeholder="Search" onInput={handleSearch} className="mb-3"/>
                                    <ul className="list-group">
                                        {stateOverflow?(<Button className="shadow-none" style={{width:"100%"}} size='sm' variant='outline-primary' onClick={handleShowHide}>{!showAll?"Show all >>>":"Show less <<<"}</Button>):null}
                                        {filterList(meals,search,showAll).map((meal,index)=>{
                                        return (<li className="list-group-item d-flex justify-content-between align-items-center" key ={"result"+index}>
                                            <div>
                                                <h5>{meal.title}</h5>
                                                <p>Description: {meal.description}</p>
                                                <p>Price: {meal.price}</p>
                                            </div>
                                                    
                                                    <Button variant='success' className="btn-sm" id={meal.id} onClick={handleAdd}>Add</Button>
                                                </li>)

                                        })}
                                    </ul>
                            </FormGroup>
                        </Card.Body>
                    </Card>



                    <Card style={{width:"45%", minWidth:"360px"}} className="mt-4">
                    <Card.Header>Order:</Card.Header>
                        <ul className="list-group">
                            {addedMeals.map((meal, index)=>{
                            return (<li className="list-group-item d-flex justify-content-between align-items-center" key={"picked"+index}>
                                             <div>
                                                <h5>{meal.title}</h5>
                                                <p>Notes: {meal.notes}</p>
                                                <p>Count: {meal.count}</p>
                                                <p>Description: {meal.description}</p>
                                                <p>Price: {meal.price}</p>
                                                <p>Sum: {meal.price * meal.count}</p>
                                            </div>
                                            <Button variant="danger" className="btn-sm" id={meal.id} onClick={handleRemove}>Remove</Button>
                                        </li>)

                            })}

                        <li className="list-group-item">Total: {addedMeals.reduce((a, b)=>{
                                return (a + (b.count*b.price));
                            }, 0)}
                        </li>
                        </ul>

                    

                    </Card>
                
                    <Button type="button" variant="success" style={{width:"60%"}} className="mt-3" onClick={handleCreateOrderItems}>FINISH ORDER</Button>

                    </div>
                </>)
                        
                    :   <><input type="text" name="username" placeholder='Enter user name' className="form-control" onChange={handleInput}/> <Button onClick={confirmUser}>OK</Button></>

                        
            ): <label>Link is not valid or requested poll is closed</label>}


        </Container>
        )
}