import React from "react";

function InputField({ label, placeholder }) {
  return (
    <>
      <label htmlFor={label.toLowerCase().replace(/\s/g, '-')} className="text-stone-700">
        {label}
      </label>
      <input
        type="text"
        id={label.toLowerCase().replace(/\s/g, '-')}
        placeholder={placeholder}
        className="px-7 pt-3.5 pb-5 mt-5 max-w-full text-black rounded-3xl bg-zinc-300 w-[315px]"
      />
    </>
  );
}

export default InputField;