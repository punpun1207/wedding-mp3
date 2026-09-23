import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Send,
  Camera,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { EnvelopeScreen } from './components/EnvelopeScreen';
import { FloatingNav } from './components/FloatingNav';
import { GiftModal } from './components/GiftModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { getGoogleCalendarUrl, downloadIcsFile } from './utils/calendar';
import { WishItem } from './types';

export default function App() {
  // Envelope modal state
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showGiftModal, setShowGiftModal] = useState(false);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // RSVP Form state
  const [guestName, setGuestName] = useState('');
  const [guestWish, setGuestWish] = useState('');
  const [attendance, setAttendance] = useState('Tham dự');
  const [plusOne, setPlusOne] = useState('Đi 1 mình');
  const [guestOf, setGuestOf] = useState('Cả hai');
  const [guestImageFile, setGuestImageFile] = useState<File | null>(null);
  const [guestImagePreview, setGuestImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);

  // Address copy notification
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Wishes List (initial heartfelt wishes + saved in localStorage)
  const initialWishes: WishItem[] = [
    {
      id: 'w1',
      name: 'Thanh Hằng & Minh Trí',
      wish: 'Chúc Bảo Kiện & Quỳnh Anh trăm năm hạnh phúc, răng long đầu bạc, luôn tràn ngập tiếng cười và thấu hiểu nhau suốt cuộc đời!',
      attendance: 'Tham dự',
      plusOne: 'Đi cùng 1 người',
      guestOf: 'Cả hai',
      createdAt: '22/10/2020',
    },
    {
      id: 'w2',
      name: 'Tuấn Anh (Bạn Đại học)',
      wish: 'Mừng hạnh phúc đôi bạn trẻ! Chúc Kiện luôn là chỗ dựa vững chắc cho Quỳnh Anh và cùng nhau xây dựng tổ ấm ngọt ngào nhé.',
      attendance: 'Tham dự',
      plusOne: 'Đi 1 mình',
      guestOf: 'Nhà trai',
      createdAt: '23/10/2020',
    },
    {
      id: 'w3',
      name: 'Ngọc Lan & Gia đình',
      wish: 'Chúc hai em một hành trình hôn nhân đong đầy yêu thương, bình an và sớm đón tin vui thiên thần nhỏ!',
      attendance: 'Tham dự',
      plusOne: 'Đi cùng gia đình',
      guestOf: 'Nhà gái',
      createdAt: '23/10/2020',
    },
  ];

  const [wishes, setWishes] = useState<WishItem[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_wishes_bk_qa');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialWishes;
  });

  // Countdown timer logic
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    daysSince: 0,
  });

  useEffect(() => {
    const weddingDate = new Date('2020-10-23T10:00:00+07:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = weddingDate - now;

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
          isPast: false,
          daysSince: 0,
        });
      } else {
        const daysPast = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
          daysSince: daysPast,
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Gallery Photos
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      caption: 'Khoảnh khắc ngọt ngào của Bảo Kiện & Quỳnh Anh',
    },
    {
      src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      caption: 'Nắm tay em đi qua mọi mùa yêu',
    },
    {
      src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      caption: 'Bó hoa rum tinh khôi ngày trọng đại',
    },
    {
      src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
      caption: 'Chặng đường mới, ngôi nhà chung ngập tràn yêu thương',
    },
    {
      src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
      caption: 'Nụ cười rạng rỡ của đôi uyên ương',
    },
    {
      src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85',
      caption: 'Từng chi tiết được chuẩn bị chu đáo',
    },
    {
      src: 'https://images.unsplash.com/photo-1519225438150-7117c2f6d0f0?auto=format&fit=crop&w=1200&q=85',
      caption: 'Ánh hoàng hôn lãng mạn bên nhau',
    },
  ];

  // Scroll to section helper
  const formRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const scrollToWishes = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Image upload handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGuestImageFile(file);
      const preview = URL.createObjectURL(file);
      setGuestImagePreview(preview);
    }
  };

  // Canvas Text wrap helper
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  // Form submission and Canvas card rendering
  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestWish.trim()) return;

    setIsSubmitting(true);

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      // 1. Generate 1080x1080 keepsake canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Parchment cream background
        ctx.fillStyle = '#F8F5F4';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Double burgundy borders with gold accent
        ctx.strokeStyle = '#7A1C29';
        ctx.lineWidth = 14;
        ctx.strokeRect(35, 35, 1010, 1010);

        ctx.strokeStyle = '#C5A059';
        ctx.lineWidth = 3;
        ctx.strokeRect(55, 55, 970, 970);

        // Header
        ctx.fillStyle = '#7A1C29';
        ctx.font = "bold 56px 'Playfair Display', Georgia, serif";
        ctx.textAlign = 'center';
        ctx.fillText('Wedding Wishes', canvas.width / 2, 140);

        ctx.fillStyle = '#C5A059';
        ctx.font = "italic 36px 'Cormorant Garamond', Georgia, serif";
        ctx.fillText('Bảo Kiện & Quỳnh Anh • 23.10.2020', canvas.width / 2, 195);

        // Divider
        ctx.strokeStyle = 'rgba(122, 28, 41, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(340, 225);
        ctx.lineTo(740, 225);
        ctx.stroke();

        const finalizeCard = () => {
          const cardData = canvas.toDataURL('image/jpeg', 0.92);
          setGeneratedCardUrl(cardData);

          const newWishItem: WishItem = {
            id: `w-${Date.now()}`,
            name: guestName.trim(),
            wish: guestWish.trim(),
            attendance,
            plusOne,
            guestOf,
            createdAt: 'Hôm nay',
            photoUrl: guestImagePreview || undefined,
          };

          const updatedWishes = [newWishItem, ...wishes];
          setWishes(updatedWishes);
          try {
            localStorage.setItem('wedding_wishes_bk_qa', JSON.stringify(updatedWishes));
          } catch {
            // ignore
          }

          setIsSubmitting(false);
          setSubmitSuccess(true);
        };

        if (guestImagePreview) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const targetW = 760;
            const targetH = 430;
            const ratio = Math.max(targetW / img.width, targetH / img.height);
            const drawW = img.width * ratio;
            const drawH = img.height * ratio;
            const sx = (drawW - targetW) / 2 / ratio;
            const sy = (drawH - targetH) / 2 / ratio;

            ctx.drawImage(
              img,
              sx,
              sy,
              img.width - sx * 2,
              img.height - sy * 2,
              160,
              265,
              targetW,
              targetH
            );

            // Frame around image
            ctx.strokeStyle = '#7A1C29';
            ctx.lineWidth = 6;
            ctx.strokeRect(160, 265, targetW, targetH);

            // Wish Text
            ctx.font = "italic 40px 'Cormorant Garamond', Georgia, serif";
            ctx.fillStyle = '#3A2A2B';
            ctx.textAlign = 'center';
            const textY = wrapText(
              ctx,
              `“${guestWish.trim()}”`,
              canvas.width / 2,
              770,
              840,
              54
            );

            // Guest Signature
            ctx.font = "bold 65px 'Great Vibes', cursive";
            ctx.fillStyle = '#7A1C29';
            ctx.textAlign = 'right';
            ctx.fillText(`- ${guestName.trim()}`, 920, Math.min(textY + 65, 980));

            finalizeCard();
          };
          img.src = guestImagePreview;
        } else {
          // No image: larger quote layout
          ctx.font = "italic 52px 'Cormorant Garamond', Georgia, serif";
          ctx.fillStyle = '#3A2A2B';
          ctx.textAlign = 'center';
          const textY = wrapText(
            ctx,
            `“${guestWish.trim()}”`,
            canvas.width / 2,
            470,
            860,
            72
          );

          ctx.font = "bold 86px 'Great Vibes', cursive";
          ctx.fillStyle = '#7A1C29';
          ctx.textAlign = 'right';
          ctx.fillText(`- ${guestName.trim()}`, 900, Math.min(textY + 110, 940));

          finalizeCard();
        }
      }
    } catch {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }
  };

  const copyVenueAddress = () => {
    navigator.clipboard.writeText(
      'White Palace, 588 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, TP. Hồ Chí Minh'
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  return (
    <div className="relative min-h-screen bg-[#F8F5F4] text-[#3A2A2B]">
      {/* 1. SHOW-STOPPING 3D ENVELOPE OVERLAY */}
      {showEnvelope && (
        <EnvelopeScreen
          isOpenState={showEnvelope}
          onOpenComplete={() => setShowEnvelope(false)}
          onClose={() => setShowEnvelope(false)}
        />
      )}

      {/* Floating controls for music, replay envelope, rsvp, gift */}
      <FloatingNav
        onReopenEnvelope={() => setShowEnvelope(true)}
        onOpenGiftModal={() => setShowGiftModal(true)}
        onScrollToWishes={scrollToWishes}
        onOpenCalendar={scrollToCalendar}
      />

      {/* Gift / Mừng Cưới Modal */}
      <GiftModal isOpen={showGiftModal} onClose={() => setShowGiftModal(false)} />

      {/* Photo Lightbox */}
      <PhotoLightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={(idx) => setLightboxIndex(idx)}
      />

      {/* ========================================================
          HERO COVER SECTION
      ======================================================== */}
      <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-end pb-12 sm:pb-16 text-center text-white overflow-hidden">
        {/* Background photo with subtle atmospheric gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85"
            alt="Wedding Cover"
            className="w-full h-full object-cover object-center scale-105 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#220407] via-[#220407]/40 to-black/30" />
        </div>

        {/* Envelope replay floating badge in hero */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => setShowEnvelope(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs tracking-wider uppercase backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            <span>💌 Mở phong bì</span>
          </button>
        </div>

        {/* Hero typography */}
        <div className="relative z-10 px-4 max-w-xl mx-auto flex flex-col items-center">
          <p className="font-sans text-xs sm:text-sm tracking-[0.35em] uppercase text-amber-200/90 font-medium mb-2 drop-shadow">
            Save The Date
          </p>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase drop-shadow-lg leading-tight">
            BẢO KIỆN <br />
            <span className="font-script text-5xl sm:text-7xl font-normal text-amber-200 lowercase tracking-normal block -my-2 sm:-my-4">
              &amp;
            </span>
            QUỲNH ANH
          </h1>

          <div className="mt-4 flex items-center justify-center gap-3 text-sm sm:text-base font-serif tracking-widest text-white/95 border-t border-b border-amber-200/40 py-2 px-6">
            <span>10:00</span>
            <span>•</span>
            <span className="font-bold text-amber-200">23 . 10 . 2020</span>
            <span>•</span>
            <span>THỨ SÁU</span>
          </div>

          {/* Countdown timer / Milestone counter */}
          <div className="mt-6 bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 w-full max-w-sm">
            <div className="text-[11px] uppercase tracking-[0.2em] text-amber-200/90 font-sans mb-2 font-medium">
              Ngày chung đôi thiêng liêng
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/10 rounded-lg p-1.5">
                <span className="block font-display font-bold text-lg sm:text-xl text-white">
                  23
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/70">Ngày</span>
              </div>
              <div className="bg-white/10 rounded-lg p-1.5">
                <span className="block font-display font-bold text-lg sm:text-xl text-white">
                  10
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/70">Tháng</span>
              </div>
              <div className="bg-white/10 rounded-lg p-1.5">
                <span className="block font-display font-bold text-lg sm:text-xl text-white">
                  2020
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/70">Năm</span>
              </div>
              <div className="bg-white/10 rounded-lg p-1.5">
                <span className="block font-display font-bold text-lg sm:text-xl text-amber-300">
                  Canh Tý
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/70">Âm Lịch</span>
              </div>
            </div>
            {countdown.isPast && (
              <p className="text-[11px] text-amber-200/90 italic mt-2 font-serif">
                ♥ Đã cùng nhau sẻ chia hơn {countdown.daysSince.toLocaleString('vi-VN')} ngày hạnh phúc!
              </p>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 mt-8 flex flex-col items-center gap-1.5 text-white/75 text-xs uppercase tracking-[0.2em]">
          <span>Cuộn xuống</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-amber-200" />
        </div>
      </section>

      {/* ========================================================
          SECTION 2: MONOGRAM & 3 IMAGES
      ======================================================== */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-xl mx-auto text-center">
          {/* Monogram */}
          <div className="font-display text-5xl sm:text-6xl text-[#7A1C29] font-bold tracking-wider">
            K <span className="font-script text-5xl sm:text-6xl text-[#C48B92] font-normal mx-0.5">&amp;</span> A
          </div>

          <p className="font-serif italic text-base sm:text-lg text-[#3A2A2B]/85 mt-4 max-w-md mx-auto leading-relaxed">
            “We step into a new chapter together, hand in hand, ready to build our home and embrace a lifetime of love.”
          </p>

          <p className="font-serif text-sm text-[#7A1C29] font-semibold mt-2">
            — Bước vào một chương mới, cùng nắm tay xây đắp tổ ấm trọn vẹn —
          </p>

          {/* 3 Photos Gallery with "23 10 20" */}
          <div className="relative mt-10 grid grid-cols-3 gap-2.5 sm:gap-4">
            {[galleryImages[1], galleryImages[2], galleryImages[3]].map((img, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx + 1)}
                className="group relative aspect-1/2 rounded-md overflow-hidden shadow-lg border border-[#7A1C29]/15 cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>
            ))}

            {/* Big Date Overlay */}
            <div className="absolute bottom-4 inset-x-0 flex justify-around items-center pointer-events-none font-display text-4xl sm:text-5xl font-bold text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              <span>23</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>
          <p className="text-xs text-stone-500 italic mt-3">Chạm vào ảnh để phóng to xem rõ nét</p>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: CALENDAR & PARENTS
      ======================================================== */}
      <section ref={calendarRef} className="py-16 sm:py-20 px-4 bg-[#F3EFEA] border-y border-[#7A1C29]/10">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#7A1C29] font-semibold">
            Save Our Date
          </p>
          <h2 className="font-script text-5xl sm:text-6xl text-[#7A1C29] mt-1">October</h2>

          {/* Calendar Grid */}
          <div className="mt-8 max-w-xs mx-auto bg-white p-6 rounded-2xl shadow-md border border-[#7A1C29]/15">
            <div className="grid grid-cols-7 text-center text-xs font-serif gap-y-3 font-semibold text-stone-600">
              <div className="text-[#C48B92]">HAI</div>
              <div className="text-[#C48B92]">BA</div>
              <div className="text-[#C48B92]">TƯ</div>
              <div className="text-[#C48B92]">NĂM</div>
              <div className="text-[#C48B92]">SÁU</div>
              <div className="text-[#C48B92]">BẢY</div>
              <div className="text-[#C48B92]">CN</div>

              {/* Empty days before 1st Oct 2020 (Thursday) */}
              <div />
              <div />
              <div />
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>

              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>
              <div>9</div>
              <div>10</div>
              <div>11</div>

              <div>12</div>
              <div>13</div>
              <div>14</div>
              <div>15</div>
              <div>16</div>
              <div>17</div>
              <div>18</div>

              <div>19</div>
              <div>20</div>
              <div>21</div>
              <div>22</div>

              {/* Highlighted 23rd */}
              <div className="relative flex items-center justify-center font-bold text-white">
                <span className="relative z-10">23</span>
                <Heart className="absolute inset-0 m-auto w-8 h-8 fill-[#7A1C29] text-[#7A1C29] animate-pulse" />
              </div>

              <div>24</div>
              <div>25</div>

              <div>26</div>
              <div>27</div>
              <div>28</div>
              <div>29</div>
              <div>30</div>
              <div>31</div>
              <div />
            </div>
          </div>

          {/* Calendar Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#7A1C29] text-xs font-serif font-bold border border-[#7A1C29]/30 shadow-sm hover:bg-[#7A1C29] hover:text-white transition-all cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Thêm vào Google Calendar
            </a>
            <button
              onClick={downloadIcsFile}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#7A1C29] text-xs font-serif font-bold border border-[#7A1C29]/30 shadow-sm hover:bg-[#7A1C29] hover:text-white transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Tải file iCal / Apple
            </button>
          </div>

          {/* Parents Row */}
          <div className="mt-14 pt-8 border-t border-[#7A1C29]/15 grid grid-cols-2 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white/70 border border-[#7A1C29]/10">
              <h4 className="font-serif font-bold text-[#7A1C29] text-base tracking-wide uppercase mb-1">
                NHÀ GÁI
              </h4>
              <p className="font-serif text-sm text-[#3A2A2B] leading-relaxed">
                Ông: <strong className="text-stone-900">Bùi Đình Bác</strong>
                <br />
                Bà: <strong className="text-stone-900">Nguyễn Thị Xuân</strong>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/70 border border-[#7A1C29]/10">
              <h4 className="font-serif font-bold text-[#7A1C29] text-base tracking-wide uppercase mb-1">
                NHÀ TRAI
              </h4>
              <p className="font-serif text-sm text-[#3A2A2B] leading-relaxed">
                Ông: <strong className="text-stone-900">Phạm Văn Hạnh</strong>
                <br />
                Bà: <strong className="text-stone-900">Nguyễn Ngọc Mai</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: WEDDING DETAILS & VENUE
      ======================================================== */}
      <section className="py-16 sm:py-24 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#7A1C29] font-medium font-sans">
            Trân trọng báo tin
          </p>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#7A1C29] mt-2 tracking-wide">
            BẢO KIỆN <br />
            <span className="font-script text-4xl sm:text-5xl text-[#C48B92] font-normal block my-1">
              &amp;
            </span>
            QUỲNH ANH
          </h2>

          <div className="my-8 py-6 px-4 bg-white/80 rounded-2xl border border-[#7A1C29]/15 shadow-sm">
            <p className="font-serif font-bold text-lg sm:text-xl text-[#7A1C29] tracking-wider">
              10:00 • THỨ SÁU
            </p>
            <div className="flex items-center justify-center gap-4 my-2 text-base font-bold text-[#7A1C29]">
              <span className="uppercase tracking-widest text-xs sm:text-sm text-stone-600 font-sans">
                Tháng 10
              </span>
              <span className="font-display text-5xl sm:text-6xl font-bold text-[#7A1C29] leading-none">
                23
              </span>
              <span className="uppercase tracking-widest text-xs sm:text-sm text-stone-600 font-sans">
                Năm 2020
              </span>
            </div>
            <p className="font-serif italic text-stone-600 text-sm mt-2">
              (Tức ngày 07 tháng 09 năm Canh Tý)
            </p>
          </div>

          {/* Venue Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#7A1C29]/20 shadow-md">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-sans">
              Hôn lễ được tổ chức tại
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#3A2A2B] mt-2 mb-3">
              WHITE PALACE
            </h3>
            <p className="font-serif text-sm sm:text-base text-stone-700 leading-relaxed max-w-md mx-auto">
              588 Phạm Văn Đồng, Phường Hiệp Bình Chánh, <br />
              TP. Thủ Đức, TP. Hồ Chí Minh
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://maps.google.com/?q=White+Palace+588+Pham+Van+Dong+Thu+Duc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7A1C29] hover:bg-[#5C1A23] text-white text-xs font-serif font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                Xem chỉ đường Google Maps
              </a>
              <button
                onClick={copyVenueAddress}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-serif transition-all cursor-pointer"
              >
                {copiedAddress ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Sao chép địa chỉ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: CURVED TIMELINE
      ======================================================== */}
      <section className="py-16 sm:py-24 px-4 bg-[#F3EFEA] border-y border-[#7A1C29]/10">
        <div className="max-w-xl mx-auto">
          <h2 className="font-script text-5xl sm:text-6xl text-[#7A1C29] text-center mb-10">
            Timeline
          </h2>

          <div className="relative max-w-sm mx-auto py-4">
            {/* 14:00 - Left */}
            <div className="relative w-1/2 pr-8 text-right border-r-2 border-[#7A1C29] pb-12">
              <div className="absolute top-1 -right-[7px] w-3 h-3 rounded-full bg-[#7A1C29] ring-4 ring-[#F3EFEA]" />
              <div className="font-display text-xl sm:text-2xl font-bold text-[#7A1C29]">14:00</div>
              <div className="font-serif font-bold text-sm tracking-wider uppercase text-stone-900 mt-1">
                RƯỚC DÂU
              </div>
              <p className="text-xs text-stone-600 italic mt-0.5">Nghi thức gia tiên hai họ</p>
              <span className="text-2xl mt-1 inline-block">💐</span>
            </div>

            {/* 17:00 - Right */}
            <div className="relative w-1/2 ml-auto pl-8 text-left border-l-2 border-[#7A1C29] pb-12 -mt-2">
              <div className="absolute top-1 -left-[7px] w-3 h-3 rounded-full bg-[#7A1C29] ring-4 ring-[#F3EFEA]" />
              <div className="font-display text-xl sm:text-2xl font-bold text-[#7A1C29]">17:00</div>
              <div className="font-serif font-bold text-sm tracking-wider uppercase text-stone-900 mt-1">
                LỄ THÀNH HÔN
              </div>
              <p className="text-xs text-stone-600 italic mt-0.5">Trao nhẫn &amp; cắt bánh cưới</p>
              <span className="text-2xl mt-1 inline-block">💍</span>
            </div>

            {/* 17:30 - Left */}
            <div className="relative w-1/2 pr-8 text-right border-r-2 border-[#7A1C29] pb-12 -mt-2">
              <div className="absolute top-1 -right-[7px] w-3 h-3 rounded-full bg-[#7A1C29] ring-4 ring-[#F3EFEA]" />
              <div className="font-display text-xl sm:text-2xl font-bold text-[#7A1C29]">17:30</div>
              <div className="font-serif font-bold text-sm tracking-wider uppercase text-stone-900 mt-1">
                KHAI TIỆC
              </div>
              <p className="text-xs text-stone-600 italic mt-0.5">Dạ tiệc tri ân ấm cúng</p>
              <span className="text-2xl mt-1 inline-block">🍽️</span>
            </div>

            {/* 19:00 - Right (Final) */}
            <div className="relative w-1/2 ml-auto pl-8 text-left border-l-2 border-transparent pb-4 -mt-2">
              <div className="absolute top-1 -left-[7px] w-3 h-3 rounded-full bg-[#7A1C29] ring-4 ring-[#F3EFEA]" />
              <div className="font-display text-xl sm:text-2xl font-bold text-[#7A1C29]">19:00</div>
              <div className="font-serif font-bold text-sm tracking-wider uppercase text-stone-900 mt-1">
                ÂM NHẠC &amp; KHIÊU VŨ
              </div>
              <p className="text-xs text-stone-600 italic mt-0.5">Lưu lại những khoảnh khắc đẹp</p>
              <span className="text-2xl mt-1 inline-block">🎵</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: DRESSCODE & ARTFUL PHOTO COLLAGE
      ======================================================== */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="font-script text-5xl sm:text-6xl text-[#7A1C29] text-center mb-3">
            Dresscode
          </h2>
          <p className="font-serif text-center text-sm text-stone-600 max-w-md mx-auto mb-6">
            Để những khung hình kỷ niệm thêm phần hài hòa và trang trọng, quý khách vui lòng lựa chọn trang phục theo gam màu gợi ý dưới đây:
          </p>

          {/* Color swatches */}
          <div className="flex justify-center gap-4 sm:gap-6 mb-12">
            {[
              { color: '#7A1C29', label: 'Burgundy' },
              { color: '#C48B92', label: 'Dusty Rose' },
              { color: '#E8D8D3', label: 'Champagne' },
              { color: '#9C7664', label: 'Warm Mocha' },
            ].map((s, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md border-2 border-white hover:scale-110 transition-transform"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[11px] font-serif text-stone-600 font-medium">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* OUR MOMENTS MASONRY LAYOUT */}
          <div className="relative w-full aspect-4/5 sm:aspect-square my-8 rounded-2xl bg-[#FAF6F2] p-4 border border-[#7A1C29]/15 overflow-hidden shadow-sm">
            <span className="absolute top-[8%] left-[8%] font-script text-3xl sm:text-4xl text-[#7A1C29] z-20 drop-shadow-sm">
              Forever
            </span>

            {/* Top right image */}
            <div
              onClick={() => setLightboxIndex(4)}
              className="absolute top-[4%] right-[8%] w-[50%] h-[38%] rounded shadow-md border-4 border-white overflow-hidden cursor-pointer group"
            >
              <img
                src={galleryImages[4].src}
                alt="Our Moments"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Small decorative love you */}
            <span className="absolute top-[44%] right-[10%] font-script text-2xl sm:text-3xl text-[#7A1C29] z-20">
              Love you
            </span>

            {/* Center title box */}
            <div className="absolute top-[32%] left-[6%] w-[46%] h-[32%] bg-[#F4EBE5] rounded shadow-inner flex flex-col items-center justify-center p-3 border border-[#7A1C29]/15 z-20">
              <span className="font-display tracking-[0.25em] text-xs sm:text-sm font-bold text-[#7A1C29] uppercase">
                OUR
              </span>
              <span className="font-script text-4xl sm:text-5xl text-[#7A1C29] leading-none mt-1">
                Moments
              </span>
            </div>

            {/* Bottom image */}
            <div
              onClick={() => setLightboxIndex(6)}
              className="absolute bottom-[6%] right-[6%] w-[54%] h-[42%] rounded shadow-md border-4 border-white overflow-hidden cursor-pointer group z-10"
            >
              <img
                src={galleryImages[6].src}
                alt="Our Moments"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bottom left quote */}
            <div className="absolute bottom-[10%] left-[8%] w-[36%] text-center font-serif italic text-xs sm:text-sm text-[#7A1C29] font-semibold leading-relaxed">
              A collection of memories we’ve shared together
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: GUESTBOOK FORM & CANVAS KEEPSAKE
      ======================================================== */}
      <section ref={formRef} className="py-16 sm:py-24 px-4 bg-[#FAF7F5] border-t border-[#7A1C29]/10">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#7A1C29] font-semibold">
            RSVP &amp; Guestbook
          </p>
          <h2 className="font-script text-5xl sm:text-6xl text-[#7A1C29] mt-1 mb-3">
            Sổ Lưu Bút &amp; Xác Nhận
          </h2>
          <p className="font-serif text-sm sm:text-base text-stone-600 mb-8 max-w-md mx-auto leading-relaxed">
            Vui lòng xác nhận sự tham dự của bạn để chúng mình chuẩn bị đón tiếp một cách chu đáo nhất.
            Trân trọng cảm ơn!
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmitWish}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-[#7A1C29]/20 text-left space-y-4"
          >
            {/* Guest Name */}
            <div>
              <label htmlFor="guestName" className="block text-xs font-serif font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Họ và tên của bạn *
              </label>
              <input
                id="guestName"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nhập tên của bạn hoặc gia đình"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#7A1C29] focus:ring-1 focus:ring-[#7A1C29] outline-none font-serif text-base bg-stone-50/50"
              />
            </div>

            {/* Guest Wish */}
            <div>
              <label htmlFor="guestWish" className="block text-xs font-serif font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Lời chúc gửi đôi uyên ương *
              </label>
              <textarea
                id="guestWish"
                rows={3}
                required
                value={guestWish}
                onChange={(e) => setGuestWish(e.target.value)}
                placeholder="Gửi gắm những lời chúc tốt lành và ngọt ngào nhất..."
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#7A1C29] focus:ring-1 focus:ring-[#7A1C29] outline-none font-serif text-base bg-stone-50/50"
              />
            </div>

            {/* Attendance Select */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="attendance" className="block text-xs font-serif font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Xác nhận tham dự *
                </label>
                <select
                  id="attendance"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#7A1C29] outline-none font-serif text-sm bg-stone-50/50 cursor-pointer font-semibold text-[#7A1C29]"
                >
                  <option value="Tham dự">Sẽ tham gia</option>
                  <option value="Không tham dự">Rất tiếc không thể đến</option>
                </select>
              </div>

              <div>
                <label htmlFor="plusOne" className="block text-xs font-serif font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Bạn đi cùng ai?
                </label>
                <select
                  id="plusOne"
                  value={plusOne}
                  onChange={(e) => setPlusOne(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#7A1C29] outline-none font-serif text-sm bg-stone-50/50 cursor-pointer"
                >
                  <option value="Đi 1 mình">Đi 1 mình</option>
                  <option value="Đi cùng 1 người">Đi cùng 1 người</option>
                  <option value="Đi cùng gia đình">Đi cùng gia đình</option>
                </select>
              </div>

              <div>
                <label htmlFor="guestOf" className="block text-xs font-serif font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Khách mời của ai?
                </label>
                <select
                  id="guestOf"
                  value={guestOf}
                  onChange={(e) => setGuestOf(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#7A1C29] outline-none font-serif text-sm bg-stone-50/50 cursor-pointer"
                >
                  <option value="Nhà trai">Nhà trai (Bảo Kiện)</option>
                  <option value="Nhà gái">Nhà gái (Quỳnh Anh)</option>
                  <option value="Cả hai">Bạn chung cả hai</option>
                </select>
              </div>
            </div>

            {/* Photo upload for Canvas keepsake */}
            <div>
              <label className="block text-xs font-serif font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Ảnh kỷ niệm cùng cô dâu chú rể (Tùy chọn)
              </label>
              <label
                htmlFor="guestImage"
                className="flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-[#7A1C29]/30 hover:border-[#7A1C29] rounded-xl cursor-pointer bg-stone-50/70 hover:bg-stone-50 transition-all text-sm font-serif text-[#7A1C29]"
              >
                <Camera className="w-4 h-4" />
                <span>
                  {guestImageFile ? guestImageFile.name : 'Chạm để tải ảnh / thiệp lưu niệm'}
                </span>
              </label>
              <input
                id="guestImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {guestImagePreview && (
                <div className="mt-2 flex items-center gap-3 bg-stone-100 p-2 rounded-lg">
                  <img
                    src={guestImagePreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded border border-stone-300"
                  />
                  <div className="text-xs text-stone-600">
                    <p className="font-semibold text-stone-800">Đã chọn ảnh kỷ niệm</p>
                    <p className="text-[11px] text-stone-500">Ảnh sẽ được lồng vào thiệp chúc 1080x1080</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#7A1C29] hover:bg-[#5C1A23] active:scale-[0.99] text-white font-serif font-bold text-base tracking-widest uppercase shadow-lg shadow-[#7A1C29]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Đang xử lý tạo thiệp...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>XÁC NHẬN &amp; GỬI LỜI CHÚC</span>
                </>
              )}
            </button>
          </form>

          {/* Keepsake Preview Modal / Download if generated */}
          {submitSuccess && generatedCardUrl && (
            <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-lg text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#7A1C29]">
                Xác nhận thành công!
              </h3>
              <p className="font-serif text-sm text-stone-600 mt-1">
                Cảm ơn bạn rất nhiều. Thiệp chúc kỷ niệm riêng của bạn đã được khởi tạo:
              </p>

              <div className="my-4 max-w-xs mx-auto rounded-xl overflow-hidden shadow-md border border-[#7A1C29]/20">
                <img src={generatedCardUrl} alt="Keepsake Card" className="w-full h-auto" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={generatedCardUrl}
                  download={`${guestName.replace(/\s+/g, '_')}_wedding_wish.jpg`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A1C29] text-white font-serif text-sm font-bold shadow-md hover:bg-[#5C1A23] transition-all"
                >
                  <Download className="w-4 h-4" />
                  Tải thiệp kỷ niệm về máy (JPG)
                </a>
              </div>
            </div>
          )}

          {/* Sổ lưu bút trực tiếp (Live Wishes Wall) */}
          <div className="mt-14 text-left">
            <h3 className="font-serif font-bold text-xl text-[#7A1C29] mb-4 text-center">
              Lời Chúc Từ Khách Quý ({wishes.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#7A1C29]">{w.name}</h4>
                      <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                        {w.guestOf} • {w.attendance} • {w.createdAt}
                      </p>
                    </div>
                    {w.photoUrl && (
                      <img
                        src={w.photoUrl}
                        alt={w.name}
                        className="w-10 h-10 object-cover rounded-md border border-stone-200"
                      />
                    )}
                  </div>
                  <p className="font-serif italic text-stone-700 text-sm mt-2 leading-relaxed">
                    “{w.wish}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FOOTER
      ======================================================== */}
      <footer className="relative py-24 px-4 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1600&q=85"
            alt="Wedding Footer"
            className="w-full h-full object-cover filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#220407] via-[#220407]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto">
          <p className="font-serif italic text-base sm:text-lg text-white/95 leading-relaxed mb-6">
            Hẹn gặp bạn trong ngày đặc biệt nhất của chúng mình. <br />
            Sẽ thật hạnh phúc khi có bạn ở đó cùng sẻ chia niềm vui và chứng kiến khoảnh khắc ý nghĩa này.
          </p>

          <div className="font-script text-6xl sm:text-7xl text-amber-200 leading-none">
            Thank you!
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 text-xs font-serif text-white/70">
            Bảo Kiện &amp; Quỳnh Anh • 23.10.2020 • White Palace
          </div>
        </div>
      </footer>
    </div>
  );
}
