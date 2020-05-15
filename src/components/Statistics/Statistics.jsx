import React,{useEffect, useState} from 'react'
import { Container, Card } from 'react-bootstrap'
import NavBar from '../../customControls/NavBar/NavBar'
import { Bar, Pie  } from "react-chartjs-2";
import { getOrders, getOrderItems } from '../../services/api.service';

export default function Statistics({history}){
    const [retaurantStatData, setRetaurantStatData] = useState({});
    const [userStatData, setUserStatData] = useState({});

    useEffect(() => {
        let restData = {
            labels: [],
            datasets: [
                {
                label: "Number of orders",
                data: [],
                backgroundColor: [
                    "rgba(255, 134,159,0.4)",
                    "rgba(98,  182, 239,0.4)",
                    "rgba(255, 218, 128,0.4)",
                    "rgba(113, 205, 205,0.4)",
                    "rgba(170, 128, 252,0.4)",
                    "rgba(255, 177, 101,0.4)"
                ],
                borderWidth: 2,
                borderColor: [
                    "rgba(255, 134, 159, 1)",
                    "rgba(98,  182, 239, 1)",
                    "rgba(255, 218, 128, 1)",
                    "rgba(113, 205, 205, 1)",
                    "rgba(170, 128, 252, 1)",
                    "rgba(255, 177, 101, 1)"
                ]
                }
            ]
        };
        
        let userRestData = {
            labels: [],
            datasets: [
                {
                label: "Meals ordered",
                data: [],
                backgroundColor: [
                    "rgba(255, 134,159,0.4)",
                    "rgba(98,  182, 239,0.4)",
                    "rgba(255, 218, 128,0.4)",
                    "rgba(113, 205, 205,0.4)",
                    "rgba(170, 128, 252,0.4)",
                    "rgba(255, 177, 101,0.4)"
                ],
                borderWidth: 2,
                borderColor: [
                    "rgba(255, 134, 159, 1)",
                    "rgba(98,  182, 239, 1)",
                    "rgba(255, 218, 128, 1)",
                    "rgba(113, 205, 205, 1)",
                    "rgba(170, 128, 252, 1)",
                    "rgba(255, 177, 101, 1)"
                ]
                }
            ]
        };
        

        getOrders(null, "inactive", 0, 50).then((res)=>{
            
            let mapOfRestaurantCounts = {};            
            res.data.data.forEach((order)=>{
                if(order.restaurantName){
                    if(mapOfRestaurantCounts[order.restaurantName]){
                        mapOfRestaurantCounts[order.restaurantName]++;
                    }
                    else{
                        mapOfRestaurantCounts[order.restaurantName]=1;
                    }
                }
            });
            let labels = [];
            let data = [];
            Object.entries(mapOfRestaurantCounts).forEach((restaurant)=>{
                labels.push(restaurant[0]);
                data.push(restaurant[1]);
            });
            restData.labels = labels;
            restData.datasets[0].data = data;
            setRetaurantStatData(restData);
        });

        getOrderItems(0,50).then((res)=>{
            let mapOfUserSpend = {};

            res.data.data.forEach((orderItem)=>{
                console.log(orderItem);
                if(orderItem.user){
                    if(mapOfUserSpend[orderItem.user]){
                        mapOfUserSpend[orderItem.user]+= parseInt(orderItem.quantity);
                    }
                    else{
                        mapOfUserSpend[orderItem.user] = parseInt(orderItem.quantity);
                    }   
                }
            });
            let labels = [];
            let data = [];
            Object.entries(mapOfUserSpend).forEach((user)=>{
                labels.push(user[0]);
                data.push(user[1]);
            });
            userRestData.labels = labels;
            userRestData.datasets[0].data = data;
            setUserStatData(userRestData);
        });


    }, []);



    return(
        <Container className="container-lg p-0">
            <NavBar history={history}/>
            <Card>
                <Card.Header>Top Restaurants</Card.Header>
                <Card.Body>
                    <Bar data={retaurantStatData} options={{ responsive: true,scales: {yAxes: [{ ticks: {beginAtZero: true, min: 0 } }]  }  }}  />
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>Meals ordered by user</Card.Header>
                <Card.Body>
                    <Pie data={userStatData} options={{ responsive: true }} />
                </Card.Body>
            </Card>


        </Container>


    )
}