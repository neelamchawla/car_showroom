import { CarProps, FilterProps } from "@/types";

export async function fetchCars(filters: FilterProps) {
  const { manufacturer = "", model = "", fuel = "" } = filters;
  const year = Number(filters.year);
  const hasYear = Number.isFinite(year) && year > 0;
  const limit = Number(filters.limit) || 8;

  const rapidApiKey =
    process.env.RAPID_API_KEY || process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
  const rapidApiHost =
    process.env.RAPID_API_HOST ||
    process.env.NEXT_PUBLIC_RAPID_API_HOST ||
    "car-api2.p.rapidapi.com";

  const useRapidApi = Boolean(rapidApiKey);

  const params = new URLSearchParams();
  if (hasYear) params.set("year", `${year}`);
  if (manufacturer) params.set("make", manufacturer);
  if (model) params.set("model", model);

  try {
    const requestTargets: { baseUrl: string; headers: HeadersInit }[] = [];

    if (useRapidApi) {
      requestTargets.push({
        baseUrl: `https://${rapidApiHost}`,
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": rapidApiHost,
        },
      });
    }

    // Always keep direct Car API as a fallback.
    requestTargets.push({ baseUrl: "https://carapi.app", headers: {} });

    let enginesData: any[] = [];
    let mileagesData: any[] = [];

    for (const target of requestTargets) {
      const [enginesResponse, mileagesResponse] = await Promise.all([
        fetch(`${target.baseUrl}/api/engines/v2?${params.toString()}`, {
          headers: target.headers,
        }),
        fetch(`${target.baseUrl}/api/mileages/v2?${params.toString()}`, {
          headers: target.headers,
        }),
      ]);

      const enginesPayload = await enginesResponse.json();
      const mileagesPayload = await mileagesResponse.json();

      const enginesList = Array.isArray(enginesPayload?.data)
        ? enginesPayload.data
        : [];
      const mileagesList = Array.isArray(mileagesPayload?.data)
        ? mileagesPayload.data
        : [];

      const notSubscribed =
        typeof enginesPayload?.message === "string" &&
        enginesPayload.message.toLowerCase().includes("not subscribed");

      if (!enginesResponse.ok || notSubscribed || enginesList.length === 0) {
        console.error("Car API request failed for source:", target.baseUrl, enginesPayload);
        continue;
      }

      enginesData = enginesList;
      mileagesData = mileagesList;
      break;
    }

    if (enginesData.length === 0) {
      return [];
    }

    const mileageByTrimId = new Map<number, any>(
      mileagesData.map((mileage: any) => [Number(mileage.trim_id), mileage])
    );

    const normalizedManufacturer = manufacturer.trim().toLowerCase();
    const normalizedModel = model.trim().toLowerCase();
    const normalizedFuel = fuel.toLowerCase();

    const filteredByQuery = enginesData.filter((engine: any) => {
      const engineMake = `${engine.make || ""}`.trim().toLowerCase();
      const engineModel = `${engine.model || ""}`.trim().toLowerCase();

      if (normalizedManufacturer && engineMake !== normalizedManufacturer) {
        return false;
      }

      if (
        normalizedModel &&
        !engineModel.includes(normalizedModel) &&
        !normalizedModel.includes(engineModel)
      ) {
        return false;
      }

      return true;
    });

    const filteredByFuel = filteredByQuery.filter((engine: any) => {
      if (!normalizedFuel) return true;

      const engineType = `${engine.engine_type || ""}`.toLowerCase();
      const fuelType = `${engine.fuel_type || ""}`.toLowerCase();

      if (normalizedFuel === "electricity" || normalizedFuel === "electric") {
        return engineType.includes("electric") || fuelType.includes("electric");
      }

      if (normalizedFuel === "gas") {
        return engineType.includes("gas") || fuelType.includes("unleaded");
      }

      return engineType.includes(normalizedFuel) || fuelType.includes(normalizedFuel);
    });

    const uniqueByModel = new Map<string, any>();
    for (const engine of filteredByFuel) {
      const modelKey = `${`${engine.make || manufacturer}`.trim().toLowerCase()}|${`${engine.model || model}`.trim().toLowerCase()}`;
      const existing = uniqueByModel.get(modelKey);

      // Prefer newer year rows as the representative card for each model.
      if (!existing || Number(engine.year) > Number(existing.year)) {
        uniqueByModel.set(modelKey, engine);
      }
    }

    return Array.from(uniqueByModel.values()).slice(0, limit).map((engine: any): CarProps => {
      const mileage = mileageByTrimId.get(Number(engine.trim_id));
      const cityMpg = Number(mileage?.epa_city_mpg ?? mileage?.combined_mpg ?? 25);
      const combinedMpg = Number(mileage?.combined_mpg ?? cityMpg);
      const highwayMpg = Number(mileage?.epa_highway_mpg ?? combinedMpg);

      return {
        city_mpg: cityMpg,
        class: engine.submodel || engine.trim || "N/A",
        combination_mpg: combinedMpg,
        cylinders: Number(engine.cylinders) || 0,
        displacement: Number(engine.size) || 0,
        drive: engine.drive_type || "N/A",
        fuel_type: engine.fuel_type || engine.engine_type || "N/A",
        highway_mpg: highwayMpg,
        make: engine.make || manufacturer,
        model: engine.model || model || "Unknown",
        transmission: engine.transmission || "N/A",
        year: Number(engine.year) || (hasYear ? year : new Date().getFullYear()),
      };
    });
  } catch (error) {
    console.error("Failed to fetch cars:", error);
    return [];
  }
}

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50; // Base rental price per day in dollars
  const mileageFactor = 0.1; // Additional rate per mile driven
  const ageFactor = 0.05; // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};

const deriveModelFamily = (model: string) => {
  const tokens = model
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) return model;

  // Tesla style names are "Model S/3/X/Y"; keep first two tokens.
  if (tokens[0].toLowerCase() === "model" && tokens[1]) {
    return `${tokens[0]} ${tokens[1]}`;
  }

  // Audi/BMW/Mercedes patterns generally map best to first token.
  return tokens[0];
};

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getImage");
  const { make, model, year, fuel_type } = car;
  const modelFamily = deriveModelFamily(model);
  const normalizedFuel = `${fuel_type || ""}`.toLowerCase();

  url.searchParams.append("customer", process.env.NEXT_PUBLIC_IMAGIN_API_KEY || "");
  url.searchParams.append("make", make);
  url.searchParams.append("modelFamily", modelFamily);
  url.searchParams.append("modelRange", model);
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", `${year}`);

  if (normalizedFuel.includes("electric")) {
    url.searchParams.append("powerTrain", "electric");
  }

  url.searchParams.append("angle", angle || "33");

  return `${url}`;
};

export const updateSearchParams = (type: string, value: string) => {
  // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search);

  // Set the specified search parameter to the given value
  searchParams.set(type, value);

  // Set the specified search parameter to the given value
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};

// =========================

export const deleteSearchParams = (type: string) => {
  // Set the specified search parameter to the given value
  const newSearchParams = new URLSearchParams(window.location.search);

  // Delete the specified search parameter
  newSearchParams.delete(type.toLocaleLowerCase());

  // Construct the updated URL pathname with the deleted search parameter
  const newPathname = `${window.location.pathname}?${newSearchParams.toString()}`;

  return newPathname;
};


