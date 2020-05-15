import axios from 'axios';


const baseURL = "https://sheltered-hamlet-56226.herokuapp.com/";
// const baseURLmain = "http://itbootcamp.westeurope.cloudapp.azure.com/";


//Restaurants

export const getRestaurants = (skip,limit)=> axios.get(baseURL+"restaurant?"+ (skip?"$skip="+skip:"")+(limit?"&$limit="+limit:""));

export const getRestaurantByID = id => axios.get(baseURL+"restaurant/"+id);



export const createPoll = poll => axios.post(baseURL+"poll", poll);

export const getPoll = id => axios.get(baseURL+"poll/"+id);

export const getPolls = (author, status, skip, limit) => axios.get(baseURL+"poll?" + (author?"author="+author:"") + "&status=" + status + "&$skip="+skip + "&$limit="+limit);

export const deletePoll = id => axios.delete(baseURL+"poll/"+id);

export const endPoll = id => axios.patch(baseURL+"poll/"+id,{status:"inactive"});



export const createVote = id => axios.post(baseURL + "vote", { restaurantId: id, votes: 0 });

export const getVote= id => axios.get(baseURL + "vote/" + id);

export const updateVote = (id,votes)=> axios.patch(baseURL+"vote/"+id,{votes});

export const createOrder = order => axios.post(baseURL+"order", order);

export const getOrder = id => axios.get(baseURL+"order/"+id);

export const getOrders = (author, status, skip, limit) => axios.get(baseURL+"order?" + (author?"author="+author:"") + "&status=" + status + "&$skip="+skip + "&$limit="+limit);

export const endOrder = id => axios.patch(baseURL+"order/"+id,{status:"inactive"});

export const getMealsFromRestaurant = restaurantId => axios.get(baseURL+"meal?available[$in]=true&$limit=999&restaurantId[$in]=" + restaurantId ); 

export const createOrderItem = orderItem => axios.post(baseURL+"order-item", orderItem);

export const getOrderItemsByOrderId = orderId => axios.get(baseURL+"order-item?$limit=999&orderId[$in]=" + orderId ); // query for exact id is not working, this shoud be changed

export const getOrderItems = (skip, limit) => axios.get(baseURL+"order-item?" + "$skip="+skip + "&$limit="+limit);