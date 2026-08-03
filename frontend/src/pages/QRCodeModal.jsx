import React from "react";
import { QRCodeSVG } from "qrcode.react";

function AppQRCode() {
  const targetUrl = "https://frontend-np14.vercel.app/";

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md max-w-7xl h-auto mx-auto my-4 text-center">
      <h3 className="text-lg font-bold text-gray-800 mb-2">my
        ສະແກນ QR Code ເພື່ອເຂົ້າເວັບ
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        ໃຊ້ກ້ອງມືຖື ຫຼື ແອັບສະແກນ QR Code ເພື່ອເປີດລິ້ງ
      </p>

      {/* 🟢 QR Code Component */}
      <div className="p-1 bg-white border-2 border-amber-400 rounded-xl shadow-inner">
        <QRCodeSVG
          value={targetUrl}
          size={300}
          bgColor={"#FFFFFF"}
          fgColor={"#000000"}
          level={"H"} // Error correction level
          includeMargin={true}
        />
      </div>

      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-xs font-semibold text-blue-600 underline hover:text-blue-800 break-all"
      >
        {targetUrl}
      </a>
    </div>
  );
}

export default AppQRCode;