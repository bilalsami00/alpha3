// // src\app\(dashboard)\dashboard\media-library\MediaModal.tsx
// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import BaseModal from "../components/BaseModal";
// import Image from "next/image";
// import { useToastContext } from "../lib/ToastContext";

// export type MediaItem = {
//   id: string | number;
//   title: string;
//   description?: string;
//   thumbnailUrl?: string | null;
// };

// const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

// export default function MediaModalV2({
//   open,
//   onClose,
//   mode = "add",
//   initial,
//   onSave,
//   onDelete,
// }: {
//   open: boolean;
//   onClose: () => void;
//   mode?: "add" | "edit";
//   initial?: Partial<MediaItem> | null;
//   onSave: (payload: {
//     title: string;
//     description?: string;
//     file?: File | null;
//   }) => Promise<void> | void;
//   onDelete?: () => void;
// }) {
//   const { showToast } = useToastContext();

//   if (!open) return null;

//   const [title, setTitle] = useState(initial?.title ?? "");
//   const [description, setDescription] = useState(initial?.description ?? "");
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(
//     initial?.thumbnailUrl ?? null
//   );

//   const inputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     if (open) {
//       setTitle(initial?.title ?? "");
//       setDescription(initial?.description ?? "");
//       setFile(null);
//       setPreviewUrl(initial?.thumbnailUrl ?? null);
//       if (inputRef.current) inputRef.current.value = "";
//     }
//   }, [open, initial]);

//   useEffect(() => {
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     // revoke previous preview if it was an object URL
//     if (previewUrl && previewUrl.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(previewUrl);
//       } catch {}
//     }
//     setPreviewUrl(url);
//     return () => {
//       try {
//         URL.revokeObjectURL(url);
//       } catch {}
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [file]);

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0] ?? null;

//     if (!f) {
//       setFile(null);
//       return;
//     }

//     // Validate file type (must be a video)
//     if (!f.type || !f.type.startsWith("video/")) {
//       // Some OS/file combos may not send a MIME type — as extra fallback we can check extension,
//       // but MIME check should be sufficient for most cases.
//       showToast?.(
//         "Please select a video file (MP4 or other video formats).",
//         "error"
//       );
//       // clear input
//       if (inputRef.current) inputRef.current.value = "";
//       setFile(null);
//       return;
//     }

//     // Validate size
//     if (f.size > MAX_SIZE_BYTES) {
//       showToast?.("Video must be 500MB or smaller.", "error");
//       if (inputRef.current) inputRef.current.value = "";
//       setFile(null);
//       return;
//     }

//     // All good
//     setFile(f);
//   }

//   // fixing the above function to also prevent default behavior --> file explorer opening on clicking remove button
//   function handleRemovePreview(e?: React.MouseEvent) {
//     e?.stopPropagation(); // stop bubbling to label
//     e?.preventDefault(); // also prevent label default behavior

//     if (inputRef.current) inputRef.current.value = "";
//     if (previewUrl && previewUrl.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(previewUrl);
//       } catch {}
//     }
//     setPreviewUrl(null);
//     setFile(null);
//   }

//   const requiresFile = mode === "add";
//   const hasExistingPreview = !!(initial?.thumbnailUrl ?? previewUrl);
//   const canSave =
//     title.trim().length > 0 &&
//     (mode === "add" ? description.trim().length > 0 : true) &&
//     (mode === "add" ? !!file : !!file || hasExistingPreview);

//   async function handleSave() {
//     if (!canSave) return;
//     await onSave({
//       title: title.trim(),
//       description: description.trim() || undefined,
//       file,
//     });
//     onClose();
//   }

//   return (
//     <BaseModal
//       onClose={onClose}
//       className="min-w-[438px] max-2xl:max-h-[500px] rounded-xl bg-white overflow-hidden flex flex-col custom-scroll"
//     >
//       <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden">
//         {/* header */}
//         <div className="px-6 py-5 flex items-center justify-between border-b border-[#E9EDEE]">
//           <h3 className="txt-24 font-medium">
//             {mode === "add" ? "Add Video" : "Edit Video"}
//           </h3>
//           <button
//             onClick={onClose}
//             aria-label="Close"
//             className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
//           >
//             <Image
//               src="/CloseButton.svg"
//               alt="Close"
//               width={32}
//               height={32}
//               priority
//             />
//           </button>
//         </div>

