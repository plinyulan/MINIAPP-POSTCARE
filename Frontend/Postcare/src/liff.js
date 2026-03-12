import liff from "@line/liff";

export async function initLiff() {
  await liff.init({
    liffId: "2009434609-FgGvmV1M"
  });

  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }

  return liff;
}