"use client"

import { useRouter } from 'next/navigation';

export const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        // Apelăm ruta API de signout
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
        });

        if (response.ok) {
            // Reîmprospătăm pagina pentru a actualiza starea tuturor componentelor de server
            router.refresh();
            router.push('/login');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
        >
            Ieșire din cont
        </button>
    );
};