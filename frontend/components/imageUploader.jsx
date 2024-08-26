import React from "react";

function ImageUploader() {
  return (
    <>
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd0b4540da48202ff0fa92817d729d71150342dccef6d493139d52889c605ff3?placeholderIfAbsent=true&apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a" alt="Landmark preview" className="object-contain aspect-[16.39] rounded-[60px] w-[328px]" />
      <button className="relative self-end px-3.5 py-1 mt-72 rounded-3xl bg-stone-700">
        Upload Image
      </button>
    </>
  );
}

export default ImageUploader;