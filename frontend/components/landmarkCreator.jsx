import React from "react";
import ImageUploader from "./imageUploader";
import InputField from "./inputField";
import CoordinatesSearch from "./coordinatesSearch";
import CreateLandmarkButton from "./createLandmarkButton";

function LandmarkCreator() {
  return (
    <main className="flex overflow-hidden flex-col text-base font-bold tracking-normal bg-stone-100 max-w-[360px] rounded-[40px]">
      <section className="flex relative flex-col px-4 pt-5 pb-2 w-full text-white aspect-[1.008]">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/2f19a5e5cddf537b91e09526a48a1002489fa8e5a5ca7d2945da441795267f42?placeholderIfAbsent=true&apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a" alt="" className="object-cover absolute inset-0 size-full" />
        <ImageUploader />
      </section>
      <section className="flex flex-col items-start px-4 mt-5 w-full">
        <InputField label="Landmark Name" placeholder="Landmark 2" />
        <CoordinatesSearch />
      </section>
      <CreateLandmarkButton />
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad9ae8111faf8e30927bac7abf64f00dc2ee2af5ed6d77408698f1274bebcf68?placeholderIfAbsent=true&apiKey=004e7e3501424a9a9c0fe2fe31f6ca4a" alt="" className="object-contain mt-16 w-full rounded-none aspect-[4.57]" />
    </main>
  );
}

export default LandmarkCreator;