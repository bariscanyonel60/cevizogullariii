import { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2c-5.46 0-9.91 4.43-9.91 9.88 0 1.74.46 3.44 1.33 4.94L2 22l5.35-1.4a9.9 9.9 0 0 0 4.69 1.2h.01c5.46 0 9.9-4.43 9.9-9.88C22 6.43 17.5 2 12.04 2Zm5.78 14.05c-.24.68-1.4 1.24-1.94 1.32-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.93-4.36-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.38.26-.28.57-.35.76-.35h.55c.17 0 .4-.06.62.48.24.57.81 1.97.88 2.11.07.14.12.3.02.48-.1.19-.14.3-.28.47-.14.16-.3.36-.42.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.22 1.36.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.66.78 1.95.93.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.5 9.5H3.7V20h2.8V9.5ZM5.1 4a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3ZM20.3 20h-2.8v-5.5c0-1.55-.55-2.6-1.9-2.6-1.04 0-1.66.7-1.93 1.38-.1.24-.12.58-.12.92V20H10.8s.04-9.4 0-10.5h2.8v1.49c.37-.57 1.03-1.39 2.52-1.39 1.84 0 3.22 1.2 3.22 3.78V20Z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.5 20v-7.2h2.4l.36-2.8h-2.76V8.2c0-.81.22-1.36 1.38-1.36H17.5V4.14C17.16 4.1 16.1 4 14.86 4c-2.58 0-4.35 1.58-4.35 4.47v2.53H8v2.8h2.51V20h4Z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.2c0-2.2-.2-3.7-.4-4.6-.2-.8-.8-1.4-1.5-1.6C18.8 5.6 12 5.6 12 5.6s-6.8 0-8.1.4c-.7.2-1.3.8-1.5 1.6-.2.9-.4 2.4-.4 4.6s.2 3.7.4 4.6c.2.8.8 1.4 1.5 1.6 1.3.4 8.1.4 8.1.4s6.8 0 8.1-.4c.7-.2 1.3-.8 1.5-1.6.2-.9.4-2.4.4-4.6ZM10.2 15.1V9.3l5.2 2.9-5.2 2.9Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.6 4h2.3l-5 5.7L21.5 20h-5.3l-3.5-5.1L7.5 20H5.2l5.4-6.1L2.7 4h5.4l3.1 4.7L17.6 4Zm-1 14.4h1.3L7.6 5.5H6.3l10.3 12.9Z" />
    </svg>
  );
}
