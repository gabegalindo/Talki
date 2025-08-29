import Link from "next/link";
import styles from "./Toolbar.module.css";

// In a real app, you'd use SVG icons here
const HomeIcon = () => <span>🏠</span>;
const SettingsIcon = () => <span>⚙️</span>;
const StickerIcon = () => <span>⭐</span>;
const HelpIcon = () => <span>❓</span>;

export default function Toolbar() {
  return (
    <nav className={styles.toolbar}>
      <Link href="/" className={styles.navButton} aria-label="Home">
        <HomeIcon />
        <span>Home</span>
      </Link>
      <Link href="/settings" className={styles.navButton} aria-label="Settings">
        <SettingsIcon />
        <span>Settings</span>
      </Link>
      <Link
        href="/stickers"
        className={styles.navButton}
        aria-label="Sticker Shop"
      >
        <StickerIcon />
        <span>Stickers</span>
      </Link>
      <Link href="/help" className={styles.navButton} aria-label="Help">
        <HelpIcon />
        <span>Help</span>
      </Link>
    </nav>
  );
}
