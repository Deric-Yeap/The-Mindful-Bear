import React from "react";

function CoordinatesSearch() {
  return (
    <>
      <label htmlFor="coordinates" className="mt-8 text-stone-700">
        Coordinates
      </label>
      <div className="flex gap-5 justify-between self-stretch mt-4">
        <input
          type="text"
          id="coordinates"
          placeholder="1.273,1.273"
          className="px-4 pt-2.5 pb-5 text-black whitespace-nowrap rounded-3xl bg-zinc-300"
        />
        <button className="px-4 pt-2.5 pb-5 text-white rounded-3xl bg-stone-700">
          Search
        </button>
      </div>
    </>
  );
}

export default CoordinatesSearch;