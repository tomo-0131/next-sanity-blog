import Image from "next/image"
import Link from "next/link"

function Header() {
  const defaultImage: string = "https://links.papareact.com/yvf"

  return (
    <header className="flex justify-between p-4 mx-auto">
      <div className="flex items-center space-x-5">
        <Link href='/'>
          <img
            src='/images/NESHOT (1).png'
            className="w-32 md:w-44 -mt-1 object-contain cursor-pointer transition hover:scale-105 ease-in-out duration-200 transition-transform"
          />
        </Link>

        <div className="hidden md:inline-flex items-center space-x-5">
          <h3 className="transition hover:scale-105 ease-in-out duration-200 transition-transform">About</h3>
          <h3>Contact</h3>
          {/* <h3 className="text-white bg-teal-600 rounded-full px-4 py-1">
            Follow
          </h3> */}
        </div>
      </div>

      <div className="flex items-center space-x-5 text-black">
        <h3>Sign In</h3>
        <h3 className="hidden border px-2 py-2 rounded-full border-black">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
