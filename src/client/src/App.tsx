
import { useState, useEffect } from 'react';
import {z} from "zod"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
 type ArticleData={
    title:string,
    place_of_origin:string,
    artist_display:string,
    inscriptions:string,
    date_start:number,
    date_end:number
 }

export default function App() {
     const [page,setpage]=useState<number>(1);
    const [rows,setrows]=useState<ArticleData[]>([]);
    const [first,setfirst]=useState<number>(1);
    const [last,setlast]=useState<number>(12);
     const [selectedRows, setSelectedRows] = useState<ArticleData[]>([]);
     const [loader,setloader]=useState<boolean>(true)
     const totalrecords=130023
    useEffect(()=>{
//setloader(true);
window.scrollTo(0,0);
        let fetchdata=async ()=>{
            let response=await fetch("https://api.artic.edu/api/v1/artworks?page="+page);
            let responseData=await response.json();
             
            console.log(responseData.data)
            const rowschema=z.object({ title:z.string().nullable(),
    place_of_origin:z.string().nullable(),
    artist_display:z.string().nullable(),
    inscriptions:z.string().nullable(),
    date_start:z.number().nullable(),
    date_end:z.number().nullable()
})
let arrayOfRowsSchema=z.array(rowschema)

let result2=arrayOfRowsSchema.parse(responseData.data)
console.log(result2);
result2=result2.map((curr,index)=>{
   if(!curr.date_start)
   {
    curr.date_start=-1
   }
   if(!curr.date_end)
   {
    curr.date_end=-1
   }
    if(!curr.inscriptions)
   {
    curr.inscriptions="N/A"
   }
   if(!curr.artist_display)
   {
    curr.artist_display="N/A"
   }
   if(!curr. place_of_origin)
   {
    curr. place_of_origin="N/A"
   }
   return curr  
})
let data:ArticleData[] =(result2) as ArticleData[]
//setloader(false)
setrows(data)
setfirst(12*(page-1)+1)
setlast(12*page)



        }
        fetchdata();

    },[page])

let currentPageReportTemplate=()=>{
    return(
        <p>Showing <b>{first}</b> to <b>{last}</b> of  <b>{totalrecords}</b> entries</p>
    )
}
let Navigation=()=>
{
    return(
        <div className={"flex gap-3"}>
           <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" onClick={()=>{
            if(page!=1)
            {
                setpage(prev=>prev-1)
            }
           }}>Previous</Button>
           <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" size="small" 
onClick={()=>{
            setpage(1)
}}>1</Button>
           <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" size="small" onClick={()=>{
            setpage(2)
           }}>2</Button>
           <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" size="small" 
onClick={()=>{
            setpage(3)
}}>3</Button>
           <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white"size="small" 
onClick={()=>{
            setpage(4)
}}>4</Button>
           <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white"size="small" 
onClick={()=>{
            setpage(5)
}}>5</Button>
            <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" onClick={()=>{
                setpage(prev=>prev+1)
            }}>Next</Button>
            
           

        </div>
    )
}
    return (
        <div className="card">
        <p className={"text-neutral-400"}>Selected : {selectedRows.length} rows</p>
         <DataTable value={rows}   paginator  rows={12}
            
                    
                     selectionMode="checkbox" selection={selectedRows} 
                    onSelectionChange={(e) => {
                        const rows = e.value as ArticleData[];
                        //localstorage.getItems
                                               setSelectedRows(rows);
                    }}
                    paginatorLeft={currentPageReportTemplate()}
                    paginatorRight={Navigation()}
                    paginatorTemplate=""

                    
                >
                      
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="title" header="TITLE" className={"!font-bold"}></Column>
                <Column field="place_of_origin" header="PLACE OF ORIGIN"></Column>
                <Column field="artist_display" header="ARTIST"></Column>
                <Column field="inscriptions" header="INSCRIPTIONS"></Column>
                <Column field="date_start" header="START DATE"></Column>
                <Column field="date_end" header="END DATE"></Column>
            </DataTable>
           
        </div>
    );
}
        





        