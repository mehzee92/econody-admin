"use client";
import CreateForm from "./CreateForm";
import TokensTable from "./TokenTable";


export default function SubmitAssetForm() {


  return (
    <div className="w-full my-8 p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <TokensTable  />
        </div>
        <div className="w-full lg:w-96">
          <CreateForm />
        </div>
      </div>
    </div>
  );
}