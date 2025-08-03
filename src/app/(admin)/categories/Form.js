'use client';
import { useState } from "react";
import { postData, uploadImage } from "@/components/utils"
import useCategoriesStore from "@/stores/categories";
import { cls } from "@/components/utils";


export default function TokenizeAssetForm({onClose}) {

    const {  fetchCategories } = useCategoriesStore();

   const defaultValue = {
        name:"",
        icon:""
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
    const result = await postData("/api/categories/add", formData);
    alert(JSON.stringify(result));
    fetchCategories();
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
                        name="name"
                        value={formData.asset_name}
                        onChange={handleChange}
                        className={cls.input}  />  
                </div>




                {/* Upload Token Icon */}
                <div>
                    <label className="block mb-1 text-sm text-gray-700 font-semibold">Icon</label>
                    <label className="inline-block w-28 text-gray-700 text-center cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold transition">
                        Select File
                        <input
                            type="file"
                            onChange={async(e)=>{ 
                                const result = await uploadImage(e.target.files[0]);
                                setFormData((prev) => ({
                                ...prev,
                                ["icon"]:result.savedAs
                                }));
                            }}

                            className="hidden text-gray-700"
                        />
                        
                    </label>
                    {formData.icon}
                </div>

                <hr />

                <div className="text-right flex">
                    <div className="flex-1">
                        
                    </div>
                    <div>
                        <button className="font-bold bg-blue-600 text-white w-24 px-3 py-2 rounded">Save</button>
                    </div>
                </div>

            </form>
        </div>
    );
}
