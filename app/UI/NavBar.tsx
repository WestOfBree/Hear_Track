"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
    const pathname = usePathname();
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined") {
            return "light";
        }

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark" || savedTheme === "light") {
            return savedTheme;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleToggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
    };

    return (
        <nav className={`flex w-full items-center justify-between p-4 ${theme === "dark" ? "bg-zinc-900" : "bg-gray-800"}`}>
            <div className="flex space-x-4">
                <Link href="/" className={pathname === "/" ? "text-white" : "text-gray-400"}>
                    Home
                </Link>
                <Link href="/about" className={pathname === "/about" ? "text-white" : "text-gray-400"}>
                    About
                </Link>
            </div>
            <button
                type="button"
                onClick={handleToggleTheme}
                aria-label="Toggle color theme"
                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${theme === "dark" ? "border-zinc-600 bg-zinc-800 text-zinc-100 hover:bg-zinc-700" : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"}`}
            >
                {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
        </nav>
    );
}