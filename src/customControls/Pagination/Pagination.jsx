import React from 'react'
import {Pagination} from 'react-bootstrap';

export default function CustomPagination({pages, active, setCurrentPage}){

    let items = [];

    let i = active === pages?(active-2): (active === 1?active:active-1);

    while(i<=active+1){
        if(i>0 && i<=pages){
            items.push(i);
        }
        i++;
    } 
    if(active ===1 && pages>2)items.push(i);



    return(
    <Pagination size="sm" className="mb-0">
        <Pagination.First disabled={active===1} onClick={()=>setCurrentPage(1)}/>
        <Pagination.Prev disabled={active===1} onClick={()=>setCurrentPage(active-1)} />

        {items.map(el=><Pagination.Item key={el} active={active===el} onClick={()=>setCurrentPage(el)}>{el}</Pagination.Item>)}

        <Pagination.Next disabled={active===pages} onClick={()=>setCurrentPage(active+1)} />
        <Pagination.Last disabled={active===pages}  onClick={()=>setCurrentPage(pages)}/>
    </Pagination>
    )
}