import ChatBot from "@/components/ChatBot";
import Navbar from "../../components/Navbar"

export default function Home() {
  return (
    <>
      <Navbar />
    <div className="flex justify-center items-center h-screen">

      <ChatBot />
    </div>
    </>
  );
}
