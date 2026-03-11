import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from "@/components"
import { HomeProps } from "@/types";
import { fetchCars } from "@/utils";
import { fuels, yearsOfProduction } from "@/constants";
import Image from "next/image";

export default async function Home({ searchParams }: HomeProps) {
  const limit = Number(searchParams.limit) || 8;

  const allCars = await fetchCars({
    manufacturer: searchParams.manufacturer || "",
    year: searchParams.year || "",
    fuel: searchParams.fuel || "",
    limit,
    model: searchParams.model || "",
  });
  

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
          <SearchBar />

          <div className='home__filter-container'>
            <CustomFilter title='fuel' options={fuels} />
            <CustomFilter title='year' options={yearsOfProduction} />
          </div>
        </div>

        {!isDataEmpty ? (
          <section>
            <div className='home__cars-wrapper'>
              {allCars?.map((car) => (
                <CarCard car={car} />
                // <>CarCard</>
              ))}
            </div>

            <ShowMore
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
            />
          </section>
        ) : (
          <div className='home__error-container'>
            <Image src='/Travel-Car-3D.webp' alt='no results' width={500} height={500} />
            <h2 className='text-black text-xl font-bold'>Sorry!! No Results Found.</h2>
          </div>
        )}
      </div>

    </main>
  );
}
