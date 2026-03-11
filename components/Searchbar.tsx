"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchManufacturer from "./SearchManufacturer";
import SearchModel from "./SearchModel";
import { manufacturers } from "@/constants";

const SearchButton = ({ otherClasses }: { otherClasses: string }) => (
  <button type='submit' className={`-ml-3 z-10 ${otherClasses}`}>
    <Image
      src={"/magnifying-glass.svg"}
      alt={"magnifying glass"}
      width={40}
      height={40}
      className='object-contain'
    />
  </button>
);

const SearchBar = () => {
  const [manufacturer, setManuFacturer] = useState("");
  const [model, setModel] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const manufacturerFromUrl = searchParams.get("manufacturer") || "";
    const modelFromUrl = searchParams.get("model") || "";

    const matchedManufacturer = manufacturers.find(
      (item) => item.toLowerCase() === manufacturerFromUrl.toLowerCase()
    );

    setManuFacturer(matchedManufacturer || manufacturerFromUrl);
    setModel(modelFromUrl);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (manufacturer.trim() === "" && model.trim() === "") {
      return alert("Please provide some input");
    }

    updateSearchParams(model.toLowerCase(), manufacturer.toLowerCase());
  };

  // add details in URL ================
  const updateSearchParams = (model: string, manufacturer: string) => {
    // Create a new URLSearchParams object using the current URL search parameters
    const searchParams = new URLSearchParams(window.location.search);

    // Update or delete the 'model' search parameter based on the 'model' value
    if (model) {
      searchParams.set("model", model);
    } else {
      searchParams.delete("model");
    }

    // Update or delete the 'manufacturer' search parameter based on the 'manufacturer' value
    if (manufacturer) {
      searchParams.set("manufacturer", manufacturer);
    } else {
       searchParams.delete("manufacturer");
    }

    // Generate the new pathname with the updated search parameters
    const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

    router.push(newPathname, { scroll: false });
  };

  return (
    <form className='searchbar' onSubmit={handleSearch}>
      <div className='searchbar__item'>
        <SearchManufacturer
          manufacturer={manufacturer}
          setManuFacturer={setManuFacturer}
        />
        <SearchButton otherClasses='sm:hidden' />
      </div>
      {/* <div className='searchbar__item'>
        <SearchModel
          manufacturer={manufacturer}
          model={model}
          setModel={setModel}
        />
      </div> */}
      <SearchButton otherClasses='max-sm:hidden' />
    </form>
  );
};

export default SearchBar;
