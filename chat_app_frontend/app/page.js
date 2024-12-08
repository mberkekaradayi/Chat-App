// `app/page.tsx` is the UI for the `/` URL

import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-4xl font-extrabold mb-6">🌌 Welcome to Chatify</h1>
        <p className="text-lg mb-6 text-center max-w-md text-slate-300">
          Connect, communicate, and collaborate effortlessly. Your new favorite
          chat platform is just a click away!
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="p-3 bg-blue-700 text-white rounded-xl shadow-lg font-semibold hover:bg-blue-900 transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="p-3 bg-green-700 text-white rounded-xl shadow-lg font-semibold hover:bg-green-900 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <footer className="text-center p-4">
        <p className="text-sm text-gray-400 font-extralight">
          &copy; {new Date().getFullYear()} Chatify. All rights reserved.
          <a
            href="https://mberkekaradayi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline ml-2"
          >
            Mehmet Berke Karadayi
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
