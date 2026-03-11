"use client";

import Image from "next/image";
import { Combobox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";

import { SearchModelProps } from "@/types";

const SearchModel = ({ manufacturer, model, setModel }: SearchModelProps) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!manufacturer.trim()) {
      setOptions([]);
      setModel("");
      return;
    }

    setModel("");

    const controller = new AbortController();
    const fetchModels = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          make: manufacturer,
          sort: "name",
          direction: "asc",
        });
        const response = await fetch(`https://carapi.app/api/models/v2?${params.toString()}`, {
          signal: controller.signal,
        });
        const payload = await response.json();
        const modelNames = Array.isArray(payload?.data)
          ? payload.data
              .map((item: { name?: string }) => `${item?.name || ""}`.trim())
              .filter(Boolean)
          : [];
        setOptions([...new Set(modelNames)]);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setOptions([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
    return () => controller.abort();
  }, [manufacturer, setModel]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const normalizedQuery = query.toLowerCase().replace(/\s+/g, "");
    return options.filter((item) =>
      item.toLowerCase().replace(/\s+/g, "").includes(normalizedQuery)
    );
  }, [options, query]);

  return (
    <div className='search-manufacturer'>
      <Combobox value={model} onChange={setModel}>
        <div className='relative w-full'>
          <Combobox.Button className='absolute top-[14px]'>
            <Image
              src='/model-icon.png'
              width={20}
              height={20}
              className='ml-4'
              alt='car model'
            />
          </Combobox.Button>

          <Combobox.Input
            className='searchbar__input'
            displayValue={(item: string) => item}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={manufacturer ? "Select model..." : "Select manufacturer first..."}
            disabled={!manufacturer}
          />

          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className='search-manufacturer__options'>
              {isLoading ? (
                <Combobox.Option value='' disabled className='search-manufacturer__option text-gray-500'>
                  Loading models...
                </Combobox.Option>
              ) : filteredOptions.length === 0 ? (
                <Combobox.Option value='' disabled className='search-manufacturer__option text-gray-500'>
                  No models found
                </Combobox.Option>
              ) : (
                filteredOptions.map((item) => (
                  <Combobox.Option
                    key={item}
                    className={({ active }) =>
                      `relative search-manufacturer__option ${
                        active ? "bg-primary-blue text-white" : "text-gray-900"
                      }`
                    }
                    value={item}
                  >
                    {({ selected }) => (
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {item}
                      </span>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchModel;
