import Navbar from "../../components/Navbar";
import Test from "../../components/Upstox/test";
// import Search from "@/components/Upstox/SearchEquities";

export default function Template() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <div className="container mx-auto p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Purchase a Stock</h1>
        <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg border border-gray-300">
          <Test />
        </div>
        {/* <Search /> */}
      </div>
    </div>
  );
}
