import { useRouter } from 'next/navigation';

export default function HistoryButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/historico')}
      className="bg-indigo-100 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
      Histórico
    </button>
  );
} 