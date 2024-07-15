import React from 'react';

const accommodations = [
  {
    id: 1,
    image: './assets/image/productSlider/2.jpg',
    name: 'روستای علی آباد',
    price: '4,000,000 تومان',
  },
  {
    id: 2,
    image: './assets/image/productSlider/4.jpg',
    name: 'روستای علی آباد',
    price: '4,000,000 تومان',
  },
];

const Favorites = () => {
  return (
    <div className="md:w-8/12 lg:w-9/12">
      <div className="rounded-xl">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="hidden md:table-header-group text-xs text-gray-700 bg-gray-50">
            <tr>
              <th scope="col" className="px-16 py-3">
                <span className="sr-only">تصویر</span>
              </th>
              <th scope="col" className="md:pr-6 py-3">
                نام اقامتگاه
              </th>
              <th scope="col" className="px-6 py-3">
                قیمت
              </th>
              <th scope="col" className="px-4 py-3">
                دساقامتگاهات
              </th>
            </tr>
          </thead>
          <tbody className="grid grid-cols-1 sm:grid-cols-2 md:contents gap-5">
            {accommodations.map((accommodation) => (
              <tr
                key={accommodation.id}
                className="bg-white border-b hover:bg-gray-50 grid grid-cols-1 justify-items-center md:table-row"
              >
                <td className="p-4">
                  <img
                    src={accommodation.image}
                    className="w-48 md:w-32 max-w-full max-h-full rounded-lg"
                    alt=""
                  />
                </td>
                <td className="md:pr-6 py-4 text-sm opacity-90 text-gray-900">
                  {accommodation.name}
                </td>
                <td className="px-6 py-4 text-sm opacity-90 text-gray-900">
                  {accommodation.price}
                </td>
                <td className="px-2 py-4">
                  <a href="#" className="text-red-600">
                    حذف
                  </a>
                  <a
                    href="#"
                    className="text-white bg-green-500 hover:bg-green-600 transition px-2 py-1 shadow-lg rounded-md mr-3"
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
