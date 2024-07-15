import React from "react";
import favoritetwo from "./assets/favoritetwo.jpg";
import favorite from "./assets/favorite.jpg";

const accommodations = [
  {
    id: 1,
    image: favorite,
    name: "روستای علی آباد",
    price: "4,000,000 تومان",
  },
  {
    id: 2,
    image: favoritetwo,
    name: "روستای علی آباد",
    price: "4,000,000 تومان",
  },
];

const Favorites = () => {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="rounded-xl">
        <table className="w-full text-sm rtl:text-right text-gray-500">
          <thead className="hidden md:table-header-group text-xs text-gray-700 bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">تصویر</span>
              </th>
              <th scope="col" className="px-6 py-3">
                نام اقامتگاه
              </th>
              <th scope="col" className="px-6 py-3">
                قیمت
              </th>
              <th scope="col" className="px-6 py-3">
                دساقامتگاهات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accommodations.map((accommodation) => (
              <tr key={accommodation.id} className="bg-white hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={accommodation.image}
                    className="w-36 h-auto rounded-lg hidden sm:block"
                    alt={accommodation.name}
                  />
                </td>
                <td className="px-1 py-4 text-xs sm:text-sm  whitespace-nowrap text-gray-900">
                  {accommodation.name}
                </td>
                <td className="px-1 py-4 text-xs sm:text-sm  whitespace-nowrap text-gray-900">
                  {accommodation.price}
                </td>
                <td className="px-1 py-4 whitespace-nowrap">
                  <button href="#" className="text-red-600 ml-2 sm:ml-4">
                    حذف
                  </button>
                  <a
                    href="#"
                    className=" text-white bg-green-500 hover:bg-green-600 transition px-2 py-1 rounded-md shadow-md"
                  >
                    مشاهده
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Favorites;
