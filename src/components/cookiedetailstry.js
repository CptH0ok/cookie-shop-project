'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import { useLocation } from 'react-router-dom';

export default function CookieDetailPage() {
  const location = useLocation();
  const { cookie } = location.state; // Get the cookie object from the state
  const [open, setOpen] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add logic to handle adding to cart with the selected quantity
    console.log(`Added ${quantity} ${cookie.name}(s) to cart.`);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                  <img alt={cookie.imageAlt} src={cookie.imageSrc} className="object-cover object-center" />
                </div>
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{cookie.name}</h2>
                  <p className="text-2xl text-gray-900">{cookie.price}</p>
                  
                  {/* Ingredients Section */}
                  <section aria-labelledby="ingredients-heading" className="mt-4">
                    <h3 id="ingredients-heading" className="text-lg font-medium text-gray-900">Ingredients</h3>
                    <p className="mt-1 text-gray-700">{cookie.ingredients}</p>
                  </section>

                  {/* Reviews */}
                  <div className="mt-6">
                    <h4 className="sr-only">Reviews</h4>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            aria-hidden="true"
                            className={classNames(
                              cookie.rating > rating ? 'text-gray-900' : 'text-gray-200',
                              'h-5 w-5 flex-shrink-0',
                            )}
                          />
                        ))}
                      </div>
                      <p className="sr-only">{cookie.rating} out of 5 stars</p>
                      <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        {cookie.reviewCount} reviews
                      </a>
                    </div>
                  </div>

                  {/* Quantity Selection */}
                  <section aria-labelledby="quantity-heading" className="mt-10">
                    <h3 id="quantity-heading" className="sr-only">Quantity</h3>
                    <div className="flex items-center mt-4">
                      <label htmlFor="quantity" className="mr-2 text-sm font-medium text-gray-900">Quantity:</label>
                      <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        className="border border-gray-300 rounded-md w-16 text-center"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add to Cart
                    </button>
                  </section>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}