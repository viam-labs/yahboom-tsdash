/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import React, { FC, useEffect, useState, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Card, LineChart, Metric, Title } from "@tremor/react";

import {
  ChartBarIcon,
  BellIcon,
  XIcon,
  MenuIcon,
} from "@heroicons/react/outline";
import Box from "./Box";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardPage() {
  async function fetchData() {
    const response = await fetch(process.env.REACT_APP_PYTHON_HTTP_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date_start: "2023-07-26 00:00:00",
        date_end: "2023-07-28 00:00:00",
        component_name: "wifi-sensor",
      }),
    });

    // Recommendation: handle errors
    if (!response.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  }

  interface FakeHistoricalData {
    timestamp: string;
    linkReading: string;
    levelReading: string;
    noiseReading: string;
  }

  const [data, setData] = useState<FakeHistoricalData[]>();

  interface InputReadingsArray {
    ReadingName: string;
    Reading: string;
  }

  function parseReadings(readingsArray: InputReadingsArray[]) {
    const readings: Record<string, string> = {};

    readingsArray.forEach((readingObj) => {
      // Capitalize the reading names
      const readingName =
        readingObj.ReadingName.charAt(0).toUpperCase() +
        readingObj.ReadingName.slice(1) +
        " Reading";
      readings[readingName] = readingObj.Reading;
    });

    return readings;
  }

  useEffect(() => {
    fetchData().then((data) => {
      let initialTimestamp = new Date();
      let interval = 100000; // 1 second

      let flattenedData: any[] = []; // Replace any with your appropriate interface
      //@ts-ignore
      data.forEach((item) => {
        const readings = parseReadings(item.Readings);
        let readingTimestamp = new Date(initialTimestamp.getTime());

        flattenedData.push({
          timestamp: readingTimestamp.toISOString(),
          ...readings,
        });

        initialTimestamp = new Date(initialTimestamp.getTime() + interval);
      });

      console.log("flattenedData");
      console.log(flattenedData);
      setData(flattenedData);
    });
  }, []);
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <div className="pb-32">
          <Disclosure
            as="nav"
            className="border-b border-indigo-300 border-opacity-25 lg:border-none"
          >
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between lg:border-b  lg:border-opacity-25">
                    <div className="flex items-center px-2 lg:px-0">
                      <div className="flex-shrink-0">
                        <img
                          className="block h-8 w-8"
                          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
                          alt="Your Company"
                        />
                      </div>
                      <div className="hidden lg:ml-10 lg:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "text-black"
                                  : "text-black hover:bg-gray-500 hover:bg-opacity-25",
                                "rounded-md py-2 px-3 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-200 p-2 text-gray-500 hover:bg-gray-300  hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="hidden lg:ml-4 lg:block">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="relative flex-shrink-0 rounded-full bg-gray-200 p-1 text-gray-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 "
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3 flex-shrink-0">
                          <div>
                            <Menu.Button className="relative flex rounded-full bg-gray-200 text-sm text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 rounded-full"
                                src={user.imageUrl}
                                alt=""
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="lg:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-200 text-black"
                            : "text-black hover:bg-gray-500 hover:text-gray-100",
                          "block rounded-md py-2 px-3 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className="border-t border-indigo-700 pb-3 pt-4">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-black">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium text-gray-400">
                          {user.email}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="relative ml-auto flex-shrink-0 rounded-full bg-gray-200 p-1 text-gray-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-black hover:bg-opacity-75"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Your Dashboard
              </h1>
            </div>
          </header>
        </div>

        <main className="-mt-32 bg-slate-100">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="h-full w-full p-8 rounded-md bg-[#F4F4F4] border-2 border-gray-200 shadow-sm">
              <div className="flex flex-col space-y-8">
                <div className="flex w-full items-center justify-between space-x-4">
                  <Card>
                    <Title>Average Link Reading</Title>
                    <Metric>56</Metric>
                  </Card>
                  <Card>
                    <Title>Average Level Reading</Title>
                    <Metric>-53</Metric>
                  </Card>
                  <Card>
                    <Title>Average Noise Reading</Title>
                    <Metric>-256</Metric>
                  </Card>
                </div>

                {data && (
                  <Card>
                    <Title>Wifi Sensor Data</Title>
                    <LineChart
                      className="mt-6"
                      data={data}
                      index="timestamp"
                      categories={[
                        "Level Reading",
                        "Link Reading",
                        "Noise Reading",
                      ]}
                      colors={["emerald", "blue", "orange"]}
                      // valueFormatter={dataFormatter}
                      yAxisWidth={40}
                    />
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
