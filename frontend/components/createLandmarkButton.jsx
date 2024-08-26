import React from "react";

function CreateLandmarkButton() {
  return (
    <div className="flex gap-2.5 self-start mt-6 text-lg font-extrabold tracking-normal text-white">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/220c27ee1fdf24369b16b34af821d2848540c279ec31b6cac9663abae4b4b796?placeholderIfAbsent=true&apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a" alt="" className="object-contain shrink-0 aspect-[0.09] rounded-[61px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[7px]" />
      <div className="flex flex-col grow shrink-0 self-start pb-4 mt-1.5 basis-0 w-fit">
        <button className="flex justify-center items-center px-6 py-5 w-full bg-stone-700 min-h-[58px] rounded-[1000px]">
          <span className="gap-3 self-stretch my-auto">Create Landmark</span>
        </button>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f4efc84fa3233d769b8c36a6bfacbd9f264b9788b9bf61acb9cbe20942bffab?placeholderIfAbsent=true&apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a" alt="" className="object-contain z-10 self-end mt-0 mr-14 w-6 aspect-square" />
      </div>
    </div>
  );
}

export default CreateLandmarkButton;