import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis } from "victory";
import { axiosConfig } from "../axios/axiosConfig";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);

  const [dashboard1, setDashboard1] = useState({});
  const [dashboard2, setDashboard2] = useState({});
  const [dashboard3, setDashboard3] = useState({});
  const [dashboard4, setDashboard4] = useState({});

  const getAllDashboards = async () => {
    try {
      const [res1, res2, res3, res4] = await Promise.all([
        axiosConfig.get("/dashboard/dashboard-1"),
        axiosConfig.get("/dashboard/dashboard-2"),
        axiosConfig.get("/dashboard/dashboard-3"),
        axiosConfig.get("/dashboard/dashboard-4"),
      ]);
      console.log(res1, res2, res3, res4);
      setDashboard1(res1.data);
      setDashboard2(res2.data);
      setDashboard3(res3.data);
      setDashboard4(res4.data);
    } catch (error) {
      console.error("ERR::GET::DASHBOARD", error);
    }
  };

  useEffect(() => {
    getAllDashboards();
  }, []);
  return (
    <Layout>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-5  overflow-hidden">
          <div className="bg-white border rounded-lg  p-7">
            <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
              Total Containers - {dashboard1.total_count}
              <span className="cursor-pointer">
                {/* <RxChevronRight /> */}
              </span>
            </p>
            <div className=" items-center grid grid-cols-3 gap-4">
              <div className="flex flex-wrap gap-2 col-span-1">
                <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                  <span className="bg-[#56E776] rounded-full w-3 h-3"></span>
                  <p>At Manjushree</p>
                </div>

                <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                  <span className="bg-[#F88B3D] rounded-full w-3 h-3"></span>
                  <p>At Client</p>
                </div>
              </div>
              <div className="col-span-2">
                <VictoryPie
                  width={100}
                  height={100}
                  radius={28}
                  innerRadius={40}
                  colorScale={[
                    "#56E776",
                    "#F88B3D",
                    "#4185f2",
                    "#F4EE4D",
                    "#f5bf49",
                    "#91f549",
                  ]}
                  data={dashboard1?.location_wise_count?.map((item) => ({
                    y: item.count,
                    x: item.count,
                  }))}
                  style={{
                    labels: {
                      fontSize: 4, // Adjust this value to decrease the font size
                      fill: "#333", // Label color
                      fontFamily: "Arial", // Label font family
                      fontWeight: "bold", // Label font weight
                    },
                  }}
                  labelRadius={({ innerRadius }) => innerRadius + -7} // Adjust the 10 to your desired value
                />
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg  p-7">
            <p className="flex justify-between text-xl font-medium mb-4 text-slate-700">
              Containers at Manjushree - {dashboard2.total_count}
              <span className="cursor-pointer">
                {/* <RxChevronRight /> */}
              </span>
            </p>
            {loading ? (
              <div></div>
            ) : (
              <div className=" items-center grid grid-cols-3 gap-4">
                <div className="flex flex-wrap-reverse gap-2 col-span-1">
                  <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                    <span className="bg-[#56E776] rounded-full min-w-3 h-3"></span>
                    <p>Containers Filled with SKU</p>
                  </div>
                  <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                    <span className="bg-[#F88B3D] rounded-full min-w-3 h-3"></span>
                    <p>Containers into FG Store</p>
                  </div>
                  <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                    <span className="bg-[#4185f2] rounded-full min-w-3 h-3"></span>
                    <p>Containers into Production</p>
                  </div>
                  <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                    <span className="bg-[#F4EE4D] rounded-full min-w-3 h-3"></span>
                    <p>Containers out from FG Store</p>
                  </div>
                  <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                    <span className="bg-[#f5bf49] rounded-full min-w-3 h-3"></span>
                    <p>Containers out from Production</p>
                  </div>
                  <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                    <span className="bg-[#91f549] rounded-full min-w-3 h-3"></span>
                    <p>Empty Containers</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <VictoryPie
                    width={100}
                    height={100}
                    radius={50}
                    // innerRadius={40}
                    colorScale={[
                      "#56E776",
                      "#F88B3D",
                      "#4185f2",
                      "#F4EE4D",
                      "#f5bf49",
                      "#91f549",
                    ]}
                    data={dashboard2?.location_wise_count?.map((item) => ({
                      y: item.count,
                      x: item.count,
                    }))}
                    style={{
                      labels: {
                        fontSize: 4, // Adjust this value to decrease the font size
                        fill: "#333", // Label color
                        fontFamily: "Arial", // Label font family
                        fontWeight: "bold", // Label font weight
                      },
                    }}
                    labelRadius={({ innerRadius }) => innerRadius + 30} // Adjust the 10 to your desired value
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 max-h-fit overflow-hidden">
          <div className="bg-white border rounded-lg  p-7">
            <p className="flex gap-x-2 text-xl items-center font-medium mb-4 text-slate-700">
              Empty Container <span className="text-sm">(Category Wise)</span> -{" "}
              {dashboard3.total_count}
              <span className="cursor-pointer">
                {/* <RxChevronRight /> */}
              </span>
            </p>
            <div className=" items-center grid grid-cols-1 gap-4">
              <div className="">
                <VictoryChart domainPadding={20}>
                  <VictoryAxis
                    // Add your customization for the X-axis here
                    style={{
                      tickLabels: {
                        fontSize: 10,
                        padding: 5,
                        fontFamily: "Arial",
                        fontWeight: "bold",
                        fill: "#333",
                      },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    // Add your customization for the Y-axis here
                    style={{
                      tickLabels: {
                        fontSize: 10,
                        padding: 5,
                        fontFamily: "Arial",
                        fontWeight: "bold",
                        fill: "#333",
                      },
                    }}
                  />
                  <VictoryBar
                    data={dashboard3?.category_wise_count?.map((item) => ({
                      x: item.category_name,
                      y: item.count,
                    }))}
                    barWidth={20}
                    style={{
                      data: {
                        fill: ({ datum }) => {
                          const colors = [
                            "#56E776",
                            "#F88B3D",
                            "#4185f2",
                            "#F4EE4D",
                            "#f5bf49",
                            "#91f549",
                          ];
                          return colors[datum._x % colors.length];
                        },
                      },
                      labels: {
                        fontSize: 10,
                        fill: "#333",
                        fontFamily: "Arial",
                        fontWeight: "bold",
                      },
                      
                    }}
                  />
                </VictoryChart>
              </div>
              <div className="flex flex-wrap gap-2 ">
                <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                  <span className="bg-[#F88B3D] rounded-full w-3 h-3"></span>
                  <p>Steel Cage</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg  p-7">
            <p className="flex gap-x-2 items-center text-xl font-medium mb-4 text-slate-700">
              Empty Container <span className="text-sm">(Location Wise)</span> -{" "}
              {dashboard4.total_count}
              <span className="cursor-pointer">
                {/* <RxChevronRight /> */}
              </span>
            </p>
            {loading ? (
              <div></div>
            ) : (
              <div className=" items-center grid grid-cols-3 gap-4">
                <div className="flex flex-wrap gap-2 col-span-1">
                  <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                    <span className="bg-[#56E776] rounded-full min-w-3 h-3"></span>
                    <p>Containers into FG Store</p>
                  </div>
                  <div className="px-2 py-1 flex gap-2 items-center text-xs text-slate-500 border border-slate-200 w-fit rounded-full">
                    <span className="bg-[#F88B3D] rounded-full min-w-3 h-3"></span>
                    <p>Containers into Production</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <VictoryPie
                    width={100}
                    height={100}
                    radius={28}
                    innerRadius={40}
                    colorScale={[
                      "#56E776",
                      "#F88B3D",
                      "#4185f2",
                      "#F4EE4D",
                      "#f5bf49",
                      "#91f549",
                    ]}
                    data={dashboard4?.location_wise_count?.map((item) => ({
                      y: item.count,
                      x: item.count,
                    }))}
                    style={{
                      labels: {
                        fontSize: 4, // Adjust this value to decrease the font size
                        fill: "#333", // Label color
                        fontFamily: "Arial", // Label font family
                        fontWeight: "bold", // Label font weight
                      },
                    }}
                    labelRadius={({ innerRadius }) => innerRadius + -7} // Adjust the 10 to your desired value
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
