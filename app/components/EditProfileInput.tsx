import React from "react";
interface EditProfileInputProps {
    name:string;
    value:string;
    text: string;
    onChange: (value: string) => void;
}
function EditProfileInput({ name,value,text,onChange }: EditProfileInputProps) {
    return (
        <div className="flex lg:justify-center">
            <input className="rounded-xl bg-[#FFFFFF] border border-black w-12/12 lg:w-9/12 h-[50] py-1 px-5" type="text" id={name} name={name} value={value} placeholder={text} />
        </div>
    )
}
export default EditProfileInput;