export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
    bg-gradient-to-b from-blue-100 to-blue-300">

      {/* image */}
      <img
        src="Postcare/src/img/Login.png"
        className="w-64 mb-6"
      />

      {/* title */}
      <h1 className="text-2xl font-semibold text-gray-600 mb-6">
        Login
      </h1>

      {/* HN */}
      <input
        type="text"
        placeholder="HN number"
        className="w-72 p-3 mb-4 rounded-full bg-white shadow"
      />

      {/* password */}
      <input
        type="password"
        placeholder="Password"
        className="w-72 p-3 mb-6 rounded-full bg-white shadow"
      />

      {/* button */}
      <button
        className="bg-blue-600 text-white px-8 py-3 rounded-full shadow"
      >
        Submit
      </button>

    </div>
  );
}