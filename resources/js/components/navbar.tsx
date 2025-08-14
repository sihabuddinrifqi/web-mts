import React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';

const navigation = [
  { name: 'Berita', href: '/berita' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Kontak', href: '/kontak' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { url, props } = usePage();
  const profilMenu = (props.profil_menu || []) as { id: number; Judul: string; slug: string }[];

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-emerald-700 shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-19 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-emerald-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Buka menu utama</span>
                  {open ? (
                    <XMarkIcon aria-hidden="true" className="block size-6" />
                  ) : (
                    <Bars3Icon aria-hidden="true" className="block size-6" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Link href="/" className="flex shrink-0 items-center space-x-3">
                  <img alt="Logo MTs" src="logo.png" className="h-12 w-auto" />
                  <span className="hidden md:block font-extrabold font-serif text-2xl leading-tight text-white">
                    MTs Ash-Sholihin
                    <br />
                    <span className="block text-base font-sans text-white">
                      Bumiroso Wonosobo
                    </span>
                  </span>
                </Link>
                
                <div className="hidden sm:ml-30 sm:flex sm:items-center flex-1">
                  <div className="flex space-x-4">
                    <Link href="/" className={classNames( 'rounded-md px-3 py-2 text-sm font-medium', url === '/' ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-600' )}>
                      Beranda
                    </Link>
                    <Menu as="div" className="relative">
                      <MenuButton className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-700">
                        <span>Profil</span>
                        <ChevronDownIcon className="size-4" />
                      </MenuButton>
                      <MenuItems className="absolute left-0 z-10 mt-2 w-44 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="py-1">
                          {profilMenu.map((item) => (
                            <MenuItem key={item.id}>
                              {({ active }) => (
                                <Link
                                  href={`/profil/${item.slug}`}
                                  className={classNames(
                                    'block px-4 py-2 text-sm',
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                  )}
                                >
                                  {item.Judul}
                                </Link>
                              )}
                            </MenuItem>
                          ))}
                        </div>
                      </MenuItems>
                    </Menu>
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href} className={classNames( 'rounded-md px-3 py-2 text-sm font-medium', url.startsWith(item.href) ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-600' )}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="hidden sm:block">
                  <Link href="/login" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition-colors duration-200 hover:bg-gray-100">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            <div className="space-y-1 px-2 pb-3 pt-2">
              <DisclosureButton as={Link} href="/" className={classNames( 'block rounded-md px-3 py-2 text-base font-medium', url === '/' ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-600' )}>
                Beranda
              </DisclosureButton>
              
              <div className="pt-2">
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                  Profil
                </h3>
                <div className="mt-1 space-y-1">
                  {profilMenu.map((item) => (
                    <DisclosureButton key={item.id} as={Link} href={`/profil/${item.slug}`} className="block rounded-md py-2 pl-5 pr-3 text-base font-medium text-emerald-200 hover:bg-emerald-600">
                      {item.Judul}
                    </DisclosureButton>
                  ))}
                </div>
              </div>

              {navigation.map((item) => (
                <DisclosureButton key={item.name} as={Link} href={item.href} className={classNames( 'block rounded-md px-3 py-2 text-base font-medium', url.startsWith(item.href) ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-600' )}>
                  {item.name}
                </DisclosureButton>
              ))}
              
              <div className="border-t pt-4 mt-4" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                <DisclosureButton as={Link} href="/login" className="w-full text-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition-colors duration-200 hover:bg-gray-100">
                  Login
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}