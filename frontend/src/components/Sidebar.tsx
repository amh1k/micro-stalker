"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/books", label: "Books", icon: "📚" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>📖</span>
        <span className={styles.logoText}>BookStalker</span>
      </div>

      <nav className={styles.nav}>
        <span className={styles.navLabel}>Menu</span>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.footerDot}></div>
        <span>Cron Running</span>
      </div>
    </aside>
  );
}
