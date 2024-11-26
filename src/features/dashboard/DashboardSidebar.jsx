import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  UserIcon,
  PencilSquareIcon,
  HomeIcon,
  CreditCardIcon,
  HeartIcon,
  UsersIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import Loading from "../../ui/Loading";
import { logOutUser } from "../../services/userService";
import { useQueryClient } from "@tanstack/react-query";

// Function to get token from cookies
const getAuthTokenFromCookies = () => {
  const match = document.cookie.match(new RegExp("(^| )authToken=([^;]+)"));
  return match ? match[2] : null;
};

function DashboardSidebar({ setSelectedTab, user }) {
  const svgClasses = "ml-1 w-5 h-5 text-current";
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const token = getAuthTokenFromCookies();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logOutUser();
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      queryClient.setQueryData(["get-user"], null);
      queryClient.invalidateQueries(["get-user"]);
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full overflow-auto rounded-xl flex flex-col justify-start pt-4 items-center py-4 lg:pt-1 gap-y-1.5 lg:gap-y-3">
      <img
        className="border rounded-full w-24"
        src={user?.avatar || "/path-to-default-avatar.png"}
        alt="Profile"
      />
      <span className="font-semibold opacity-80">
        {user?.name || "نام کاربر"}
      </span>

      <span className="flex text-xs opacity-70">
        <div>شماره تلفن :</div>
        <div className="mr-1">{user?.phone || "شماره ثبت نشده"}</div>
      </span>

      {/* Admin Panel Button for Admin Users */}
      {user?.type === "Admin" && (
        <form
          action="https://portal1.jatajar.com/api/auth/login/admin"
          method="POST"
        >
          <input type="hidden" name="token" value={token} />
          <button
            type="submit"
            className="text-sm opacity-80 border rounded-xl px-6 py-2 flex justify-center flex-row-reverse items-center hover:text-blue-600 hover:bg-blue-100 transition-all"
          >
            ورود به پنل ادمین
          </button>
        </form>
      )}

      {/* Logout Button with Spinner */}
      <button
        onClick={handleLogout}
        className="text-sm opacity-80 border w-44 rounded-xl px-8 py-2 flex justify-center flex-row-reverse items-center hover:text-red-600 hover:bg-red-100 transition-all"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? <Loading size={20} /> : "خروج"}
      </button>

      <Tab.Group className="w-full">
        <Tab.List className="border rounded-xl flex flex-col justify-center items-center p-2 gap-y-2">
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("profile")}
          >
            پروفایل
            <UserIcon className={`${svgClasses}`} />
          </Tab>
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("editProfile")}
          >
            ویرایش اطلاعات
            <PencilSquareIcon className={`${svgClasses}`} />
          </Tab>
          {user?.type === "Vendor" && (
            <Tab
              as="div"
              className={({ selected }) =>
                `tab ${selected ? "tab-selected" : "tab-hover"}`
              }
              onClick={() => setSelectedTab("houses")}
            >
              اقامتگاه ها
              <HomeIcon className={`${svgClasses}`} />
            </Tab>
          )}
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("wallet")}
          >
            کیف پول
            <CreditCardIcon className={`${svgClasses}`} />
          </Tab>
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("favorites")}
          >
            علاقه مندی ها
            <HeartIcon className={`${svgClasses}`} />
          </Tab>
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("inviteFriends")}
          >
            دعوت از دوستان
            <UsersIcon className={`${svgClasses}`} />
          </Tab>
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("reserves")}
          >
            رزرو ها
            <CalendarIcon className={`${svgClasses}`} />
          </Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  );
}

export default DashboardSidebar;
