import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Exportamos versiones locale-aware de Link, redirect, usePathname, useRouter
// Usalas en lugar de las de "next/link" y "next/navigation"
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
