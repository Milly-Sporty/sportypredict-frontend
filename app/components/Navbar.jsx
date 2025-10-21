"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import * as React from "react";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import LogoImg from "@/public/assets/fullogo.png";
import styles from "@/app/style/navbar.module.css";
import { useDrawerStore } from "@/app/store/Drawer";
import { useAppBannerStore } from "@/app/store/AppBanner";
import { usePathname, useRouter } from "next/navigation";
import { FaDownload as DownloadIcon } from "react-icons/fa";
import { RiMenu5Fill as MenuIcon } from "react-icons/ri";
import { FaRegUser as UserIcon } from "react-icons/fa";
import { MdLogout as LogoutIcon } from "react-icons/md";
import { IoClose as CloseIcon } from "react-icons/io5";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { useEffect, useState, useCallback, useRef } from "react";

export default function NavbarComponent() {
  const { toggleOpen, setOpen, setClose } = useDrawerStore();
  const { showBanner, deviceOS, initializeBanner, dismissBanner, getAppLink } =
    useAppBannerStore();
  const [isMobile, setMobile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const {
    isAuth,
    username,
    profileImage,
    isVip,
    isAdmin,
    logout,
    clearUser,
    updateProfileImage,
  } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      initializeBanner();
    }
  }, [isClient, initializeBanner]);

  const handleBannerClose = () => {
    dismissBanner();
  };

  const handleAppDownload = () => {
    const appLink = getAppLink();
    if (appLink) {
      window.open(appLink, "_blank");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setClose();
        setMobile(true);
      } else {
        setOpen();
        setMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setOpen, setClose]);

  const handleLogin = () => {
    router.push("/authentication/login", { scroll: false });
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const result = await logout();

      if (result.success) {
        toast.success(result.message || "Logged out successfully");
        router.push("/", { scroll: false });
      } else {
        toast.error(result.message || "Logout failed");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
      clearUser();
      router.push("/", { scroll: false });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sportypredict = () => {
    router.push("/", { scroll: false });
  };

  const handleProfileImageClick = useCallback(() => {
    if (fileInputRef.current && !isUploadingImage) {
      fileInputRef.current.click();
    }
  }, [isUploadingImage]);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
        return;
      }

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size must be less than 100MB");
        return;
      }

      setIsUploadingImage(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target.result;

          try {
            const result = await updateProfileImage(base64String);
            if (result.success) {
              toast.success("Profile image updated successfully!");
            } else {
              toast.error(result.message || "Failed to update profile image");
            }
          } catch (error) {
            toast.error("Failed to update profile image");
          } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        };

        reader.onerror = () => {
          toast.error("Failed to read the image file");
          setIsUploadingImage(false);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("Failed to process the image");
        setIsUploadingImage(false);
      }
    },
    [updateProfileImage]
  );

  const ProfileImageComponent = () => (
    <div style={{ position: "relative", display: "inline-block" }}>
      {profileImage && profileImage.startsWith("https://") ? (
        <div className={styles.profileImgContainer}>
          <Image
            className={styles.profileImg}
            title="Click to change profile picture"
            src={profileImage}
            alt="profile"
            fill
            sizes="100%"
            quality={100}
            priority={true}
            onClick={handleProfileImageClick}
            style={{
              objectFit: "cover",
              cursor: isUploadingImage ? "not-allowed" : "pointer",
              opacity: isUploadingImage ? 0.7 : 1,
            }}
          />
        </div>
      ) : (
        <div className={`${styles.profileImg} skeleton`} />
      )}
      {isUploadingImage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <Loader />
        </div>
      )}
    </div>
  );

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isUploadingImage}
      />

      {isClient && showBanner && deviceOS && (
        <div className={styles.appBanner}>
          <button
            className={styles.bannerClose}
            onClick={handleBannerClose}
            aria-label="Close banner"
          >
            <CloseIcon />
          </button>
          <div className={styles.bannerContent}>
            <div className={styles.bannerContentInner}>
              <div className={styles.bannerIcon}>
                {deviceOS === "ios" ? <FaApple /> : <FaGooglePlay />}
              </div>
              <div className={styles.bannerText}>
                <h4>Get the SportyPredict App</h4>
                <p>Download now for a better experience</p>
              </div>
            </div>

            <button className={styles.bannerButton} onClick={handleAppDownload}>
              <DownloadIcon /> {isMobile ? "" : "Download"} 
            </button>
          </div>
        </div>
      )}

      <div className={styles.navContainer}>
        <div className={styles.navContainerInner}>
          {/* mobile */}
          <div className={styles.menuContainer}>
            <MenuIcon
              onClick={toggleOpen}
              className={styles.menuicon}
              alt="menu icon"
            />
            <div className={styles.navLogo} onClick={sportypredict}>
              <Image
                className={styles.logo}
                src={LogoImg}
                alt="logo"
                width={120}
                priority={true}
              />
            </div>
          </div>
          {/* desktop  */}
          <div className={styles.navlinksContainer}>
            <Link
              href="/news"
              className={`${styles.navlinks} ${
                pathname === "/news" ? styles.activeNavLinks : ""
              }`}
            >
              News
            </Link>
            <Link
              href="/blog"
              className={`${styles.navlinks} ${
                pathname === "/blog" ? styles.activeNavLinks : ""
              }`}
            >
              Blogs
            </Link>
            <Link
              href="/offers"
              className={`${styles.navlinks} ${
                pathname === "/offers" ? styles.activeNavLinks : ""
              }`}
            >
              Offers
            </Link>
            <Link
              href="/about"
              className={`${styles.navlinks} ${
                pathname === "/about" ? styles.activeNavLinks : ""
              }`}
            >
              About us
            </Link>
            <Link
              href="/contact"
              className={`${styles.navlinks} ${
                pathname === "/contact" ? styles.activeNavLinks : ""
              }`}
            >
              Contact us
            </Link>
          </div>

          <div className={styles.navStartContainer}>
            {isMobile && isAuth && (
              <div className={styles.navProfile}>
                <ProfileImageComponent />
              </div>
            )}
            {isAuth ? (
              <div className={styles.navStart}>
                <ProfileImageComponent />
                <div className={styles.userContainerDetails}>
                  <div className={styles.userContainer}>
                    <h1>{username || "Guest"}</h1>
                    <h2>{isAdmin ? "Admin" : isVip ? "VIP" : "User"}</h2>
                  </div>

                  <button
                    onClick={handleLogout}
                    className={styles.navButton}
                    disabled={isLoggingOut}
                    style={{
                      opacity: isLoggingOut ? 0.6 : 1,
                      cursor: isLoggingOut ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoggingOut ? (
                      <Loader size="small" />
                    ) : (
                      <LogoutIcon
                        className={styles.userIcon}
                        alt="logout icon"
                      />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={handleLogin} className={styles.navButton}>
                <UserIcon className={styles.userIcon} alt="login icon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
