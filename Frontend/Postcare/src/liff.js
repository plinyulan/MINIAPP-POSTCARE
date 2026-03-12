import liff from "@line/liff";

export const initLiff = async () => {
  try {
    await liff.init({
      liffId: "2009434609-FgGvmV1M",
    });
    return liff;
  } catch (error) {
    console.error("LIFF init failed:", error);
    return null;
  }
};