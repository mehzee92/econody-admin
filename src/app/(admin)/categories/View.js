'use client';
import { useState } from "react";
import { apiUrl, postData, uploadImage } from "@/components/utils"
import useCategoriesStore from "@/stores/categories";
import { cls } from "@/components/utils";



const ShowLink=({link})=>{
    return (<>
        {
            link && link.length>5  ? 
            (<a target="_blank" href={apiUrl+"/uploads/"+link} className="px-2 text-blue-700">{link}</a>) 
            : (<span className="px-2 text-red-700">Document Required</span>)
        }
    </>)
}


export default function TokenizeAssetForm({onClose, asset}) {

  const {  fetchCategories } = useCategoriesStore();

    const [formData, setFormData] = useState(asset);

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
        }));
    };   
    
    const setValue=(key, value)=> {
        setFormData((prev) => ({
        ...prev,
        [key]:value
        }));        
    }

    const updateCategory = async(e) => {
        e.preventDefault();
        const result = await postData("/api/categories/update", formData);
        alert(JSON.stringify(result));
        fetchCategories();
        onClose();
    };   
    
    
    const deleteCategory = async(e) => {
        e.preventDefault();
        const b = confirm("Do you really want to delete this asset ? ");
        if(!b) { return; }
        const result = await postData("/api/categories/delete", formData);
        alert(JSON.stringify(result));
        fetchCategories();
        onClose();
    }; 


    return (
        
        <div className="w-full px-4 py-5 md:px-10 ">
            {/* Form Fields */}
            <form className="space-y-2">
                {/* Asset Name */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">Asset Name</label>
                    <input
                        type="text"
                        name="asset_name"
                        value={formData.asset_name}
                        onChange={handleChange}
                        className={cls.input}
                    />  
                </div>

                {/* Token Symbol */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">Token Symbol</label>
                    <input
                        type="text"
                        name="token_symbol"
                        value={formData.token_symbol}
                        onChange={handleChange}                        
                        className={cls.input}
                    />
                </div>


                {/* Upload Token Icon */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">
                        Asset Logo
                        <span className="italic text-xs text-gray-500 px-2">(i.e PNG)</span>
                    </label>
                    <label className={cls.label}>
                        Select File
                        <input
                            type="file"
                            onChange={async(e)=>{ 
                                const result = await uploadImage(e.target.files[0]);
                                setFormData((prev) => ({
                                ...prev,
                                ["token_icon"]:result.savedAs
                                }));
                            }}

                            className="hidden text-gray-700"
                        />
                        
                    </label>
                    <ShowLink link={formData.token_icon} />
                </div>




                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">
                        Thumbnail
                        <span className="italic text-xs text-gray-500 px-2">(i.e PNG)</span>
                    </label>
                    <label className={cls.label}>
                        Select File
                        <input
                            type="file"
                            onChange={async(e)=>{ 
                                const result = await uploadImage(e.target.files[0]);
                                setFormData((prev) => ({
                                ...prev,
                                ["thumbnail"]:result.savedAs
                                }));
                            }}

                            className="hidden text-gray-700"
                        />
                        
                    </label>
                    <ShowLink link={formData.token_icon} />
                    
                </div>
                <p className="text-gray-400">For marketplace card.</p>


                {/* Total Supply */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">Total Supply</label>
                    <input
                        type="text"
                        name="total_supply"
                        value={formData.total_supply}
                        onChange={handleChange}                           
                        className={cls.input}
                    />
                </div>



                {/* Destination Wallet */}
                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">Destination Wallet</label>
                    <input
                        type="text"
                        name="destination_wallet"
                        value={formData.destination_wallet}
                        onChange={handleChange}                           
                        className={cls.input}
                    />
                </div>





                {/* Upload Documents */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">
                        Tokenization Whitepaper
                        <span className="italic text-xs text-gray-500 px-2">(i.e PDF)</span>
                    </label>
                    <label className={cls.label}>
                        Select Files
                        <input
                            type="file"
                            onChange={async(e)=>{ 
                                const result = await uploadImage(e.target.files[0]);
                                setFormData((prev) => ({
                                ...prev,
                                ["tokenization_whitepaper"]:result.savedAs
                                }));
                            }}
                            className="hidden text-gray-700"
                        />
                    </label>

                    <ShowLink link={formData.tokenization_whitepaper} />

                </div>


                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">
                        Asset Legal Ownership Declaration 
                        <span className="italic text-xs text-gray-500 px-2">(i.e PDF)</span>
                    </label>
                    <label className={cls.label}>
                        Select Files
                        <input
                            type="file"
                            onChange={async(e)=>{ 
                                const result = await uploadImage(e.target.files[0]);
                                setFormData((prev) => ({
                                ...prev,
                                ["ownership_declaration"]:result.savedAs
                                }));
                            }}
                            className="hidden text-gray-700"
                        />
                    </label>

                    <ShowLink link={formData.ownership_declaration} />







                </div>



                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">
                        Default, Dispute and Liquidition Agreement 
                        <span className="italic text-xs text-gray-500 px-2">(i.e PDF)</span>
                    </label>
                    <label className={cls.label}>
                        Select Files
                        <input
                            type="file"
                            onChange={async(e)=>{ 
                                const result = await uploadImage(e.target.files[0]);
                                setFormData((prev) => ({
                                ...prev,
                                ["ddl_agreement"]:result.savedAs
                                }));
                            }}
                            className="hidden text-gray-700"
                        />
                    </label>

                    <ShowLink link={formData.ddl_agreement} />

                </div>



                {/* Revenue Distribution */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">
                        Revenue Distribution Policy 
                        <span className="italic text-xs text-gray-500 px-2">(i.e PDF)</span>
                    </label>
                    <label className={cls.label}>
                        Select 
                        <input
                            type="file"
                            onChange={async(e)=>{ 
                                const result = await uploadImage(e.target.files[0]);
                                setFormData((prev) => ({
                                ...prev,
                                ["revenue_distribution"]:result.savedAs
                                }));
                            }}
                            className="hidden text-gray-700"
                        />
                    </label>
                    
                    <ShowLink link={formData.revenue_distribution} />


                </div>



                {/* Revenue Distribution */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">
                        Buyback Policy 
                        <span className="italic text-xs text-gray-500 px-2">(i.e PDF)</span>
                    </label>
                    <label className={cls.label}>
                        Select 
                        <input
                            type="file"
                            onChange={async(e)=>{ 
                                const result = await uploadImage(e.target.files[0]);
                                setFormData((prev) => ({
                                ...prev,
                                ["buyback_policy"]:result.savedAs
                                }));
                            }}
                            className="hidden text-gray-700"
                        />
                    </label>
                    
                    <ShowLink link={formData.buyback_policy} />

                </div>



                {/* Listing Title */}
                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">Listing Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}                           
                        className={cls.input}
                    />
                </div>
                <p className="text-gray-400">Will be appear in the marketplace card below asset name.</p>


                {/* Destination Wallet */}
                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">Description</label>
                    <textarea
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}                           
                        className={cls.input+" h-36"}
                    />
                </div>


                {/* Destination Wallet */}
                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">
                        Tags (For SEO Purpose)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags || ""}
                        onChange={handleChange}                           
                        className={cls.input}
                    />
                    <p className="text-gray-400">A Comma seperated list</p>
                </div>    



                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">
                        Issuer Entity
                    </label>
                    <input
                        type="text"
                        name="issuer_entity"
                        value={formData.issuer_entity || ""}
                        onChange={handleChange}                           
                        className={cls.input}
                    />
                    <p className="text-gray-400">Name with complete description</p>
                </div>    



                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">
                        Token Explorer URL
                    </label>
                    <input
                        type="text"
                        name="explorer_url"
                        value={formData.explorer_url || ""}
                        onChange={handleChange}                           
                        className={cls.input}
                    />
                    <p className="text-gray-400">Blockchain explorer url of the token contract deployed.</p>
                </div>  


                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">
                        Legal Owner
                    </label>
                    <input
                        type="text"
                        name="legal_owner"
                        value={formData.legal_owner || ""}
                        onChange={handleChange}                           
                        className={cls.input}
                    />
                    <p className="text-gray-400">The person or organization that legally owns the real-world asset.</p>
                </div>  



                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">
                        Jurisdiction
                    </label>
                    <input
                        type="text"
                        name="jurisdiction"
                        value={formData.jurisdiction || ""}
                        onChange={handleChange}                           
                        className={cls.input}
                    />
                    <p className="text-gray-400">The place where the laws come from.</p>
                </div> 


                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">
                        Status
                    </label>
                    <input
                        type="text"
                        name="status"
                        value={formData.status || ""}    
                        onChange={()=>{}}                          
                        className={cls.input}
                    />

                    Mark as : 
                    <span className="text-blue-800 px-3 cursor-pointer" onClick={()=>setValue('status', "init")}>Initiated</span>
                    <span className="text-blue-800 px-3 cursor-pointer" onClick={()=>setValue('status', "active")}>Active</span>
                    <span className="text-blue-800 px-3 cursor-pointer" onClick={()=>setValue('status', "block")}>Blocked</span>
                </div>  

                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">
                        Is Listed on Marketplace
                    </label>
                    <input
                        type="text"
                        name="status"
                        value={formData.is_listed ? "Listed" : "Delisted"}  
                        onChange={()=>{}}                           
                        className={cls.input}
                    />
                    <span className="text-blue-800 px-3 cursor-pointer" onClick={()=>setValue('is_listed', 1)}>List Now</span>
                    <span className="text-blue-800 px-3 cursor-pointer" onClick={()=>setValue('is_listed', 0)}>Delist Now</span>
                </div>  

                <hr />
                
                <p>Please activate and list on marketplace after following process.</p>
                <p className="text-blue-600 py-3 mb-3">
                    RWA → Legal Owner → Legal Agreement → Legal Entity → Token → Investors
                </p>                
                
                <div className="text-right flex">
                    <div className="flex-1">
                    </div>
                    <div>
                        <button onClick={updateCategory} className="font-bold bg-blue-600 text-white px-3 w-36 py-2 mx-2 rounded">Update</button>
                        <button onClick={deleteCategory} className="font-bold bg-red-600 text-white px-3 w-36 py-2 mx-2 rounded">Delete</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