//         {/* body */}
//         <div className="p-6 space-y-4 overflow-auto">
//           {/* video upload preview */}
//           <label className="block">
//             <div className="txt-14 font-normal text-gray-700 mb-2">Video</div>

//             <div className="w-full relative">
//               <label
//                 className={`
//                   dashed-figma rounded-lg cursor-pointer bg-white
//                   w-full h-[190px] overflow-hidden relative
//                   flex items-center justify-center
//                 `}
//               >
//                 <input
//                   ref={inputRef}
//                   type="file"
//                   accept="video/mp4,video/*"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />

//                 {previewUrl ? (
//                   <video
//                     src={previewUrl}
//                     className="absolute inset-0 w-full h-full object-cover"
//                     controls
//                     playsInline
//                   />
//                 ) : (
//                   <div className="text-center txt-14 font-normal">
//                     <div className="flex items-center justify-center mb-2">
//                       <Image
//                         src="/dashboardIcons/MediaLibrary/video-circle.svg"
//                         alt="Upload"
//                         width={32}
//                         height={32}
//                         className="mr-2"
//                       />
//                     </div>
//                     <div>Upload an MP4 (1080p) under 500MB.</div>
//                   </div>
//                 )}
//               </label>

//               {previewUrl && (
//                 <button
//                   type="button"
//                   onClick={handleRemovePreview}
//                   aria-label="Remove video"
//                   className="absolute top-3 right-3 z-20  flex items-center justify-center rounded-full"
//                 >
//                   <Image
//                     src="/CloseButton.svg"
//                     alt="Remove"
//                     width={20}
//                     height={20}
//                   />
//                 </button>
//               )}
//             </div>
//           </label>

//           {/* Title */}
//           <label className="block">
//             <div className="txt-14 font-normal text-gray-700 mb-2">Title</div>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter video title"
//               className="w-full rounded-md px-4 py-4 bg-[#F3F6F6] border border-transparent placeholder-[#9CA3AF] text-sm focus:outline-none focus-green"
//             />
//           </label>

//           {/* Description */}
//           <label className="block">
//             <div className="txt-14 font-normal text-gray-700 mb-2">
//               Description
//             </div>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Add Description"
//               rows={5}
//               className="w-full rounded-md px-4 py-6 bg-[#F3F6F6] border border-transparent placeholder-[#9CA3AF] text-sm resize-none focus:outline-none focus-green"
//             />
//           </label>
//         </div>

//         {/* footer */}
//         <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[#E9EDEE]">
//           <button
//             onClick={onClose}
//             className="w-25 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-white border border-[#E9EDEE]"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!canSave}
//             className="min-w-25 max-w-36 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {mode === "add" ? "Add" : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </BaseModal>
//   );
// }

















// src\app\(dashboard)\dashboard\media-library\MediaModal.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import BaseModal from "../components/BaseModal";
import Image from "next/image";
import { useToastContext } from "../lib/ToastContext";

export type MediaItem = {
  id: string | number;
  title: string;
  description?: string;
  thumbnailUrl?: string | null;
  mediaUrl?: string | null; // <-- added so initial can include a public video URL
};

const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

