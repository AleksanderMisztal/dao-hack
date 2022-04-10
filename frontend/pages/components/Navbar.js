import Link from 'next/link';

export const Navbar = () => {
  return (
    <>
      <nav className="flex items-center flex-wrap bg-blue-500 p-3">
        <Link href="/">
          <a className="inline-flex items-center p-2 mr-4 ">
            <span className="text-xl text-white font-bold uppercase tracking-wide">
              NEWS DAO
            </span>
          </a>
        </Link>
        <Link href="/create-profile">
          <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
            Create Profile
          </a>
        </Link>
      </nav>
    </>
  );
};
