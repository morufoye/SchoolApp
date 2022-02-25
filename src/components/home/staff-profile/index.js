import React from 'react'
import { UserIcon } from '@heroicons/react/outline'


const features = [
  {
    name: 'Ahamad Abolaji',
    role: 'Program Manager',
    imageSrc: 'Academic staff',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: UserIcon,
  },
  {
    name: 'Ademola Hammed (PhD)',
    role: 'Program Manager',
    imageSrc: 'Academic staff',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: UserIcon,
  },
  {
    name: 'Rasheed Mukaila',
    role: 'Academic staff',
    imageSrc: 'Academic staff',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: UserIcon,
  },
  {
    name: 'Umu Ubaidah',
    role: 'Academic staff',
    imageSrc: 'Academic staff',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: UserIcon,
  },
]

export default function StaffProfile() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-blue-900 sm:text-4xl">
            Our Team
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-2xl leading-6 font-medium text-gray-900">{feature.name}</p>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-600">{feature.role}</p>

                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
