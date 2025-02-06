import Navbar from '../../components/Navbar';
import ChatBot from '../../components/ChatBot'; // ✅ Import the ChatBot component

export default function Template() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-bold mb-4"></h1>
        <ChatBot /> {/* ✅ Include the Chatbot here */}
      </div>
    </>
  );
}
