"use client";

import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from "@/components"
// import { HomeProps } from "@/types";
import { fetchCars } from "@/utils";
import { fuels, yearsOfProduction } from "@/constants";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // serach states
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  // filter states
  const [year, setYear] = useState(2022);
  const [fuel, setFuel] = useState("");

  // pagination state
  const [limit, setLimit] = useState(10);
  const getCars = async () => {
    setLoading(true);

    try {
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: year || 2022,
        fuel: fuel || "",
        limit: limit || 8,
        model: model || "",
      });

      setAllCars(result);
    } catch (error) {
      console.error(error);      
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCars()
  }, [manufacturer, model, year, fuel, limit])

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  console.log(allCars);
  return (
    <main className='overflow-hidden'>
      <Hero />

      {/* Car Catalogue */}
      <div className='mt-12 padding-x padding-y max-width' id='discover'>
        <div className='home__text-container'>
          <h1 className='text-4xl font-extrabold'>Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>

        <div className='home__filters'>
          <SearchBar 
          setManufacturer={setManufacturer}
          setModel={setModel}
          />

          <div className='home__filter-container'>
            <CustomFilter title='fuel' options={fuels}
            setFilter={setFuel}
            />
            <CustomFilter title='year' options={yearsOfProduction} 
            setFilter={setYear}
            />
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className='home__cars-wrapper'>
              {allCars?.map((car) => (
                <CarCard car={car} />
                // <>CarCard</>
              ))}
            </div>

            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image 
                  src="/logo.svg"
                  alt="loader"
                  width={90}
                  height={90}
                  className="object-contain"
                /> &nbsp; loading.....
              </div>
            )}
            <ShowMore
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          <div className='home__error-container'>
            <h2 className='text-black text-xl font-bold'>Sorry!! No Results Found.</h2>
            {/* <p>{allCars?.message}</p> */}
          </div>
        )}
      </div>

    </main>
  );
}