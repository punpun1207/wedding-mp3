import React, { useState } from 'react';
import { X, Copy, Check, QrCode } from 'lucide-react';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const groomInfo = {
    name: 'BẢO KIỆN',
    role: 'Chú rể',
    bank: 'Vietcombank (VCB)',
    accountNumber: '1023456789',
    accountName: 'PHAM BAO KIEN',
    branch: 'Chi nhánh TP. Hồ Chí Minh',
    // Realistic SVG QR code illustration with bank styling
  };

  const brideInfo = {
    name: 'QUỲNH ANH',
    role: 'Cô dâu',
    bank: 'MB Bank',
    accountNumber: '9876543210',
    accountName: 'BUI QUYNH ANH',
    branch: 'Chi nhánh TP. Hồ Chí Minh',
  };

  const current = activeTab === 'groom' ? groomInfo : brideInfo;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#FBF9F7] rounded-2xl shadow-2xl border border-[#7A1C29]/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-[#7A1C29] text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <p className="font-script text-3xl text-amber-200">Hộp Mừng Cưới</p>
          <p className="text-xs uppercase tracking-widest text-white/80 font-serif mt-1">
            Gửi gắm lời chúc &amp; tình cảm
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#7A1C29]/15">
          <button
            onClick={() => setActiveTab('groom')}
            className={`flex-1 py-3 text-center text-sm font-serif font-bold transition-all cursor-pointer ${
              activeTab === 'groom'
                ? 'text-[#7A1C29] border-b-2 border-[#7A1C29] bg-[#7A1C29]/5'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Chú rể Bảo Kiện
          </button>
          <button
            onClick={() => setActiveTab('bride')}
            className={`flex-1 py-3 text-center text-sm font-serif font-bold transition-all cursor-pointer ${
              activeTab === 'bride'
                ? 'text-[#7A1C29] border-b-2 border-[#7A1C29] bg-[#7A1C29]/5'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Cô dâu Quỳnh Anh
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Simulated QR Code card */}
          <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center relative group">
            {/* Quick VietQR generated SVG view */}
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 rounded border border-dashed border-stone-300 p-2">
              <QrCode className="w-24 h-24 text-[#7A1C29]" />
              <span className="text-[10px] text-stone-500 font-mono mt-1">VietQR • {current.bank}</span>
              <span className="text-[9px] text-[#7A1C29] font-semibold">{current.accountNumber}</span>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-left bg-white p-4 rounded-xl border border-stone-200/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500">Chủ tài khoản:</span>
              <span className="font-bold text-[#7A1C29]">{current.accountName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500">Ngân hàng:</span>
              <span className="font-medium text-stone-800">{current.bank}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-stone-100">
              <span className="text-stone-500">Số tài khoản:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-sm text-[#7A1C29]">
                  {current.accountNumber}
                </span>
                <button
                  onClick={() => handleCopy(current.accountNumber, current.role)}
                  className="p-1 rounded text-stone-500 hover:text-[#7A1C29] hover:bg-stone-100 transition-all cursor-pointer"
                  title="Sao chép số tài khoản"
                >
                  {copiedKey === current.role ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            {copiedKey === current.role && (
              <p className="text-[11px] text-emerald-600 text-right font-medium">
                ✓ Đã sao chép số tài khoản
              </p>
            )}
          </div>

          <p className="font-serif italic text-xs text-stone-500 mt-4">
            Sự hiện diện và lời chúc của bạn là món quà ý nghĩa nhất dành cho chúng mình!
          </p>
        </div>
      </div>
    </div>
  );
};
