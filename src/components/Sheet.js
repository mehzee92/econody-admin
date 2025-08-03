import { title } from "process";

const Sheet=({children, show, title, onClose})=>
{

if(!show) { return <></> }

return (
    <div className="shadow-xl"  style={{
        height:"calc(100vh - 2px)",
        backgroundColor:"white",
        border:"solid 1px #00000029",
        position:"fixed",
        top:"0px",
        right:"0px",
        overflowY:"scroll"
    }}>
        <div className="px-3  pt-3 bg-gray-50 text-right flex" style={{borderBottom:"solid 1px #00000020"}}>
            <div className="flex  flex-wrap gap-4 mb-2">
                <h2 className="text-2xl px-3 py-2 font-bold">{title}</h2>
            </div>
            <div className="flex-1"></div>
            <div>
                <button className="font-bold bg-red-600 text-white px-5 py-1  rounded" onClick={onClose}>
                    X
                </button>
            </div>

        </div>   

        <div className="py-2">
            {children}
        </div>     
        

    </div>
);


}

export default Sheet;
