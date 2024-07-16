import { Menu, Transition } from "@headlessui/react";
export default function Popup({ children, menuList, align, size, others }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
        <Menu.Button>{children}</Menu.Button>
        <Transition
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
        <Menu.Items
          className={`bg-white flex flex-col absolute ${align} z-10 ${size} mt-2 p-1 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-slate-100`}
        >
          <div>{others}</div>
          {menuList.map((item, index) => {
            return (
              <Menu.Item key={index} className="p-2">
                {({ active }) => (
                  <div
                    onClick={item.function}
                    className={`${
                      active && "bg-slate-100 rounded-md "
                    } text-slate-800 flex items-center gap-1 cursor-pointer `}
                  >
                    {item.icon}
                    {item.name}
                  </div>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
