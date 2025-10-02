// // src\app\(dashboard)\dashboard\users\ViewModal.tsx
// "use client";
// import React from "react";
// import type { User } from "./types";
// import Image from "next/image";
// import InlineSelect from "../components/InlineSelect";

// export default function ViewModal({
//   user,
//   selectedTeam,
//   onChangeTeam,
//   onClose,
//   onReject,
//   onAdd,
// }: {
//   user: User;
//   selectedTeam: string;
//   onChangeTeam: (t: string) => void;
//   onClose: () => void;
//   onReject: () => void;
//   onAdd: () => void;
// }) {
//   const getInitials = (name: string) =>
//     name
//       .split(" ")
//       .map((p) => p[0])
//       .slice(0, 2)
//       .join("")
//       .toUpperCase();

//   const TEAM_OPTIONS: string[] = [
//     "team-north",
//     "team-south",
//     "team-enterprise",
//   ];

//   const teamLabel = (id: string | null) => {
//     switch (id) {
//       case "team-north":
//         return "North";
//       case "team-south":
//         return "South";
//       case "team-enterprise":
//         return "Enterprise";
//       default:
//         return "";
//     }
//   };

//   const addDisabled = !selectedTeam || selectedTeam.trim().length === 0;

//   return (
//     <div
//       className="fixed inset-0 bg-[#00000033] flex items-center justify-center z-50"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="view-user-title"
//     >
//       <div className="bg-white rounded-xl max-w-[438px]   max-sm:mx-6 relative">
//         <div className="px-6 py-4 flex items-center border-b border-[#E9EDEE]">
//           <h3 id="view-user-title" className="txt-24 font-medium">
//             View Request
//           </h3>
//           <button
//             onClick={onClose}
//             className="absolute right-4"
//             aria-label="Close"
//           >
//             <Image
//               src="/dashboardIcons/CloseButton.svg"
//               alt="Close"
//               width={32}
//               height={32}
//               style={{ opacity: 1 }}
//             />
//           </button>
//         </div>

//         <div className="flex-1 p-6">
//           <div className="flex items-center justify-start gap-3">
//             <div
//               className="w-12 h-12 rounded-full border flex items-center justify-center"
//               style={{ borderColor: "var(--Neutral-Grey-10,#E9EDEE)" }}
//             >
//               <span
//                 className="txt-18"
//                 style={{
//                   fontFamily: "SF Pro Display, sans-serif",
//                   fontWeight: 700,
//                 }}
//               >
//                 {getInitials(user.name)}
//               </span>
//             </div>
//             <div>
//               <div className="font-semibold txt-14">{user.name}</div>
//               <div className="txt-14 text-[#51595A]">{user.username}</div>
//             </div>
//           </div>

//           <div className="mt-3 txt-14">
//             <div className="font-medium">{user.phone ?? "-"}</div>
//           </div>

//           <div className="mt-4 txt-14">
//             <div className="mt-1 txt-14 font-medium leading-5 break-words">
//               {user.salesReason ?? "-"}
//             </div>
//           </div>

//           <div className="mt-4">
//             <div className="txt-14 mb-2">Team</div>

//             {/* InlineSelect usage */}
//             <InlineSelect<string>
//               value={selectedTeam || null}
//               onChange={(v) => onChangeTeam(v ?? "")}
//               items={TEAM_OPTIONS}
//               // show the friendly label both inside trigger and list items
//               renderItem={(id) => <span className="txt-12">{teamLabel(id)}</span>}
//               placeholder="Select team"
//               // apply your focus-green utility (Option A)
//               triggerClassName="focus-green"
//             />
//           </div>
//         </div>

