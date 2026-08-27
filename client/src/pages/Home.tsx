/*
 * Tinta Senja design reminder: editorial romanticism, ink navy + paper cream + copper dusk,
 * asymmetrical layouts, tactile linework, and calm interactions that feel like opening a letter.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Heart,
  Image as ImageIcon,
  MapPin,
  Music2,
  Pause,
  Play,
  Quote,
  Send,
  Sparkles,
  X,
} from "lucide-react";

const invitation = {
  names: "Amara & Damar",
  shortNames: "Ama & Dam",
  parents: "Putri pertama dari Bapak Surya & Ibu Laras · Putra pertama dari Bapak Aditya & Ibu Mira",
  dateLabel: "Sabtu, 14 November 2026",
  dateShort: "14.11.26",
  eventDate: "2026-11-14T15:30:00+07:00",
  akad: { time: "15.30 WIB", venue: "Pendopo Aksara" },
  reception: { time: "18.30 – 21.00 WIB", venue: "Pendopo Aksara" },
  address: "Jl. Kemang Raya No. 18, Jakarta Selatan",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pendopo+Aksara+Jakarta",
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  ewallet: { provider: "DANA", number: "0812 3456 7890", recipient: "Amara Putri" },
  bank: { name: "Bank Mandiri", number: "1420 8899 7711", recipient: "Damar Pratama" },
};

const gallery = [
  {
    src: "/manus-storage/tinta-senja-gallery-01_232a6a0e.jpg",
    alt: "Amara dan Damar berjalan di antara pepohonan dalam cahaya sore",
    caption: "Di antara teduh yang sama",
    size: "tall",
  },
  {
    src: "/manus-storage/tinta-senja-gallery-02_6ab4ccf0.jpg",
    alt: "Dua cincin di atas kertas krem dengan segel tembaga",
    caption: "Sebuah janji kecil",
    size: "wide",
  },
  {
    src: "/manus-storage/tinta-senja-hero_6831b505.jpg",
    alt: "Potret editorial pasangan dalam suasana senja",
    caption: "Menjelang sore",
    size: "portrait",
  },
  {
    src: "/manus-storage/tinta-senja-gallery-03_caa06bfa.jpg",
    alt: "Pasangan duduk menghadap garis pantai saat matahari terbenam",
    caption: "Pulang ke arah yang sama",
    size: "wide",
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    alt: "Detail buket bunga putih di dekat kain linen",
    caption: "Hal-hal yang dirawat",
    size: "portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
    alt: "Meja makan pernikahan dengan cahaya lilin yang hangat",
    caption: "Untuk dirayakan bersama",
    size: "square",
  },
];

type GuestMessage = {
  name: string;
  attendance: string;
  message: string;
  timestamp: string;
};

function getGuestName() {
  const value = new URLSearchParams(window.location.search).get("to");
  const cleaned = value?.replace(/\s+/g, " ").trim();
  return cleaned ? cleaned.slice(0, 70) : "Tamu undangan";
}

function formatRemaining(target: number) {
  const distance = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(distance / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function calendarUrl() {
  const start = "20261114T083000Z";
  const end = "20261114T140000Z";
  const details = encodeURIComponent(`Akad dan resepsi ${invitation.names}. ${invitation.address}`);
  const location = encodeURIComponent(invitation.address);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${invitation.names}`)}&dates=${start}/${end}&details=${details}&location=${location}&ctz=Asia%2FJakarta`;
}

function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
  return Promise.resolve();
}

function SectionKicker({ number, children }: { number: string; children: string }) {
  return (
    <div className="section-kicker">
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [guestName] = useState(getGuestName);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(() => formatRemaining(new Date(invitation.eventDate).getTime()));
  const [copied, setCopied] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [formError, setFormError] = useState("");
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);

  const navItems = useMemo(
    () => [
      { href: "#cerita", label: "Cerita" },
      { href: "#acara", label: "Acara" },
      { href: "#galeri", label: "Galeri" },
      { href: "#rsvp", label: "RSVP" },
      { href: "#tanda-kasih", label: "Tanda kasih" },
    ],
    [],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(formatRemaining(new Date(invitation.eventDate).getTime())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("tinta-senja-rsvp");
    if (stored) setGuestMessages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [isOpen, guestMessages.length]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    if (lightboxIndex !== null) lightboxCloseRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") setLightboxIndex((current) => current === null ? null : (current - 1 + gallery.length) % gallery.length);
      if (event.key === "ArrowRight") setLightboxIndex((current) => current === null ? null : (current + 1) % gallery.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  const openInvitation = () => {
    setIsOpen(true);
    window.setTimeout(() => {
      audioRef.current?.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
    }, 650);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
    }
  };

  const handleCopy = (label: string, value: string) => {
    copyText(value).then(() => {
      setCopied(label);
      window.setTimeout(() => setCopied(""), 2000);
    });
  };

  const handleRSVP = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setFormStatus("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const attendance = String(form.get("attendance") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (name.length < 2) {
      setFormError("Tulis nama lengkap agar kami dapat menyambutmu dengan baik.");
      nameInputRef.current?.focus();
      return;
    }
    if (message.length < 3) {
      setFormError("Tulis sedikit pesan untuk Amara & Damar.");
      return;
    }
    const nextMessage = { name, attendance, message, timestamp: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date()) };
    const nextMessages = [nextMessage, ...guestMessages];
    setGuestMessages(nextMessages);
    window.localStorage.setItem("tinta-senja-rsvp", JSON.stringify(nextMessages));
    setFormStatus("Konfirmasi tersimpan di perangkatmu. Terima kasih sudah menitipkan doa.");
    event.currentTarget.reset();
  };

  return (
    <div className={`invitation-shell ${isOpen ? "is-open" : ""}`}>
      <audio ref={audioRef} src={invitation.musicUrl} loop preload="none" aria-label="Musik latar undangan" />

      <div className="cover" aria-hidden={isOpen}>
        <div className="cover-photo" />
        <div className="cover-wash" />
        <div className="cover-content">
          <div className="cover-topline"><span>Undangan pernikahan</span><span>{invitation.dateShort}</span></div>
          <div className="emblem emblem-light" aria-label="Emblem Amara dan Damar"><span /><span /></div>
          <p className="eyebrow light">Satu sore, dua arah pulang.</p>
          <h1>{invitation.names.split(" & ").map((name, index) => <span key={name}>{index > 0 && <i>&amp;</i>}{name}</span>)}</h1>
          <div className="cover-guest"><span>Untuk</span><strong>{guestName}</strong></div>
          <button className="button button-light cover-button" onClick={openInvitation}>Buka undangan <ArrowDown size={16} /></button>
          <p className="cover-footnote">14 November 2026 · Jakarta</p>
        </div>
        <div className="cover-mark">TS / 01</div>
      </div>

      <header className="site-header">
        <a href="#top" className="brand-lockup" aria-label="Kembali ke awal undangan">
          <span className="emblem emblem-small"><span /><span /></span>
          <span>{invitation.shortNames}</span>
        </a>
        <nav aria-label="Navigasi utama">
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <span className="header-date">14 / 11 / 26</span>
      </header>

      <main id="top">
        <section className="hero-section section-dark" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="hero-copy reveal">
              <SectionKicker number="01" children="catatan pertama" />
              <p className="eyebrow">Dengan segala hangat yang kami punya</p>
              <h2 id="hero-title">Mari merayakan<br /><em>hari yang kami pilih.</em></h2>
              <p className="hero-lede">Kami mengundangmu untuk hadir di sebuah sore yang akan kami ingat lama: ketika dua perjalanan memutuskan untuk berjalan dalam satu arah.</p>
              <a href="#cerita" className="text-link light-link">Baca cerita kami <ArrowDown size={15} /></a>
            </div>
            <div className="hero-image-wrap reveal reveal-delay-2">
              <img src="/manus-storage/tinta-senja-hero_6831b505.jpg" alt="Amara dan Damar dalam cahaya senja" />
              <span className="image-stamp">JKT<br />14.11.26</span>
              <span className="hero-image-caption">Aksara / 2026</span>
            </div>
          </div>
          <div className="scroll-note"><span className="scroll-line" /> <span>Geser perlahan</span></div>
        </section>

        <section id="cerita" className="story-section section-paper">
          <div className="story-aside reveal"><SectionKicker number="02" children="catatan kami" /><p className="vertical-note">A story in two voices<br />kept in one place</p></div>
          <div className="story-main">
            <p className="eyebrow copper reveal">Bukan kebetulan yang besar</p>
            <h2 className="display-title reveal reveal-delay-1">Satu sore,<br /><em>dua arah pulang.</em></h2>
            <div className="story-columns reveal reveal-delay-2">
              <p>Amara dan Damar bertemu di sebuah sore yang biasa—sebuah meja, dua gelas kopi, dan obrolan yang awalnya tak ingin selesai. Dari sana, hal-hal kecil mulai menemukan tempatnya: kabar singkat, perjalanan pulang, dan tawa yang terasa seperti sudah lama dikenal.</p>
              <p>Tahun-tahun berikutnya mengajarkan kami bahwa rumah bukan selalu alamat. Kadang ia adalah seseorang yang membuat hari paling panjang terasa cukup. Dengan penuh syukur, kami ingin merayakan keputusan untuk saling memilih, kali ini di hadapan orang-orang yang kami cintai.</p>
            </div>
            <div className="story-signoff reveal reveal-delay-3"><span className="signature-line" /><span>Dengan cinta,<br /><strong>{invitation.shortNames}</strong></span></div>
          </div>
        </section>

        <section id="acara" className="events-section section-ink">
          <div className="events-intro reveal"><SectionKicker number="03" children="catatan tanggal" /><p className="eyebrow light">Tandai halaman ini</p><h2 className="display-title light-title">Hari yang<br /><em>kami nantikan.</em></h2><p className="muted-light">Simpan tanggalnya, datang dengan tenang, dan mari membuat sore ini menjadi kenangan yang baik.</p></div>
          <div className="event-details">
            <article className="event-block reveal reveal-delay-1"><span className="event-number">01</span><p className="eyebrow copper">Akad nikah</p><h3>{invitation.akad.time}</h3><p>{invitation.akad.venue}<br />{invitation.address}</p></article>
            <article className="event-block reveal reveal-delay-2"><span className="event-number">02</span><p className="eyebrow copper">Resepsi</p><h3>{invitation.reception.time}</h3><p>{invitation.reception.venue}<br />{invitation.address}</p></article>
            <div className="event-actions reveal reveal-delay-3"><a className="button button-copper" href={invitation.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={16} /> Lihat lokasi <ArrowUpRight size={14} /></a><a className="button button-outline-light" href={calendarUrl()} target="_blank" rel="noreferrer"><CalendarDays size={16} /> Tandai tanggal</a></div>
          </div>
          <div className="countdown-band reveal"><p className="eyebrow copper">Menuju hari bahagia</p><div className="countdown"><div><strong>{String(countdown.days).padStart(2, "0")}</strong><span>hari</span></div><i>:</i><div><strong>{String(countdown.hours).padStart(2, "0")}</strong><span>jam</span></div><i>:</i><div><strong>{String(countdown.minutes).padStart(2, "0")}</strong><span>menit</span></div><i>:</i><div><strong>{String(countdown.seconds).padStart(2, "0")}</strong><span>detik</span></div></div></div>
        </section>

        <section id="galeri" className="gallery-section section-paper">
          <div className="gallery-heading reveal"><div><SectionKicker number="04" children="catatan visual" /><p className="eyebrow copper">Beberapa bingkai yang kami simpan</p><h2 className="display-title">Yang tinggal<br /><em>setelah hari berlalu.</em></h2></div><p className="gallery-note">Enam potongan kecil dari perjalanan kami, sebelum sampai pada halaman ini.</p></div>
          <div className="gallery-grid">{gallery.map((photo, index) => <button key={photo.src} className={`gallery-item gallery-${photo.size} reveal reveal-delay-${(index % 3) + 1}`} onClick={() => setLightboxIndex(index)} aria-label={`Lihat foto ${index + 1}: ${photo.caption}`}><img src={photo.src} alt={photo.alt} /><span className="gallery-overlay"><span>{String(index + 1).padStart(2, "0")}</span><span>{photo.caption}</span><ImageIcon size={15} /></span></button>)}</div>
        </section>

        <section id="rsvp" className="rsvp-section section-copper">
          <div className="rsvp-intro reveal"><SectionKicker number="05" children="catatan untuk kami" /><p className="eyebrow dark-eyebrow">Satu baris pun berarti</p><h2 className="display-title dark-title">Titipkan<br /><em>kabar dan doamu.</em></h2><p>Mohon isi konfirmasi kehadiran agar kami dapat menyiapkan tempat terbaik untukmu.</p><div className="rsvp-seal"><Heart size={18} /> RSVP</div></div>
          <div className="rsvp-form-wrap reveal reveal-delay-1"><form onSubmit={handleRSVP} noValidate><label htmlFor="name">Nama lengkap<input ref={nameInputRef} id="name" name="name" type="text" placeholder="Tulis namamu" autoComplete="name" /></label><fieldset><legend>Konfirmasi kehadiran</legend><label className="radio-label"><input type="radio" name="attendance" value="Saya akan hadir" defaultChecked /> <span>Saya akan hadir</span></label><label className="radio-label"><input type="radio" name="attendance" value="Belum bisa memastikan" /> <span>Belum bisa memastikan</span></label><label className="radio-label"><input type="radio" name="attendance" value="Tidak dapat hadir" /> <span>Tidak dapat hadir</span></label></fieldset><label htmlFor="message">Pesan ucapan<textarea id="message" name="message" rows={4} placeholder="Tulis doa atau pesan kecilmu di sini" /></label>{formError && <p className="form-feedback error" role="alert">{formError}</p>}{formStatus && <p className="form-feedback success" role="status"><Check size={15} /> {formStatus}</p>}<button className="button button-ink submit-button" type="submit"><Send size={15} /> Kirim konfirmasi</button><p className="form-note">Data RSVP ini tersimpan sementara di perangkatmu.</p></form></div>
        </section>

        <section className="guestbook-section section-paper"><div className="guestbook-heading reveal"><SectionKicker number="06" children="catatan tamu" /><h2 className="display-title">Kata yang<br /><em>kami bawa pulang.</em></h2><p>Pesanmu akan menjadi bagian kecil dari arsip hari ini.</p></div><div className="guestbook-list">{guestMessages.length === 0 ? <div className="guestbook-empty reveal"><Quote size={22} /><p>Pesan ucapanmu akan muncul di sini setelah dikirim.</p></div> : guestMessages.map((item, index) => <article className="guest-message reveal" key={`${item.timestamp}-${index}`}><div className="guest-message-top"><strong>{item.name}</strong><span>{item.timestamp}</span></div><p className="guest-attendance">{item.attendance}</p><p>{item.message}</p></article>)}</div></section>

        <section id="tanda-kasih" className="gift-section section-dark"><div className="gift-copy reveal"><SectionKicker number="07" children="catatan kecil" /><p className="eyebrow light">Jika ingin menitipkan tanda kasih</p><h2 className="display-title light-title">Doa dan<br /><em>kehadiranmu cukup.</em></h2><p className="muted-light">Namun jika kamu berkenan mengirimkan tanda kasih, kami menyiapkan dua cara sederhana di bawah ini.</p></div><div className="gift-panels"><div className="gift-panel reveal reveal-delay-1"><div className="qr-placeholder" aria-label="QR code e-wallet contoh"><div className="qr-pattern"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></div><div><p className="eyebrow copper">E-wallet · {invitation.ewallet.provider}</p><h3>{invitation.ewallet.number}</h3><p>a.n. {invitation.ewallet.recipient}</p><button className="copy-button" onClick={() => handleCopy("ewallet", invitation.ewallet.number)}>{copied === "ewallet" ? <Check size={14} /> : <Copy size={14} />} {copied === "ewallet" ? "Tersalin" : "Salin nomor"}</button></div></div><div className="gift-panel reveal reveal-delay-2"><div className="gift-icon"><Sparkles size={20} /></div><div><p className="eyebrow copper">Transfer bank · {invitation.bank.name}</p><h3>{invitation.bank.number}</h3><p>a.n. {invitation.bank.recipient}</p><button className="copy-button" onClick={() => handleCopy("bank", invitation.bank.number)}>{copied === "bank" ? <Check size={14} /> : <Copy size={14} />} {copied === "bank" ? "Tersalin" : "Salin nomor"}</button></div></div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-emblem emblem"><span /><span /></div><p>Terima kasih sudah menjadi bagian dari cerita kami.</p><strong>{invitation.names}</strong><small>14 · 11 · 2026 / Jakarta</small></footer>

      <button className={`music-toggle ${isOpen ? "visible" : ""}`} onClick={toggleMusic} aria-label={musicPlaying ? "Jeda musik" : "Putar musik"}>{musicPlaying ? <Pause size={16} /> : <Music2 size={16} />}<span>{musicPlaying ? "Jeda musik" : "Putar musik"}</span></button>
      <nav className={`mobile-nav ${isOpen ? "visible" : ""}`} aria-label="Navigasi cepat mobile">{navItems.slice(0, 5).map((item) => <a key={item.href} href={item.href}><span>{item.href === "#cerita" ? "01" : item.href === "#acara" ? "02" : item.href === "#galeri" ? "03" : item.href === "#rsvp" ? "04" : "05"}</span>{item.label}</a>)}</nav>

      {lightboxIndex !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto" onClick={(event) => { if (event.target === event.currentTarget) setLightboxIndex(null); }}><button ref={lightboxCloseRef} className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Tutup galeri"><X size={20} /></button><button className="lightbox-prev" onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)} aria-label="Foto sebelumnya"><ChevronLeft size={22} /></button><figure><img src={gallery[lightboxIndex].src} alt={gallery[lightboxIndex].alt} /><figcaption><span>{String(lightboxIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span>{gallery[lightboxIndex].caption}</figcaption></figure><button className="lightbox-next" onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)} aria-label="Foto berikutnya"><ChevronRight size={22} /></button></div>}
    </div>
  );
}

export default Home;
