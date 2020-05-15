
export const getBaseUrl=()=>{
    const {href} = window.location;
    return href.slice(0,href.lastIndexOf('/')+1);
}

export const formatDateTime = (now) => {
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, -8);
}

export const getWinner=({votes, restaurants})=>{
    let winner = {
        restaurant: restaurants.find(rest=>votes[0].restaurantId === rest.id).name,
        votes:votes[0].votes,
        id: votes[0].restaurantId
    };
    votes.forEach(element=>{
        if(element.votes > winner.votes){
            winner.votes = element.votes;
            winner.restaurant =  restaurants.find(rest=>element.restaurantId === rest.id).name;
            winner.id = element.restaurantId;
        }

    });

    return winner;
}