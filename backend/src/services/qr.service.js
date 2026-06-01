import QRCode from "qrcode";

export const generateQrDataUrl = async (value) =>
  QRCode.toDataURL(value, {
    width: 280,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
