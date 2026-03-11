"use client";

import Image from "next/image";
import { Fragment, useRef, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

import { manufacturerLogos, manufacturers } from "@/constants";
import { SearchManuFacturerProps } from "@/types";

const SearchManufacturer = ({ manufacturer, setManuFacturer }: SearchManuFacturerProps) => {

  const [query, setQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredManufacturers =
    query === ""
      ? manufacturers
      : manufacturers.filter((item) =>
        item
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""))
      );
  const selectedManufacturerLogo = manufacturerLogos[manufacturer] ?? "/car-logo.svg";

  return (
    <div className='search-manufacturer'>
      <Combobox value={manufacturer} onChange={setManuFacturer}>
        {({ open }) => (
          <div className='relative w-full'>
            {/* Button for the combobox. Click on the icon to see the complete dropdown */}
            <Combobox.Button ref={buttonRef} className='absolute top-[14px]'>
              <Image
                src={selectedManufacturerLogo}
                width={20}
                height={20}
                className='ml-4'
                alt={manufacturer ? `${manufacturer} logo` : 'car logo'}
              />
            </Combobox.Button>

            {/* Input field for searching */}
            <Combobox.Input
              className='search-manufacturer__input'
              displayValue={(item: string) => item}
              onChange={(event) => setQuery(event.target.value)} // Update the search query when the input changes
              onFocus={() => {
                if (!open) buttonRef.current?.click();
              }}
              onClick={() => {
                if (!open) buttonRef.current?.click();
              }}
              placeholder='Volkswagen...'
            />

            {/* Transition for displaying the options */}
            <Transition
              as={Fragment} // group multiple elements without introducing an additional DOM node i.e., <></>
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
              afterLeave={() => setQuery("")} // Reset the search query after the transition completes
            >
              <Combobox.Options className='search-manufacturer__options'>
                {
                  // ===== extra create lines
                  // filteredManufacturers.length === 0 && query !== "" ? (
                  //   <Combobox.Option
                  //     value={query}
                  //     className='search-manufacturer__option'
                  //   >
                  //     Create "{query}"
                  //   </Combobox.Option>
                  // ) : (
                  filteredManufacturers.map((item) => (
                    <Combobox.Option
                      key={item}
                      className={({ active }) =>
                        `relative search-manufacturer__option ${active ? "bg-primary-blue text-white" : "text-gray-900"
                        }`
                      }
                      value={item}
                    >
                      {
                        ({ selected, active }) => (
                          <>
                            <span className={`flex items-center gap-3 truncate ${selected ? "font-medium" : "font-normal"}`}>
                              <Image
                                src={manufacturerLogos[item] ?? "/car-logo.svg"}
                                width={20}
                                height={20}
                                alt={`${item} logo`}
                              />
                              {item}
                            </span>

                            {/* Show an active blue background color if the option is selected */}
                            {selected ? (
                              <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-pribg-primary-purple"}`}
                              ></span>
                            ) : null}
                          </>
                        )}
                    </Combobox.Option>
                  ))
                  // ) // ===== extra create lines
                }
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </Combobox>
    </div>
  );
};

export default SearchManufacturer;

// ================================================
// function SearchManufacturer() {
//   return (
//     <div>SearchManufacturer</div>
//   )
// }

// export default SearchManufacturer;
