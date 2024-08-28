import React from "react";
// import ImageUploader from "./imageUploader";
// import InputField from "./inputField";
// import CoordinatesSearch from "./coordinatesSearch";
// import CreateLandmarkButton from "./createLandmarkButton";
import ImageUploader from '../../components/imageUploader';
import InputField from '../../components/inputField';
import CoordinatesSearch from '../../components/coordinatesSearch';
import CreateLandmarkButton from '../../components/createLandmarkButton';

const LandmarkCreator= () =>{
  return (
    <main className="flex overflow-hidden flex-col text-base font-bold tracking-normal bg-stone-100 max-w-[360px] rounded-[40px]">
      <section className="flex relative flex-col px-4 pt-5 pb-2 w-full text-white aspect-[1.008]">
        
        <ImageUploader />
      </section>
      <section className="flex flex-col items-start px-4 mt-5 w-full">
        <InputField label="Landmark Name" placeholder="Landmark 2" />
        <CoordinatesSearch />
      </section>
      <CreateLandmarkButton />
      
    </main>
  );
}

export default LandmarkCreator;