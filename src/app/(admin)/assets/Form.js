'use client';
import { useState } from "react";
import { postData, uploadImage } from "@/components/utils"
import useAssetsStore from "@/stores/assetsStore";
import { cls } from "@/components/utils";


export default function TokenizeAssetForm({onClose}) {

    const {  fetchAssets } = useAssetsStore();

   const defaultValue = {
        asset_name:"",
        category:"",
        token_symbol:"",
        description:"",
        token_icon:"",
        total_supply:"",
        destination_wallet:""
    }

    const [formData, setFormData] = useState(defaultValue);

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
        }));
    };    


    const subForm = async (e) => {
    e.preventDefault();
    // Check if all fields in formData are filled
    const missingFields = Object.entries(formData)
        .filter(([key, value]) => value === undefined || value === null || value === '')
        .map(([key]) => key);

    if (missingFields.length > 0) {
        alert(`Please fill all fields. Missing: ${missingFields.join(', ')}`);
        return;
    }

    // Submit form
    const result = await postData("/api/assets/add", formData);
    alert(JSON.stringify(result));
    fetchAssets();
    onClose();
    };



    return (
        
        <div className="w-full px-4 py-5 md:px-10 ">
            {/* Top Buttons */}
            
            {/* Form Fields */}
            <form className="space-y-2"  onSubmit={subForm}>



                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">Asset Name</label>
                    <input
                        type="text"
                        name="asset_name"
                        value={formData?.asset_name  ?? ''}
                        onChange={handleChange}
                        className={cls.input}  />  
                </div>

                
                
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">Token Symbol</label>
                    <input
                        type="text"
                        name="token_symbol"
                        value={formData?.token_symbol  ?? ''}
                        onChange={handleChange}                        
                        className={cls.input} />
                </div>



                {/* Upload Token Icon */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">Token Logo</label>
                    <label className="inline-block w-28 text-gray-700 text-center cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold transition">
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
                    {formData?.token_icon  ?? ''}
                </div>




                {/* Total Supply */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">Total Supply</label>
                    <input
                        type="text"
                        name="total_supply"
                        value={formData?.total_supply  ?? ''}
                        onChange={handleChange}                           
                        className={cls.input}  />
                </div>


                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData?.category  ?? ''}
                        onChange={handleChange}
                        className={cls.input}  />  
                </div>

                {/* Destination Wallet */}
                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">Destination Wallet (i.e DAO Multisig Wallet) </label>
                    <input
                        type="text"
                        name="destination_wallet"
                        value={formData?.destination_wallet  ?? ''}
                        onChange={handleChange}                           
                        className={cls.input} />
                </div>



                {/* Destination Wallet */}
                <div>
                    <label className="block mb-1 text-gray-700 text-sm font-semibold">Description</label>
                    <textarea
                        type="text"
                        name="description"
                        value={formData?.description  ?? ''}
                        onChange={handleChange}                           
                        className={cls.input+" h-22"} 
                    />
                </div>



                <hr />

                <div className="text-gray-400">This is only initialization, all fields should be update after initialization.</div>           
                <div className="text-right flex">
                    <div className="flex-1">
                        
                    </div>
                    <div>
                        <button className="font-bold bg-blue-600 text-white w-24 px-3 py-2 rounded">Initiate</button>
                    </div>
                </div>

            </form>
        </div>
    );
}
