"use client"
import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Contador Simples</h1>
        <p className="text-lg mb-6">Contagem: <span className="font-semibold">{count}</span></p>
        
        <div className="flex gap-4">
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Incrementar
          </button>
          
          <button
            onClick={() => setCount(0)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Resetar
          </button>
        </div>
      </div>
    </div>
  );
}