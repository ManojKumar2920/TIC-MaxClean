"use client";

import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
    const router = useRouter();

    const handleGoogleLogin = async () => {
        router.push("/api/auth/google-auth");
    };

  return (
    <button
      type="button"
      className="bg-white flex items-center justify-center gap-2 text-black w-full px-6 py-4 font-semibold rounded-md uppercase mt-4"
      onClick={handleGoogleLogin}
    >
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.2666 10.1498H23.3V10.1H12.5V14.9H19.2818C18.2924 17.6942 15.6338 19.7 12.5 19.7C8.5238 19.7 5.3 16.4762 5.3 12.5C5.3 8.5238 8.5238 5.3 12.5 5.3C14.3354 5.3 16.0052 5.9924 17.2766 7.1234L20.6708 3.7292C18.5276 1.7318 15.6608 0.5 12.5 0.5C5.873 0.5 0.5 5.873 0.5 12.5C0.5 19.127 5.873 24.5 12.5 24.5C19.127 24.5 24.5 19.127 24.5 12.5C24.5 11.6954 24.4172 10.91 24.2666 10.1498Z"
          fill="#FFC107"
        />
        <path
          d="M2.5 6.9146L6.4426 9.806C7.5094 7.1648 10.093 5.3 13.1164 5.3C14.9518 5.3 16.6216 5.9924 17.893 7.1234L21.2872 3.7292C19.144 1.7318 16.2772 0.5 13.1164 0.5C8.5072 0.5 4.51 3.1022 2.5 6.9146Z"
          fill="#FF3D00"
        />
        <path
          d="M12.5004 24.5C15.6 24.5 18.4164 23.3138 20.5458 21.3848L16.8318 18.242C15.5867 19.1894 14.0649 19.7017 12.5004 19.7C9.37918 19.7 6.72898 17.7098 5.73058 14.9324L1.81738 17.9474C3.80338 21.8336 7.83658 24.5 12.5004 24.5Z"
          fill="#4CAF50"
        />
        <path
          d="M24.2666 10.1499H23.3V10.1001H12.5V14.9001H19.2818C18.8085 16.2299 17.956 17.392 16.8296 18.2427L16.8314 18.2415L20.5454 21.3843C20.2826 21.6231 24.5 18.5001 24.5 12.5001C24.5 11.6955 24.4172 10.9101 24.2666 10.1499Z"
          fill="#1976D2"
        />
      </svg>
      Continue with Google
    </button>
  );
}
