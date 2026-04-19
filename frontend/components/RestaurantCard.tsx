import { StarIcon, ClockIcon, FireIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

type Deal = {
  id: string;
  restaurant: string;
  discount: string;
  description: string;
  image: string;
  rating: number;
  time: string;
  category: string;
  isFeatured?: boolean;
};

export function RestaurantCard({ deal }: { deal: Deal }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:flex-shrink-0 relative h-48 w-full md:w-48">
          <Image
            className="h-full w-full object-cover"
            src={deal.image}
            alt={`${deal.restaurant} - ${deal.description}`}
            width={192}
            height={192}
            unoptimized // Remove this in production and handle image optimization properly
          />
          {deal.isFeatured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <FireIcon className="h-3 w-3 mr-1" />
              <span>Featured</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
            {deal.discount}
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{deal.restaurant}</h3>
              <div className="flex items-center bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {deal.category}
              </div>
            </div>
            
            <p className="mt-1 text-gray-600 dark:text-gray-300">{deal.description}</p>
            
            <div className="mt-3 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`h-5 w-5 flex-shrink-0 ${
                      rating < Math.floor(deal.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    aria-hidden="true"
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {deal.rating} ({Math.floor(Math.random() * 100) + 20} reviews)
                </span>
              </div>
              <div className="ml-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <ClockIcon className="h-4 w-4 mr-1" />
                {deal.time}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Deal
            </button>
            <button
              type="button"
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              aria-label="Save to favorites"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