//         <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-[#E9EDEE] bg-[#F2F5F6] rounded-b-2xl">
//           <button
//             onClick={onReject}
//             className="px-4 py-2 min-w-[100px] min-h-[40px] border border-gray-300 rounded-lg txt-16 font-semibold "
//           >
//             Reject
//           </button>
//           <button
//             onClick={onAdd}
//             disabled={addDisabled}
//             className={`px-3 py-2 max-w-[166px] min-h-[40px] bg-[#25292A] text-white rounded-lg txt-16 font-semibold ${
//               addDisabled ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             Add to Sales Team
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }








// src/app/(dashboard)/dashboard/users/ViewModal.tsx
"use client";
import React from "react";
import type { User } from "./types";
import Image from "next/image";
import InlineSelect from "../components/InlineSelect";
import BaseModal from "../components/BaseModal";

export default function ViewModal({
  user,
  selectedTeam,
  onChangeTeam,
  onClose,
  onReject,
  onAdd,
}: {
  user: User;
  selectedTeam: string;
  onChangeTeam: (t: string) => void;
  onClose: () => void;
  onReject: () => void;
  onAdd: () => void;
}) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const TEAM_OPTIONS: string[] = ["team-north", "team-south", "team-enterprise"];

  const teamLabel = (id: string | null) => {
    switch (id) {
      case "team-north":
        return "North";
      case "team-south":
        return "South";
      case "team-enterprise":
        return "Enterprise";
      default:
        return "";
    }
  };

  const addDisabled = !selectedTeam || selectedTeam.trim().length === 0;

  return (
    <BaseModal onClose={onClose} fixedSize={{ width: 438, height: undefined }}>
      {/* Only render the white modal card here - BaseModal handles overlay/centering */}
      <div className="bg-white rounded-xl max-w-[438px] max-sm:mx- 6 relative" aria-labelledby="view-user-title">
        <div className="px-6 py-4 flex items-center border-b border-[#E9EDEE]">
          <h3 id="view-user-title" className="txt-24 font-medium">
            View Request
          </h3>
          <button onClick={onClose} className="absolute right-4" aria-label="Close">
            <Image src="/dashboardIcons/CloseButton.svg" alt="Close" width={32} height={32} style={{ opacity: 1 }} />
          </button>
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-center justify-start gap-3">
            <div
              className="w-12 h-12 rounded-full border flex items-center justify-center"
              style={{ borderColor: "var(--Neutral-Grey-10,#E9EDEE)" }}
            >
              <span
                className="txt-18"
                style={{
                  fontFamily: "SF Pro Display, sans-serif",
                  fontWeight: 700,
                }}
              >
                {getInitials(user.name)}
              </span>
            </div>
            <div>
              <div className="font-semibold txt-14">{user.name}</div>
              <div className="txt-14 text-[#51595A]">{user.username}</div>
            </div>
          </div>

          <div className="mt-3 txt-14">
            <div className="font-medium">{user.phone ?? "-"}</div>
          </div>

          <div className="mt-4 txt-14">
            <div className="mt-1 txt-14 font-medium leading-5 break-words">
              {user.salesReason ?? "-"}
            </div>
          </div>

          <div className="mt-4">
            <div className="txt-14 mb-2">Team</div>

            {/* InlineSelect usage */}
            <InlineSelect<string>
              value={selectedTeam || null}
              onChange={(v) => onChangeTeam(v ?? "")}
              items={TEAM_OPTIONS}
              renderItem={(id) => <span className="txt-12">{teamLabel(id)}</span>}
              placeholder="Select team"
              triggerClassName="focus-green"
            />
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-[#E9EDEE] bg-[#F2F5F6] rounded-b-2xl">
          <button
            onClick={onReject}
            className="px-4 py-2 min-w-[100px] min-h-[40px] border border-gray-300 rounded-lg txt-16 font-semibold "
          >
            Reject
          </button>
          <button
            onClick={onAdd}
            disabled={addDisabled}
            className={`px-3 py-2 max-w-[166px] min-h-[40px] bg-[#25292A] text-white rounded-lg txt-16 font-semibold ${
              addDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Add to Sales Team
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
