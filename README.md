This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



<!-- ================================================================================================== -->

# car_showroom
 nextjs + react

<!-- API -->


<!-- npm -->

update node and npm ====> npm install npm@latest

npx create-next-app@latest ./
=> remove all files first from directory like readme
=> Would you like to use TypeScript? » Yes
=> Would you like to use ESLint? » No
=> Would you like to use Tailwind CSS? » Yes
=> Would you like to use `src/` directory? » No
=> Would you like to use App Router? (recommended) » Yes
=> Would you like to customize the default import alias? » No
................... process will start ...................

npm run dev

<!-- extra pakages -->
npm install @headlessui/react


<!-- Rapid Api -->
const url = 'https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=corolla';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': NEXT_PUBLIC_RAPID_API_KEY
        <!-- .env file -->

		'X-RapidAPI-Host': NEXT_PUBLIC_RAPID_API_HOST
        <!-- .env file -->
	}
};

<!-- image of cars -->
https://www.imagin.studio/car-image-api
NEXT_PUBLIC_IMAGIN_API_KEY='hrjavascript-mastery'


<!-- tailwind css -->
copy and paste code => .app/global.css
copy and paste code => tailwind.config.js
restart => npm run dev


<!-- Note -->
// by default in next js everything is server side component, to define it as client side we'll add this below line in the file
"use client";

// ts needs detail of variables type => types/index.js have the details of all the variables type

// we'll add navbar and footer section in app/layout file. where we can add title of the web page, favicon and other src/links/scripts.

// links from youtube
GitHub Code (give it a star ⭐): https://github.com/adrianhajdin/proje...
Public folder (assets): https://drive.google.com/file/d/1Ague...
GitHub Gist Code: https://gist.github.com/adrianhajdin/...
Next.js 13 Bug: https://github.com/vercel/next.js/iss...
Car images API: https://www.imagin.studio/car-image-api