export default function MediaModalV2({
  open,
  onClose,
  mode = "add",
  initial,
  onSave,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  initial?: Partial<MediaItem> | null;
  onSave: (payload: {
    title: string;
    description?: string;
    file?: File | null;
  }) => Promise<void> | void;
  onDelete?: () => void;
}) {
  const { showToast } = useToastContext();

  if (!open) return null;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [file, setFile] = useState<File | null>(null);

  // support either a video preview (remote or object URL) or an image thumbnail
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(
    initial?.mediaUrl ?? null
  );
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    // if there's a thumbnail image and no mediaUrl, show the image
    initial?.thumbnailUrl ?? (initial?.mediaUrl ? null : null)
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDescription(initial?.description ?? "");
      setFile(null);
      setPreviewVideoUrl(initial?.mediaUrl ?? null);
      setPreviewImageUrl(initial?.thumbnailUrl ?? null);
      if (inputRef.current) inputRef.current.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  // cleanup for object URLs when `file` changes
  useEffect(() => {
    let objUrl: string | null = null;
    if (!file) return;
    objUrl = URL.createObjectURL(file);
    setPreviewVideoUrl(objUrl);
    setPreviewImageUrl(null); // clear any image preview when user chose a file

    return () => {
      if (objUrl) {
        try {
          URL.revokeObjectURL(objUrl);
        } catch {}
      }
    };
  }, [file]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;

    if (!f) {
      setFile(null);
      return;
    }

    // Validate file type (must be a video)
    if (!f.type || !f.type.startsWith("video/")) {
      showToast?.(
        "Please select a video file (MP4 or other video formats).",
        "error"
      );
      if (inputRef.current) inputRef.current.value = "";
      setFile(null);
      return;
    }

    // Validate size
    if (f.size > MAX_SIZE_BYTES) {
      showToast?.("Video must be 500MB or smaller.", "error");
      if (inputRef.current) inputRef.current.value = "";
      setFile(null);
      return;
    }

    // All good
    setFile(f);
  }

  // prevent default label click opening when removing preview
  function handleRemovePreview(e?: React.MouseEvent) {
    e?.stopPropagation();
    e?.preventDefault();

    if (inputRef.current) inputRef.current.value = "";
    // revoke object URL if the preview was an object URL
    if (previewVideoUrl && previewVideoUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewVideoUrl);
      } catch {}
    }
    setPreviewVideoUrl(null);
    setPreviewImageUrl(null);
    setFile(null);
  }

  const requiresFile = mode === "add";
  const hasExistingPreview = !!(previewVideoUrl ?? previewImageUrl);
  const canSave =
    title.trim().length > 0 &&
    (mode === "add" ? description.trim().length > 0 : true) &&
    (mode === "add" ? !!file || hasExistingPreview : !!file || hasExistingPreview);

  async function handleSave() {
    if (!canSave) return;
    await onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      file,
    });
    onClose();
  }

  return (
    <BaseModal
      onClose={onClose}
      className="min-w-[438px] max-2xl:max-h-[500px] rounded-xl bg-white overflow-hidden flex flex-col custom-scroll"
    >
      <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden">
        {/* header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#E9EDEE]">
          <h3 className="txt-24 font-medium">
            {mode === "add" ? "Add Video" : "Edit Video"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <Image
              src="/CloseButton.svg"
              alt="Close"
              width={32}
              height={32}
              priority
            />
          </button>
        </div>

        {/* body */}
        <div className="p-6 space-y-4 overflow-auto">
          {/* video upload preview */}
          <label className="block">
            <div className="txt-14 font-normal text-gray-700 mb-2">Video</div>

            <div className="w-full relative">
              <label
                className={`
                  dashed-figma rounded-lg cursor-pointer bg-white
                  w-full h-[190px] overflow-hidden relative
                  flex items-center justify-center
                `}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="video/mp4,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {previewVideoUrl ? (
                  <video
                    src={previewVideoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    playsInline
                  />
                ) : previewImageUrl ? (
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={previewImageUrl}
                      alt="Thumbnail"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="text-center txt-14 font-normal">
                    <div className="flex items-center justify-center mb-2">
                      <Image
                        src="/dashboardIcons/MediaLibrary/video-circle.svg"
                        alt="Upload"
                        width={32}
                        height={32}
                        className="mr-2"
                      />
                    </div>
                    <div>Upload an MP4 (1080p) under 500MB.</div>
                  </div>
                )}
              </label>

              {hasExistingPreview && (
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  aria-label="Remove video"
                  className="absolute top-3 right-3 z-20  flex items-center justify-center rounded-full"
                >
                  <Image
                    src="/CloseButton.svg"
                    alt="Remove"
                    width={20}
                    height={20}
                  />
                </button>
              )}
            </div>
          </label>

          {/* Title */}
          <label className="block">
            <div className="txt-14 font-normal text-gray-700 mb-2">Title</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full rounded-md px-4 py-4 bg-[#F3F6F6] border border-transparent placeholder-[#9CA3AF] text-sm focus:outline-none focus-green"
            />
          </label>

          {/* Description */}
          <label className="block">
            <div className="txt-14 font-normal text-gray-700 mb-2">
              Description
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add Description"
              rows={5}
              className="w-full rounded-md px-4 py-6 bg-[#F3F6F6] border border-transparent placeholder-[#9CA3AF] text-sm resize-none focus:outline-none focus-green"
            />
          </label>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-4 bg-[#F2F5F6] px-6 py-4 border-t border-[#E9EDEE]">
          <button
            onClick={onClose}
            className="w-25 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-white border border-[#E9EDEE]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="min-w-25 max-w-36 h-10 px-3 py-2 txt-16 font-semibold rounded-lg bg-[#0E0E0E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === "add" ? "Add" : "Save Changes"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
