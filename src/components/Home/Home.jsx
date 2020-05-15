import React, { useEffect, useState } from 'react'
import {Container, Button, Card, InputGroup, FormControl} from'react-bootstrap';
import NavBar from '../../customControls/NavBar/NavBar';
import { getPolls, endPoll, deletePoll, createOrder, getOrders, endOrder , getOrderItemsByOrderId} from '../../services/api.service';
import { appStorage } from '../../services/appStorage.service';
import CustomPagination from '../../customControls/Pagination/Pagination';
import { getBaseUrl, getWinner, formatDateTime } from '../../utils/utils';
import Clipboard from 'clipboard';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const shownActivePolls = 3;
const shownInactivePolls = 3;
const shownActiveOrders = 3;
const shownInactiveOrders = 3;
let firstLoad = true;
let checker;

export default function Home({history}){
    const [activePolls, setActivePolls] = useState([]);
    const [numOfPagesActive, setNumOfPagesActive] = useState(1);
    const [currentPageActive, setCurrentPageActive] = useState(1);

    const [inactivePolls, setInactivePolls] = useState([]);
    const [numOfPagesInactive, setNumOfPagesInactive] = useState(1);
    const [currentPageInactive, setCurrentPageInactive] = useState(1);

    const [activeOrders, setActiveOrders] = useState([]);
    const [numOfPagesActiveOrd, setNumOfPagesActiveOrd] = useState(1);
    const [currentPageActiveOrd, setCurrentPageActiveOrd] = useState(1);

    const [inactiveOrders, setInactiveOrders] = useState([]);
    const [numOfPagesInactiveOrd, setNumOfPagesInactiveOrd] = useState(1);
    const [currentPageInactiveOrd, setCurrentPageInactiveOrd] = useState(1);




    var clipboard = new Clipboard('.copy-btn');

    
    useEffect(()=>{
        if(firstLoad){
            getPolls(appStorage.getAdmin(),"active",0, 100).then(res=>{
                let promises = []
                res.data.data.forEach(poll=>{
                    
                    if(new Date(poll.ends).getTime() <=new Date().getTime()){
                            promises.push(endPoll(poll.id))
                    }
                });
    
                
                Promise.all(promises).then(()=>{
                        LoadData();
                        firstLoad = false;
                                      
                })
    
            });
            
        }
        else{
            LoadData();
        }

        

    },[currentPageActive,currentPageInactive,currentPageActiveOrd,currentPageInactiveOrd])

    useEffect(()=>{
        checker = window.setTimeout(()=>pollChecker(),3000);  
        return () => {
            window.clearTimeout(checker);
          };
    },[activePolls])
   
    
    const pollChecker = ()=>{
        let promises = [];        
        activePolls.forEach(poll=>{
            if(new Date(poll.ends).getTime() <=new Date().getTime()){
                console.log("nasao");
                
                promises.push(endPoll(poll.id).then(res=>console.log("obrisao")
                ).catch(res=>console.log("ne valja")));
            }
        })
        Promise.all(promises).then(()=>LoadData())
    }

    const LoadData=()=>{
        
        getPolls(appStorage.getAdmin(),"active", Math.floor((currentPageActive-1)*shownActivePolls), shownActivePolls).then((res)=>{
            setActivePolls(res.data.data.map(el=>{el.winner = getWinner(el); return el}));
            const numOfPages = Math.ceil(res.data.total/shownActivePolls);
            setNumOfPagesActive(numOfPages);   
            if (currentPageActive>numOfPages){
                setCurrentPageActive(numOfPages); 
            }
            

        })
        getPolls(appStorage.getAdmin(),'inactive',Math.floor((currentPageInactive-1)*shownInactivePolls),shownInactivePolls).then((res)=>{
            setInactivePolls(res.data.data.map(el=>{el.winner = getWinner(el); return el}));
            const numOfPages = Math.ceil(res.data.total/shownInactivePolls);
            setNumOfPagesInactive(numOfPages); 
            if (currentPageInactive>numOfPages){
                setCurrentPageInactive(numOfPages);
            }     
        })

        getOrders(appStorage.getAdmin(),'active',Math.floor((currentPageActiveOrd-1)*shownActiveOrders),shownActiveOrders).then((res)=>{
            setActiveOrders(res.data.data);
            const numOfPages = Math.ceil(res.data.total/shownActiveOrders);
            setNumOfPagesActiveOrd(numOfPages); 
            if (currentPageActiveOrd>numOfPages){
                setCurrentPageActiveOrd(numOfPages);
            }     
        })

        getOrders(appStorage.getAdmin(),'inactive',Math.floor((currentPageInactiveOrd-1)*shownInactiveOrders),shownInactiveOrders).then((res)=>{
            setInactiveOrders(res.data.data);
            const numOfPages = Math.ceil(res.data.total/shownInactiveOrders);
            setNumOfPagesInactiveOrd(numOfPages); 
            if (currentPageInactiveOrd>numOfPages){
                setCurrentPageInactiveOrd(numOfPages);
            }     
        })

    }
    
    
    const handleEndPoll = (id)=>{

        endPoll(id).then(()=>LoadData());
    }
    const handleEndOrder = (id)=>{

        endOrder(id).then(()=>LoadData());
    }
    const handleDeletePoll = (id)=>{
        deletePoll(id).then(()=>LoadData());
    }

    const handleCreateOrder = (el)=>{
        let order = {
            author: appStorage.getAdmin(),
            date: formatDateTime(new Date()),
            status: "active",
            restaurantId: el.winner.id,
            restaurantName: el.winner.restaurant,
            pollName: el.label
        }
        createOrder(order).then(res=>{
                    const {id} = res.data;
                    if(id){
                        //uspesno kreiran order
                        console.log(id);
                    }
                    else{
                        console.log("error on creating poll");
                    }
                }).catch(err=>console.log(err));
    }
    
    const handleExportOrder = (el)=>{
        getOrderItemsByOrderId(el.id).then(res=>{
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';
            const ws = XLSX.utils.json_to_sheet(
                // ()=>{
                //     let tableObject = {}
                // }
                
                res.data.data);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(data, el.pollName + fileExtension);
        });
    }

    return(
        
        <Container className="container-lg p-0">
            <NavBar history={history}/>




            {/* Active polls */}

            <Card className="mt-4" >
                <Card.Header>Active polls:</Card.Header>
                <Card.Body className="d-flex justify-content-around flex-wrap">

                    {activePolls.map((el)=>

                        <Card key={el.id} style={{ minWidth: '300px', width:"350px"}} className="mb-3">


                        
                        <Card.Header>
                            {el.label}
                            <Button onClick={()=>{handleEndPoll(el.id)}} size="sm" style={{float:"right"}}>End Now</Button>
                        </Card.Header>

                        <Card.Body>
                            <Card.Text>End time: {new Date(el.ends).toLocaleString()}</Card.Text>
                            <Card.Text>Currently winning: {el.winner.restaurant}</Card.Text>
                            <Card.Text>Votes: {el.winner.votes}</Card.Text>

                            <InputGroup>
                                    <FormControl id={"foo"+el.id}
                                    
                                    placeholder="Link"
                                    readOnly
                                    value= {getBaseUrl()+"poll/"+el.id}
                                    />
                                    <InputGroup.Append >
                                    <Button className="copy-btn" data-clipboard-target={"#foo"+el.id} variant="outline-primary">Copy</Button>
                                    <Button variant="outline-primary" onClick={()=>{window.open(getBaseUrl()+"poll/"+el.id,'_blank')}}>Open</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            
                            
                        </Card.Body>
                        </Card>)}

                {numOfPagesActive>1? 
                (<InputGroup className='justify-content-center'>
                   <CustomPagination pages={numOfPagesActive} active={currentPageActive} setCurrentPage={setCurrentPageActive} />
                </InputGroup>):null}
                </Card.Body>
            </Card>


            {/* Closed poles */}

            <Card className="mt-4" >
                <Card.Header>Closed polls:</Card.Header>
                <Card.Body className="d-flex justify-content-around flex-wrap">

                    {inactivePolls.map((el)=>

                        <Card key={el.id} style={{ minWidth: '300px', width:"350px"}} className="mb-3">


                        
                        <Card.Header>
                            {el.label}
                            <Button onClick={()=>{}} size="sm" variant='danger' style={{float:"right"}}>Delete</Button>
                            <Button onClick={()=>{handleCreateOrder(el)}} size="sm" variant='success' style={{float:"right", marginRight:"8px"}}>Create Order</Button>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>Created: {new Date(el.date).toLocaleString()}</Card.Text>
                            <Card.Text>Ended: {new Date(el.ends).toLocaleString()}</Card.Text>
                            <Card.Text>Winner: {el.winner.restaurant}</Card.Text>
                            <Card.Text>Votes: {el.winner.votes}</Card.Text>
                            
                        </Card.Body>
                        </Card>)}

                {numOfPagesInactive>1? 
                (<InputGroup className='justify-content-center'>
                   <CustomPagination pages={numOfPagesInactive} active={currentPageInactive} setCurrentPage={setCurrentPageInactive} />
                </InputGroup>):null}
                </Card.Body>
            </Card>


            {/* Active orders */}

             <Card className="mt-4" >
                <Card.Header>Orders:</Card.Header>
                <Card.Body className="d-flex justify-content-around flex-wrap">

                    {activeOrders.map((el)=>

                        <Card key={el.id} style={{ minWidth: '300px', width:"350px"}} className="mb-3">


                        
                        <Card.Header>
                            {el.pollName}
                            <Button onClick={()=>{handleEndOrder(el.id)}} size="sm" variant='primary' style={{float:"right"}}>Finalize order</Button>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>Created: {new Date(el.date).toLocaleString()}</Card.Text>
                            <Card.Text>Winner: {el.restaurantName}</Card.Text>
                            <InputGroup>
                                <FormControl id={"fooOrder"+el.id}
                                
                                placeholder="Link"
                                readOnly
                                value= {getBaseUrl()+"order/"+el.id}
                                />
                                <InputGroup.Append >
                                <Button className="copy-btn" data-clipboard-target={"#fooOrder"+el.id} variant="outline-primary">Copy</Button>
                                <Button variant="outline-primary" onClick={()=>{window.open(getBaseUrl()+"order/"+el.id,'_blank')}}>Open</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Card.Body>
                        </Card>)}

                {numOfPagesActiveOrd>1? 
                (<InputGroup className='justify-content-center'>
                   <CustomPagination pages={numOfPagesActiveOrd} active={currentPageActiveOrd} setCurrentPage={setCurrentPageActiveOrd} />
                </InputGroup>):null}
                </Card.Body>
            </Card> 
            

            {/* Closed orders */}
            <Card className="mt-4" >
                <Card.Header>Finished orders:</Card.Header>
                <Card.Body className="d-flex justify-content-around flex-wrap">

                    {inactiveOrders.map((el)=>

                        <Card key={el.id} style={{ minWidth: '300px', width:"350px"}} className="mb-3">


                        
                        <Card.Header>
                            {el.pollName}
                            <Button onClick={()=>{}} size="sm" variant='danger' style={{float:"right"}}>Delete</Button>
                            <Button onClick={()=>{handleExportOrder(el)}} size="sm" variant='success' style={{float:"right", marginRight:"8px"}}>Export order</Button>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>Created: {new Date(el.date).toLocaleString()}</Card.Text>
                            <Card.Text>Winner: {el.restaurantName}</Card.Text>
                            
                        </Card.Body>
                        </Card>)}

                {numOfPagesInactiveOrd>1? 
                (<InputGroup className='justify-content-center'>
                   <CustomPagination pages={numOfPagesInactiveOrd} active={currentPageInactiveOrd} setCurrentPage={setCurrentPageInactiveOrd} />
                </InputGroup>):null}
                </Card.Body>
            </Card> 
            
        </Container>


    )
}