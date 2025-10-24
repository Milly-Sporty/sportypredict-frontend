import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAppBannerStore = create(
  persist(
    (set, get) => ({
      showBanner: false,
      dismissedAt: null,
      deviceOS: null,
      isInitialized: false,

      initializeBanner: () => {
        if (typeof window === "undefined") return;

        const detectOS = () => {
          const userAgent = window.navigator.userAgent.toLowerCase();
          const isIOS = /iphone|ipad|ipod/.test(userAgent);
          const isAndroid = /android/.test(userAgent);

          if (isIOS) return "ios";
          if (isAndroid) return "android";
          return null; // Not a mobile device
        };

        const os = detectOS();
        const { dismissedAt, isInitialized } = get();

        if (isInitialized) return;

        // Only show banner for mobile devices (iOS or Android)
        if (!os) {
          set({ showBanner: false, deviceOS: null, isInitialized: true });
          return;
        }

        if (dismissedAt) {
          const currentTime = Date.now();
          const sixHoursInMs = 6 * 60 * 60 * 1000;

          if (currentTime - dismissedAt >= sixHoursInMs) {
            set({ showBanner: true, deviceOS: os, dismissedAt: null, isInitialized: true });
          } else {
            set({ showBanner: false, deviceOS: os, isInitialized: true });
          }
        } else {
          set({ showBanner: true, deviceOS: os, isInitialized: true });
        }
      },

      dismissBanner: () => {
        set({ showBanner: false, dismissedAt: Date.now() });
      },

      getAppLink: () => {
        const { deviceOS } = get();
        if (deviceOS === "ios") {
          return "https://apps.apple.com/app/id6752551522";
        }
        if (deviceOS === "android") {
          return "https://play.google.com/store/apps/details?id=com.sportypredict.sportypredict";
        }
        return "https://play.google.com/store/apps/details?id=com.sportypredict.sportypredict";
      },

      resetBanner: () => {
        set({ showBanner: false, dismissedAt: null, deviceOS: null, isInitialized: false });
      },
    }),
    {
      name: "appbanner-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);