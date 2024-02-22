import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  return (
    <div className="p-10 flex flex-col items-center ">
      <h1 className="text-2xl text-blue-700">Welcome to Remix (SPA Mode)</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/future/spa-mode"
            rel="noreferrer"
          >
            SPA Mode Guide
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">A Starter Repo for your SPA</h2>
              <p>
                <a className='underline text-blue-400' href='https://github.com/ugmurthy/remix-spa' rel="noreferer"> Repo </a>
                is preconfigured to use 
                <a className='underline text-blue-400' href='https://tailwindcss.com/' rel="noreferer"> tailwindcss</a> and 
                <a className="underline text-blue-400" href="https://daisyui.com/" rel="noreferer"> daisyUI</a>
              </p>
          </div>
          <figure><img src="https://remix.run/img/og.1.jpg" alt="REMIX" /></figure>
      </div>
      
    </div>
  );
}
